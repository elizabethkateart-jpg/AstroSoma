-- ESQUEMA DE ASTROSOMA — ya aprobado, ver ESTADO.md "Modelo de datos" (2026-09-10).
-- Ejecutar completo en Supabase → SQL Editor → New query → pegar todo → Run.

-- 1) Perfil (extiende auth.users, 1:1)
create table public.perfiles (
  id                 uuid primary key references auth.users(id) on delete cascade,
  nombre             text,
  fecha_nacimiento   date,
  ciudad_nacimiento  text,
  sol_natal          text, -- carta natal simplificada (Sol/Luna), calculada al guardar fecha_nacimiento
  luna_natal         text, -- sin hora de nacimiento (decisión: no pedirla, pierde gente que no la sabe)
  categoria_duelo    text not null default 'ruptura'
                       check (categoria_duelo in ('ruptura','perdida','cambio','ansiedad','otro','somatica')),
  plan               text not null default 'mensual' check (plan in ('mensual','anual')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
alter table public.perfiles enable row level security;
create policy "select_own" on public.perfiles for select using ((select auth.uid()) = id);
create policy "update_own" on public.perfiles for update
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
-- el insert lo hace el trigger de creación de usuario (webhook Hotmart / signup), no el cliente.

-- 2) Historial diario ("Hoy" de cada día) — racha/estadísticas se DERIVAN de aquí, no se duplican.
create table public.escaneos (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users(id) on delete cascade,
  fecha                  date not null default current_date,
  zona                   text not null,
  pct_liberado           int not null default 0 check (pct_liberado between 0 and 100),
  minutos_respiracion    int not null default 0,
  dias_sin_contacto      int not null default 0,
  ejercicio_hecho        boolean not null default false,
  created_at             timestamptz not null default now(),
  unique (user_id, fecha)
);
create index escaneos_user_fecha_idx on public.escaneos (user_id, fecha desc);
alter table public.escaneos enable row level security;
create policy "select_own" on public.escaneos for select using ((select auth.uid()) = user_id);
create policy "insert_own" on public.escaneos for insert with check ((select auth.uid()) = user_id);
create policy "update_own" on public.escaneos for update
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- 3) Diario privado
create table public.diario_entradas (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  texto       text not null check (length(texto) between 1 and 2000),
  created_at  timestamptz not null default now()
);
create index diario_user_created_idx on public.diario_entradas (user_id, created_at desc);
alter table public.diario_entradas enable row level security;
create policy "select_own" on public.diario_entradas for select using ((select auth.uid()) = user_id);
create policy "insert_own" on public.diario_entradas for insert with check ((select auth.uid()) = user_id);
create policy "delete_own" on public.diario_entradas for delete using ((select auth.uid()) = user_id);

-- 4) Caché POR USUARIO del motor astrológico (antes era global: el mensaje ahora combina el
--    tránsito de hoy con la carta natal de cada persona, así que ya no es igual para todos).
create table public.lecturas_diarias (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  fecha          date not null,
  -- zona/mensaje/signo_luna NO son NOT NULL: dos endpoints distintos pueden crear la fila del día
  -- por separado (lectura-diaria o prompt-diario, cualquiera puede llegar primero) — ver 2026-09-23.
  signo_luna     text,
  zona           text,
  mensaje        text,
  porque         text, -- conecta la carta natal con el tránsito de hoy, tono simbólico (2026-09-23)
  consejo        text, -- consejo práctico extra, además del ejercicio de respiración
  prompt_diario  text, -- pregunta personalizada para la entrada de diario del día (2026-09-23)
  created_at     timestamptz not null default now(),
  unique (user_id, fecha)
);
create index lecturas_diarias_user_fecha_idx on public.lecturas_diarias (user_id, fecha desc);
alter table public.lecturas_diarias enable row level security;
create policy "select_own" on public.lecturas_diarias for select using ((select auth.uid()) = user_id);
-- Solo el servidor (service_role, que ignora RLS) inserta — sin policy de insert para el cliente.

-- 5) Trigger: crea la fila de perfiles automáticamente al crear un usuario (magic link / OAuth).
create function public.crear_perfil_nuevo_usuario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.crear_perfil_nuevo_usuario();

-- La función solo debe correr como trigger (dueño postgres) — nunca invocable directo por
-- anon/authenticated vía /rest/v1/rpc/crear_perfil_nuevo_usuario (hallazgo del advisor).
revoke execute on function public.crear_perfil_nuevo_usuario() from public, anon, authenticated;
