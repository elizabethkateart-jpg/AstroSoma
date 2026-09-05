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
- Garantía: la condición dice "7 días" pero `FICHA-MERCADO §4` todavía no tiene el plazo de
  garantía real verificado en Hotmart (debe ser MAYOR a los 7 días de prueba) — pendiente de
  confirmar al conectar Hotmart (Paso 6), anotado también en `docs/copy/landing.md`.
- Footer legal: soporteEmail y enlaces son placeholder hasta definir dominio real y pasar por la
  skill `legal`.
- Revisor visual independiente lanzado (rúbricas /40 usabilidad, /20 craft, /20 copy) — resultado
  pendiente de esta sesión.

## Siguiente paso exacto
Recibir el veredicto del revisor visual sobre la landing, corregir lo que marque como bloqueante,
y presentar el Reporte de Puerta de la etapa Landing al usuario para su OK antes de pasar a
Onboarding (Paso 2 de la Secuencia Maestra).
