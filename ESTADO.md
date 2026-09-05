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
- Placeholders creados para que ningún link rompa (contenido real pendiente en su etapa):
  `/onboarding`, `/entrar`, `/privacidad`, `/terminos`, `/reembolsos`, `/aviso-ia`.

## Protagonista de cada pantalla
- Landing (`/`): protagonista = la promesa de alivio físico en 3 minutos (Escaneo Somático);
  acción primaria = CTA "Descubrir mi zona de tensión gratis" → `/onboarding`.

## Acción primaria de cada pantalla
- Landing: CTA repetido en hero/mid-page/oferta/CTA final/sticky mobile, todos al mismo destino
  `/onboarding` (Modelo 2, onboarding-first, de `02C`).

## Qué NO se construyó aún
Onboarding real, paywall, login, app interna, servicios externos. Los placeholders de esas rutas
solo evitan links rotos — no son la construcción real de esas etapas.

## Riesgos/pendientes
- `FICHA-MERCADO.md` tiene varios campos "NO ENCONTRADO" (medios de pago LATAM, conversión típica
  del nicho, plazos exactos de garantía de Hotmart) — se completan al conectar Hotmart real (Paso 6).
- El VoC de la ficha de avatar tiene solo 5 frases literales con URL propia (todas en inglés, de
  Reddit sobre Co-Star/The Pattern); el resto de dolores/deseos en español son inferencias de
  avatar bien fundamentadas pero no citas textuales con fuente propia.
- Visuales del Hero y de "La app por dentro" son placeholders honestos (cámara + sugerencia de
  captura) — se reemplazan por screenshots reales cuando exista la app interna con seed de datos
  (regla 32, "la app nunca se enseña vacía").
- Garantía: `FICHA-MERCADO §4` ya tiene Prueba 7 días / Garantía 15 días (decisión provisional del
  agente para cumplir la regla dura garantía>prueba) — se confirma el límite exacto de la cuenta
  real al conectar Hotmart (Paso 6); el copy de la landing ya usa 15 días.
- Footer legal: soporteEmail y enlaces son placeholder hasta definir dominio real y pasar por la
  skill `legal`.
- `[veredicto:landing]` EN CURSO — 2ª revisión dio NO LISTA otra vez (Usabilidad 32/40, Craft
  14/20, Copy 18/20) por 5 hallazgos, todos corregidos en esta 3ª ronda:
  1. "Onboarding" en inglés crudo en el placeholder → ahora dice "Bienvenida".
  2. Identidad ownable (grano de papel, fase lunar) ausente → agregado grano sutil global
     (`app/globals.css`, filtro SVG de ruido, opacidad 0.05) + motivo de fase lunar de 8 círculos
     en `MensajeContraste.tsx`.
  3. Los 5 visuales seguían siendo placeholders grises → se generaron mockups estáticos reales
     (`public/mockups/*.png`, `scripts/dev-tools/generar-mockups-tour.mjs`) a partir del tour de
     dirección de arte YA APROBADO (`vista-previa-app.html`), con badge "Vista previa de diseño"
     — no pretenden ser screenshots de una app funcionando, son el mismo diseño ya validado.
  4. CTA del plan Mensual seguía con texto distinto → ahora usa el mismo `CTA_LABEL` exacto que
     el resto de la página.
  5. Nota redundante bajo el stack de Oferta → eliminada.
  Relanzada una 3ª revisión con el screenshot corregido (incluye fix de un bug de captura:
  las imágenes del carrusel usan `loading="lazy"` y no cargaban en un screenshot de página
  completa sin forzar su carga primero — ver `scripts/dev-tools/capturar-landing-375.mjs`).
  3ª revisión: NO LISTA otra vez pero subiendo (Usabilidad 34/40, Craft 14/20) — confirmó los 5
  fixes anteriores y encontró 5 nuevos, todos corregidos en esta 4ª ronda:
  1. Motion signature de marca ("el Escaneo Somático respira") no existía en ningún componente →
     agregada animación `respirar` (opacity+scale, 4s, ease-in-out, respeta reduced-motion) en
     `app/globals.css`, aplicada al marco del hero.
  2. Grano de papel imperceptible → BUG real encontrado al depurar: el `mix-blend-mode` estaba en
     un pseudo-elemento DEBAJO del contenido en el z-index (no arriba), así que no se mezclaba con
     nada visible — se movió a `body::after` con z-index alto (999) para que blend sí incluya el
     contenido, y se subió opacidad a 0.3 tras verificar visualmente con capturas de depuración
     (0.05-0.18 no se percibían ni siquiera renderizando correctamente).
  3. El motivo de fase lunar se presentaba en el código como reflejo del indicador del módulo de
     Duelo, pero ese mockup usa una barra lineal → se corrigió el comentario: la fase lunar es una
     firma de marca propia, independiente del indicador interno.
  4. Sin `:focus-visible` en toda la landing → agregado global (outline 2px acento).
  5. Título de Oferta ("$0.30 al día") no coincidía con ninguna card visible → alineado a "$0.14
     al día" (el dato real del plan Anual recomendado).
  Relanzada una 4ª revisión. `ESTADO.md` NO declara la landing como "lista" hasta que
  `docs/revisiones/landing-veredicto.md` diga "Veredicto: LISTA" con Usabilidad ≥36/40 y
  Craft ≥16/20. De los 5
  defectos: el "texto cortado en el borde" resultó ser un bug de la herramienta de captura (Chrome
  headless sin emulación móvil renderizaba con overflow falso — confirmado con
  `scrollWidth === innerWidth === 375` en emulación móvil real vía Puppeteer); se corrigió el
  método de captura, no el producto. Sí eran reales y se corrigieron: título de Oferta excedía el
  presupuesto de copy (9→7 palabras), CTA con verbo distinto entre planes (unificado), y falta de
  demo de tono/mensaje (se agregó `MensajeContraste.tsx` — sección "La diferencia", AÑADIDO del
  proyecto fuera de las 10 canónicas, documentado aquí). Pendiente de 2ª revisión con el screenshot
  correcto.
- Pendiente NO resuelto (limitación real de la etapa, no un defecto a corregir ahora): los 5
  visuales de producto (hero + 4 frames del carrusel) siguen siendo placeholders honestos — se
  reemplazan por screenshots reales cuando exista la app interna (regla 32: no se fabrican
  capturas falsas de una app que aún no existe). El "dispositivo ownable" (grano de papel/fase
  lunar) tampoco se insertó — no hay dónde montarlo sin tocar componentes fijos del kit; se evalúa
  al construir la app interna real.
- `[hydration]` `components/landing/ui.tsx` (`useReveal`, pieza del KIT del SO, no tocada por este
  proyecto) genera un warning de hidratación en consola del navegador (framer-motion/SSR, patrón
  conocido: "This won't be patched up") — cosmético, no afecta el render final ni la interacción;
  no se parchea aquí por ser código del kit compartido, fuera del alcance de este proyecto.

## Siguiente paso exacto
Recibir el veredicto del revisor visual sobre la landing, corregir lo que marque como bloqueante,
y presentar el Reporte de Puerta de la etapa Landing al usuario para su OK antes de pasar a
Onboarding (Paso 2 de la Secuencia Maestra).
