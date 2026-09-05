# ESTADO.md — AstroSoma

## Resumen del proyecto
App: **AstroSoma** (marca posible "Beyond: AstroSoma"). Guía diaria de salud somática y astrología
médica: identifica en qué zona del cuerpo se acumula tensión física/emocional (duelo, ruptura,
estrés) según la carta natal, y da ejercicios de liberación somática de 3-5 minutos. Diferenciador:
cero notificaciones fatalistas de IA, mecanismo somático concreto, privacidad total.

Idea validada con investigación previa (prompt del curso) aportada en `ASTROSOMA.pdf` — no se
re-valida. Ver `FICHA-AVATAR.md` y `FICHA-MERCADO.md` para el detalle completo.

## Decisiones ya tomadas por el agente (con evidencia)
- **Modelo de monetización:** Freemium con suscripción $8.99/mes o $49.99/año + Pase Único de
  Temporada de Duelo $14.99. Prueba gratis 7 días. Decidido en el propio documento de validación,
  comparado contra After ($12.99/mes) como ancla. Ver `FICHA-MERCADO.md` §1.
  Si prefieres otro precio o modelo, dímelo — se puede ajustar antes de tocar el paywall real.
- **Pasarela de venta:** Hotmart (estándar del SO para LATAM).
- **Funciones núcleo v1 (del documento):** escaneo somático basado en tránsitos natales, módulo de
  Duelo/Ruptura (programa guiado 14 y 30 días), ejercicios de liberación somática de 3 min, diario
  privado cifrado. NO se construye aún: sinastría de pareja, chat de IA ilimitado, marketplace de
  astrólogos, red social interna.
- **Riesgos de producto ya identificados y su mitigación:** IA no da diagnóstico médico (prompts
  restringidos + disclaimer de autocuidado, no tratamiento); posible cancelación post-duelo
  (transición del módulo de duelo a hábito diario de salud somática); costo de IA (límite de 3
  registros/día en vez de chat abierto).
- **App modelo elegida:** Co–Star Personalized Astrology (revenue verificado por 2 señales:
  Sensor Tower ~$400K/mes + rank #33 top-grossing Lifestyle US). Se modela su mecanismo (carta
  natal + tránsito diario como gancho de retorno) y se corrige su queja #1 (tono fatalista/
  ansiógeno) con el ángulo somático de AstroSoma. Ver `FICHA-MODELO.md`.
- **Dirección de arte — CERRADA (cosa juzgada):** "Mística cálida" → Opción B "Ritual Nocturno"
  del protocolo A/B/C (`direcciones-abc.html` + tour en `vista-previa-app.html`, screenshots en
  `docs/revisiones/`). Ajustada 2 veces a pedido del usuario: fondo de negro puro a café oscuro
  (`#211609`) y acento ámbar aclarado a beige-dorado (`#C4A177`). Aprobada ("me encanta") el
  2026-09-04. `FICHA-ARTE.md` es la fuente de verdad de tokens — se vuelca a `globals.css` cuando
  arranque el código real.

## Paso actual
Paso 1 (Landing) construida y en verificación. Stack: Next.js 16 App Router + TypeScript +
Tailwind v4 + motion + lucide-react (decidido por el agente — "duda → Next.js" del 51, ya que
AstroSoma combina landing/SEO con la app). Kit canónico de `plantillas-codigo/landing/` copiado a
`components/landing/`, tematizado con `FICHA-ARTE.md`, copy en `docs/copy/landing.md` trazado a
`FICHA-AVATAR.md`. Mecanismo bautizado: **el Escaneo Somático**.

## Pantallas creadas
- `/` — Landing de ventas (10 secciones canónicas completas: Hero, Problema, Agitación, Solución,
  App por dentro, Oferta, Garantía, FAQ, CTA final, Footer legal). `app/page.tsx`.
- `/onboarding` — Flujo real de 8 pantallas (4 preguntas + 2 reconocimientos + loading + resultado).
  `app/onboarding/page.tsx`.
- Placeholders creados para que ningún link rompa (contenido real pendiente en su etapa):
  `/entrar`, `/privacidad`, `/terminos`, `/reembolsos`, `/aviso-ia`, `/paywall`.

