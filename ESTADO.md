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
- **Dirección de arte:** el usuario eligió "Mística cálida". Se armó `FICHA-ARTE.md` por fusión de
  líderes (CHANI, Calm, Stoic, Clue) — modo oscuro nocturno, base ámbar/terracota (`#C8853D`) con
  acento burdeos (`#8C4A3C`) solo en el módulo de Duelo, tipografía serif humanista + sans
  humanista, radio 20px, motion lento tipo "respiración". Pendiente mostrar el resumen y obtener
  el OK explícito del usuario antes de volcarlo a código.

## Paso actual
Paso 0-1 completos: Sistema Operativo instalado, git activado, idea validada y cargada,
`FICHA-AVATAR.md` y `FICHA-MERCADO.md` completas (Sesión 1).

## Pantallas creadas
Ninguna todavía.

## Protagonista de cada pantalla
N/A — no se ha llegado a diseño de pantallas.

## Acción primaria de cada pantalla
N/A

## Qué NO se construyó aún
Landing, onboarding, paywall, login, app interna, servicios externos. Todo pendiente, en ese orden
(regla de la Secuencia Maestra — no se salta al dashboard).

## Riesgos/pendientes
- `FICHA-MERCADO.md` tiene varios campos "NO ENCONTRADO" (medios de pago LATAM, conversión típica
  del nicho, plazos exactos de garantía de Hotmart) — se completan al conectar Hotmart real (Paso 6).
- Falta decidir dirección de arte / referencia visual (pregunta pendiente al usuario).
- Falta decidir framework técnico (Vite vs Next) — se decide antes de crear la landing.
- El VoC de la ficha de avatar tiene solo 5 frases literales con URL propia (todas en inglés, de
  Reddit sobre Co-Star/The Pattern); el resto de dolores/deseos en español son inferencias de
  avatar bien fundamentadas pero no citas textuales con fuente propia. Válido para avanzar por
  decisión explícita de aceptar la idea ya validada, pero conviene reforzar con VoC en español de
  los primeros usuarios reales cuando existan.

## Siguiente paso exacto
Preguntar al usuario su preferencia de dirección visual (única decisión que requiere su gusto) y
luego construir la página de ventas (Paso 1 de la Secuencia Maestra), siguiendo la estructura
canónica de `19-PAGINA-DE-VENTAS.md` con el copy derivado de `FICHA-AVATAR.md`.
