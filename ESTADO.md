# ESTADO.md — AstroSoma

## Resumen del proyecto
App: **AstroSoma**. Guía diaria de salud somática y astrología: identifica en qué zona del cuerpo
se acumula tensión física/emocional (duelo, ruptura, estrés, malestar físico constante) según la
carta natal, y da ejercicios de liberación somática de 3 minutos ("el Escaneo Somático").
Diferenciador: cero notificaciones fatalistas de IA, mecanismo somático concreto, privacidad total.

Idea validada con investigación previa (prompt del curso) en `ASTROSOMA.pdf` — no se re-valida.
Ver `FICHA-AVATAR.md`, `FICHA-MERCADO.md`, `FICHA-MODELO.md`, `FICHA-ARTE.md` para el detalle.

## Decisiones ya tomadas (cosa juzgada — no redecidir)
- **Monetización:** Freemium — Anual $49.99/año ($4.17/mes) o Mensual $8.99/mes, 7 días de prueba
  gratis + 15 días de garantía tras el cobro. Ver `FICHA-MERCADO.md` §1.
- **Pasarela de venta:** Hotmart — el usuario aún no tiene cuenta (pospuesto a propósito).
- **Funciones núcleo v1:** escaneo somático por tránsitos natales, "Programa de Sanación" de 30
  días, ejercicio de respiración de 3 min (único tipo por ahora), diario privado cifrado.
- **App modelo:** Co–Star Personalized Astrology — mismo mecanismo (carta + tránsito diario),
  corrigiendo su queja #1 (tono fatalista) con el ángulo somático.
- **Dirección de arte — azul marino** (adenda 2026-09-09, detalle en `FICHA-ARTE.md`): `--bg
  #0F2436`, `--surface #1B3A4D`, `--accent #C4A177` (dorado), `--accent-2 #D08B5E`. Display:
  Cormorant Garamond. Logo oficial del usuario (`Isotipo.tsx` en toda la app, `LogoCompleto.tsx`
  con wordmark solo en footer — el nombre visible sigue siendo "AstroSoma").
- **Auth:** magic link/OTP por email (combo enlace+código) + OAuth Google secundario. Passkeys
  recién tras la primera victoria dentro de la app.
- **Retención:** gatillo (abrir Hoy) → acción (escaneo + 3 min) → recompensa (% liberado) →
  inversión (racha, Programa día N/30).
- **Dos rutas de onboarding, aditivas** (2026-09-14): duelo/ruptura (original) + salud somática
  sin duelo (nueva) — ninguna reemplaza a la otra, ver FICHA-AVATAR.md "Segundo avatar".
- **Sin comunidad/red social dentro de la app** (2026-09-15) — choca con la promesa de privacidad
  total y exige moderación que una operación de una persona no sostiene. Descartado a propósito.
- **Carta natal NO se amplía a otras lecturas todavía** (compatibilidad/personalidad/trabajo,
  2026-09-20) — mantener el diferenciador de UNA sola cosa (dónde vive la tensión hoy), no competir
  de frente con Co-Star/The Pattern. Base técnica ya existe; retomar solo con usuarios pagando
  pidiéndolo.

## Paso actual — Paso 6 en curso (Supabase conectado, Hotmart pendiente)
App interna navegable de punta a punta, con datos y login reales (ya no simulados) contra un
proyecto real de Supabase (`eteofnqhkvhcgtghextc`, `ca-central-1`). Revisión visual: ver
"Problemas conocidos" (ninguna de las 4 pantallas del dinero tiene veredicto LISTA, a propósito).
Sigue pendiente conectar Hotmart — mientras tanto `signInWithOtp` usa `shouldCreateUser:true`
(cualquier correo puede entrar), a endurecer cuando el webhook de Hotmart exista.

## Pantallas creadas
- `/` — Landing de ventas (10 secciones canónicas + video en Problema + imágenes en Agitación/
  Solución/Garantía). `app/page.tsx`.
- `/onboarding` — pregunta de intención inicial → ruta **duelo** (7 pasos) o ruta **somática**
  (zona corporal, frecuencia, reconocimiento) → loading → resultado (lectura real de IA, 3 partes).