## Protagonista de cada pantalla
- Landing (`/`): protagonista = la promesa de alivio físico en 3 minutos (Escaneo Somático);
  acción primaria = CTA "Descubrir mi zona de tensión gratis" → `/onboarding`.
- Onboarding (`/onboarding`): protagonista = el usuario auto-diagnosticándose (situación, zona de
  tensión, momento del día, meta) y viendo su resultado personalizado antes de pagar.

## Acción primaria de cada pantalla
- Landing: CTA repetido en hero/mid-page/oferta/CTA final/sticky mobile, todos al mismo destino
  `/onboarding` (Modelo 2, onboarding-first, de `02C`).
- Onboarding: una decisión por pantalla (auto-avance en preguntas de selección única); la pantalla
  final tiene un solo CTA "Ver mi plan de liberación" → `/paywall`.

## Qué NO se construyó aún
Paywall real, login, app interna, servicios externos. El placeholder de `/paywall` solo evita un
link roto — no es la construcción real de esa etapa.

## Problemas conocidos
- `FICHA-MERCADO.md` tiene varios campos "NO ENCONTRADO" (medios de pago LATAM, conversión típica
  del nicho, plazos exactos de garantía de Hotmart) — se completan al conectar Hotmart real (Paso 6).
- El VoC de la ficha de avatar tiene solo 5 frases literales con URL propia (todas en inglés, de
  Reddit sobre Co-Star/The Pattern); el resto de dolores/deseos en español son inferencias de
  avatar bien fundamentadas pero no citas textuales con fuente propia.
- Garantía: `FICHA-MERCADO §4` tiene Prueba 7 días / Garantía 15 días (decisión provisional del
  agente para cumplir la regla dura garantía>prueba) — se confirma el límite exacto de la cuenta
  real al conectar Hotmart (Paso 6). El copy de la landing (Garantía, FAQ, CTA final) usa una
  única frase unificada: "7 días de prueba + 15 días de reembolso tras el cobro".
- Footer legal: soporteEmail y enlaces son placeholder hasta definir dominio real y pasar por la
  skill `legal`.
- Visuales del Hero y del carrusel "La app por dentro": son mockups estáticos reales
  (`public/mockups/*.png`, generados del tour de dirección de arte ya aprobado por el usuario,
  con badge "Vista previa de diseño") — NO son screenshots de una app funcionando todavía; se
  reemplazan por capturas reales cuando exista la app interna con su seed de datos (regla 32).
- `[veredicto:landing]` EN CURSO — 4 rondas de revisor-visual + corrección, resumen:
  - 1ª ronda (32/40, 13/20): defecto de "texto cortado" resultó ser un bug de la herramienta de
    captura (Chrome headless sin emulación móvil daba overflow falso — confirmado
    `scrollWidth===innerWidth===375` con emulación real vía Puppeteer), no del producto. Reales y
    corregidos: presupuesto de copy de Oferta, CTA con verbo distinto entre planes, falta de demo
    de tono (se agregó `MensajeContraste.tsx`, sección "La diferencia", AÑADIDO fuera de las 10
    canónicas).
  - 2ª ronda (32/40, 14/20): "Onboarding" en inglés crudo → "Bienvenida"; identidad ownable
    ausente → grano + fase lunar agregados; 5 visuales seguían de placeholder → mockups reales
    wireados; CTA mensual desalineado → unificado; nota redundante de Oferta → eliminada.
  - 3ª ronda (34/40, 14/20): faltaba la motion signature de marca → animación `respirar` en el
    hero; el grano no se veía → BUG real (mix-blend-mode en pseudo-elemento por debajo del
    contenido, corregido a `body::after` z-index alto + opacidad 0.3 verificada visualmente);
    comentario de fase lunar corregido (firma de marca, no espejo del módulo de Duelo); agregado
    `:focus-visible` global; título de Oferta alineado al precio real mostrado.
  - 4ª ronda (30/40, 13/20 — bajó por ruido normal de evaluación independiente, confirmó que los
    fixes anteriores quedaron bien): plazos de garantía contradictorios → unificados; dos
    secciones consecutivas con el mismo fondo → borde superior agregado a `MensajeContraste`;
    4º uso de Hairline sobre el máximo de 3 recomendado por el kit → cambiado a borde simple;
    badge de trial con bajo contraste → unificado a fondo sólido.
  - 5ª ronda (29/40, 15/20 — confirmó explícitamente que los 4 fixes de la ronda anterior quedaron
    bien implementados): sticky CTA mobile sin forma de cerrarse → agregado botón "X" de
    descarte; el hero y el primer frame del carrusel repetían la misma imagen (hoy.png) → se quitó
    el frame duplicado del carrusel (ahora empieza en "Bienvenida"); la fase lunar (8 puntos de
    12px) era ilegible como tal → rehecha con `conic-gradient` (cada punto es una porción de
    círculo llena según su fase, mucho más legible, con pulso "respira" en la fase llena); faltaba
    un momento "vivo" propio y un ancla de navegación en el scroll largo → agregado botón flotante
    "volver arriba" (aparece al salir del hero).
  - 6ª ronda (32/40, 15/20, Copy 19/20 — confirmó que los 4 fixes de la ronda anterior quedaron
    bien): la fase lunar con conic-gradient se leía como gráfico de pastel/progreso, no como luna
    (cuñas angulares, no medias lunas) → rehecha con la técnica real de dos círculos superpuestos
    (un disco "sombra" desliza sobre el disco iluminado, como el terminador lunar real — ahora sí
    se ven crecientes/gibosas reconocibles); altura del botón de StickyCtaMobile (48px) no
    coincidía con el resto de los CTA (52px) → unificada; contraste fondo/superficie muy sutil en
    scroll largo → subido `--surface` de `#2E2013` a `#392616`.
  - 7ª ronda (32/40, 14/20 — confirmó que los fixes de fase lunar/altura CTA/contraste de la
    ronda anterior quedaron bien): quedan 2 hallazgos de mayor esfuerzo sin resolver (ring "72%"
    del hero como SVG animado en vez de PNG; anclas de navegación a Precios/FAQ en el header) y
    3 accionables rápidos, de los cuales se corrigieron 2 en esta pasada: claim de salud sin
    respaldo clínico ("insomnio crónico y ansiedad diaria", contradecía la propia FAQ) → reescrito
    como consecuencia conductual concreta; fase lunar con discos de 20px difícil de distinguir en
    fases intermedias → subida a 32px. El tercer accionable (usar `--surface-2` en algún bloque
    intermedio de FAQ/Garantía) queda pendiente.
  **DECISIÓN DEL USUARIO (2026-09-04): avanzar a Onboarding con el nivel actual.** Tras 7
  revisiones independientes (29-34/40 usabilidad, 13-15/20 craft, sin bajar nunca en código
  verificado pero sin cruzar el umbral ≥36/≥16 de forma consistente) se presentó el estado al
  usuario con 3 opciones — eligió aceptar el nivel actual y seguir a Onboarding, dejando la
  landing para pulir más adelante con tráfico real. `[veredicto:landing]` queda NO LISTA en
  `docs/revisiones/landing-veredicto.md` a propósito — es una decisión de negocio documentada, no
  un olvido. Pendientes de mayor esfuerzo que quedan para una vuelta futura: ring "72%" del hero
  como SVG animado (hoy PNG estático) y anclas de navegación a Precios/FAQ en el header.
- `[hydration]` `components/landing/ui.tsx` (`useReveal`, pieza del KIT del SO, no tocada por este
  proyecto) genera un warning de hidratación en consola del navegador (framer-motion/SSR, patrón
  conocido: "This won't be patched up") — cosmético, no afecta el render final ni la interacción;
  no se parchea aquí por ser código del kit compartido, fuera del alcance de este proyecto.

## Siguiente paso exacto
Recibir el veredicto del revisor visual sobre la landing, corregir lo que marque como bloqueante,
y presentar el Reporte de Puerta de la etapa Landing al usuario para su OK antes de pasar a
Onboarding (Paso 2 de la Secuencia Maestra).