- `/paywall` → `/entrar` (login real) + `/entrar/ayuda` → `/app`.
- `/app` (Hoy/Duelo·Ritual/Diario/Perfil/Mecanismo) — nav inferior y todo el copy de Hoy/Duelo se
  adaptan según `categoriaDuelo` (ruptura/pérdida/cambio/ansiedad/otro/**somática**).
- Legales: `/privacidad`, `/terminos`, `/reembolsos`, `/aviso-ia` (placeholders, etapa dedicada
  pendiente — skill `legal`).

## Servicios externos — Paso 6
- **Supabase**: esquema en `supabase/schema.sql` (4 tablas: `perfiles`, `escaneos`,
  `diario_entradas`, `lecturas_diarias` — RLS con `(select auth.uid())`, trigger de creación de
  perfil con `execute` revocado de `anon`/`authenticated`). `lib/supabase/{client,server,
  middleware,admin}.ts` + `proxy.ts` protegiendo solo `/app`.
- **Auth real**: `/entrar` usa `signInWithOtp`/`verifyOtp`/`signInWithOAuth` + `/auth/callback`.
  El código de Supabase es de **8 dígitos**, no 6 (ya corregido en input/validación/copy).
  **Correo real vía Resend** (`smtp.resend.com`, remitente de prueba `onboarding@resend.dev`) —
  las plantillas de Supabase ("Confirm signup", "Reset Password") no traen `{{ .Token }}` por
  defecto, se agregó a mano en el dashboard; pendiente confirmar si "Magic Link" también lo
  necesita. El remitente de prueba cae en spam por no tener dominio propio — normal, se resuelve
  verificando un dominio real en Resend antes de lanzar. **Login real confirmado de punta a punta**
  por la usuaria misma.
- **Datos reales**: `lib/appLocal.ts` migrado de localStorage a Supabase, mismo shape/firmas de
  función — ninguna pantalla cambió su UI. `diaPrograma`/`rachaDias` se derivan por consulta.
- **Motor astrológico + carta natal real**: `lib/astro/{zonas,motor,cartaNatal,useLecturaDiaria}.ts`
  calcula el signo lunar del día Y la carta natal (Sol/Luna) de cada persona por su fecha de
  nacimiento (mediodía UTC, sin pedir hora exacta). `app/api/lectura-diaria/route.ts` cruza ambos
  en el prompt a Claude — el mensaje es POR USUARIO, no compartido (caché en `lecturas_diarias`
  por `user_id`+`fecha`, el costo de IA ya no es casi nulo, crece con usuarios activos). Carta
  visible en `/app/perfil` ("Sol en X · Luna en Y").
- **Lectura diaria en 3 partes** (2026-09-23): `mensaje` + `porque` (conecta carta natal y
  tránsito, tono SIMBÓLICO — nunca causa médica ni predicción) + `consejo` (práctico, más allá de
  la respiración). La IA responde JSON estructurado (bug corregido: a veces lo envolvía en
  ```` ```json ````, se limpia antes de parsear). Mostrado en Hoy y en el resultado del onboarding.
- **Diario con pregunta del día** (2026-09-23): `app/api/prompt-diario/route.ts` genera una
  pregunta específica (≤16 palabras) según categoría + semana del programa, cacheada en la misma
  fila de `lecturas_diarias` (columna `prompt_diario`) — `zona`/`mensaje`/`signo_luna` de esa tabla
  pasaron a nullable porque ahora dos endpoints distintos pueden crear la fila del día.
- **Verificado con datos reales en cada pieza** (Regla dura 1): sesión real, RLS bloqueando leer
  perfiles ajenos, lectura de IA citando la carta natal real de la usuaria, pregunta de diario
  coherente — todo confirmado en pantalla y en la base de datos, no mocks. tsc ✓ build ✓ en cada
  cambio.
- **Pendiente**: conectar Hotmart; endurecer `shouldCreateUser` a `false` cuando exista el webhook;
  verificar dominio propio en Resend antes de lanzar (ver `46-EMAIL-DELIVERABILITY.md`).

## Landing: video + 3 imágenes integradas (2026-09-17 / 2026-09-23)
- Video (mujer llorando de noche → cadenas en el pecho → silueta caminando a la luz, 8s, mudo) en
  la sección "¿Te suena?" (`Problema.tsx`, prop `videoSrc`).
- 3 imágenes nuevas de la usuaria en `public/images/` (una tanda anterior tenía marca de agua
  ajena — descartada): `solucion-liberacion.jpg` (mujer soltando energía del pecho) en
  `Solucion.tsx` entre los pasos y el antes/después; `agitacion-corte.jpg` (tijeras cortando un
  hilo cósmico) en `Agitacion.tsx` bajo la frase puente; `garantia-sostenida.jpg` (mujer sostenida
  por mano de estrellas) en `Garantia.tsx` como círculo de 60px reemplazando el ícono — probado
  primero como fondo del CTA Final pero esa sección usa fondo CLARO invertido a propósito y la
  foto quedaba invisible bajo la capa necesaria para el texto, se revirtió.
- Verificado visualmente a 375px, tsc ✓ build ✓. Comprimidas con `sips` (redimensionadas +
  calidad 75-80%): de 2-3MB cada una a 48-636KB (la de Garantía, mostrada a 60px, se redujo más
  agresivamente). Calidad visual confirmada sin pérdida notable.

## Decisiones técnicas y de copy acumuladas
- **Capa ornamental** (`components/landing/Ornamentos.tsx`): `EstrellasFondo`, `GlifosDivisor`,
  `CajaOrnamentada` — en landing, onboarding, app interna y mockups.
- **Copy generalizado** (sirve a ruptura, duelo Y otras causas, no solo "ex"): lenguaje neutro en
  género, sin asumir una sola causa de dolor — en todos los archivos vivos.
- Todo verificado con `tsc --noEmit` + `npm run build` limpios y capturas a 375px antes de
  mostrarse al usuario (Puppeteer cuando el panel de preview del usuario falla).

## Problemas conocidos
- `[veredicto:landing]`/`[veredicto:onboarding]`/`[veredicto:paywall]`/`[veredicto:entrar]` **NO
  LISTA** a propósito (decisión de negocio): landing 7 rondas sin cruzar umbral; onboarding 4
  rondas llegó a 33/40·18/20 (craft pasa, usabilidad no — defectos ligados al backend, ya
  conectado, retomar con revisión formal cuando se quiera). paywall/entrar nunca pasaron por el
  revisor (revisión directa desde el 2026-09-06). Pendiente en landing: ring del hero como SVG
  animado, anclas de navegación a Precios/FAQ.
- `FICHA-MERCADO.md` tiene campos "NO ENCONTRADO" (medios de pago LATAM, conversión típica,
  plazos de Hotmart) — se completan al conectar Hotmart real.
- Footer legal: `soporteEmail` y enlaces son placeholder hasta definir dominio real.
- `[hydration]` `components/landing/ui.tsx` (`useReveal`) genera un warning cosmético de
  hidratación (framer-motion/SSR) — no se parchea, es código compartido fuera de alcance.
- Ejercicio de respiración: se repite igual sin importar la zona — variantes por zona quedaron
  **definidas para más adelante** (decisión del usuario, no ahora).

## Notificaciones diarias — planeado, no construido (2026-09-20)
Plan acordado: (1) conectar el interruptor "Notificaciones" de `/app/perfil` (hoy decorativo) a un
permiso real del navegador, (2) guardar la suscripción de cada usuario en Supabase, (3) un
disparador diario que arme el micro-consejo (motor de IA + carta natal) y lo envíe. **Requisito
bloqueante**: las notificaciones push reales necesitan la app publicada en internet (Vercel) — la
usuaria decidió publicar primero, pero pidió PAUSAR antes de arrancar ese paso.

## Siguiente paso exacto
Publicar la app en internet (Vercel, decisión ya tomada, solo pausada). Después: notificaciones
diarias (plan ya acordado, ver arriba), y conectar Hotmart cuando la usuaria tenga esa cuenta.

## Auditoría cerrada (2026-09-23)
Reporte de la FASE 3 aprobado por la usuaria (4 hallazgos) y ejecutado en FASE 4:
- **Corregido** — el copy ya no dice "cifrado" en ningún lugar (landing, paywall, pantalla de
  diario): el diario es privado (protegido por RLS) pero NO estaba cifrado de verdad, y decirlo
  era un claim falso. Cambiado a lenguaje honesto ("privado, solo tú lo lees").
- **Corregido** — el paywall ya no promete un aviso de "Día 5" que no existe como función real;
  el texto ahora solo describe el paso sin prometer una notificación activa.
- **Corregido** — vacío grande en la primera pregunta del onboarding (mitad de la pantalla sin
  nada): contenido ahora empieza arriba (no centrado a mitad de pantalla) + resplandor de
  profundidad + más estrellas de fondo, mismo lenguaje visual ya aprobado (`app/onboarding/
  page.tsx`, componente `PantallaPregunta`).
- **Corregido** — las dos funciones de IA (lectura del día, pregunta de diario) ya tienen un
  límite simple de repeticiones por usuario (`lib/rateLimit.ts`, 10 llamadas/minuto) — antes
  cualquiera podía llamarlas sin freno.
Verificado: tsc ✓ · build ✓ · render 375px confirmado visualmente para el ajuste puntual (glow +
estrellas, vacío ya no se lee como pantalla rota) · paywall confirmado con el copy nuevo. Sin
revisor-visual formal en esta ronda (fue un ajuste puntual, no un rediseño). El veredicto pendiente
de onboarding NO LISTA sigue pendiente igual que antes — no cambia con este ajuste, ver
`[veredicto:onboarding]` en Problemas conocidos.
