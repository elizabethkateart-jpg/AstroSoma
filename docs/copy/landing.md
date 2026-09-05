# Copy marcado — Landing AstroSoma

> Fuente: `FICHA-AVATAR.md` (avatar Camila) + `FICHA-MODELO.md` (mecanismo derivado de Co-Star).
> Mecanismo bautizado: **el Escaneo Somático** (ya usado como nombre de feature en la
> investigación de idea original — no se inventa aquí, se hereda).
> Modelo de monetización: onboarding-first (Modelo 2 de `02C`) — el CTA lleva a `/onboarding`,
> nunca directo a checkout. Trial 7 días, plan anual $49.99 primero, mensual $8.99.

## 1. HERO
- h1Marked: `Ese nudo en tu pecho [acento]no es casualidad[/acento]` (8 palabras)
  — traza a: Dolor #1 de FICHA-AVATAR ("presión en el pecho y un nudo en la garganta")
- subtitleMarked: `El Escaneo Somático te muestra dónde acumulas el dolor y cómo soltarlo en minutos` (14 palabras)
  — traza a: Deseo #1 ("alivio físico real en menos de 5 minutos")
- ctaLabel: `Descubrir mi zona de tensión gratis`
- ctaHref: `/onboarding`
- socialProof: `Prueba gratis 7 días · cancela cuando quieras`
- visualPlaceholderSugerencia: captura del escaneo mostrando "Pecho" como zona de tensión de hoy

## 2. PROBLEMA — "¿Te suena?"
1. (HeartCrack) `¿Sientes un nudo en el pecho o la garganta que no baja?` — Dolor #1
2. (BellOff) `¿Las apps de astrología te llenan de ansiedad en vez de calma?` — Dolor #2 / objeción #1
3. (Moon) `¿Te despiertas de madrugada con ganas de escribirle a tu ex?` — Dolor #2 (pánico nocturno)
4. (Anchor) `¿Sientes miedo de quedarte estancada en este dolor para siempre?` — Dolor #5 (identidad)

## 3. AGITACIÓN
- `Cada noche que pasa sin liberar esa tensión, [b]se acumula más estrés en tu cuerpo[/b].`
- `En un año, ese nudo sin resolver son [acento]365 noches más dándole vueltas y mensajes que no quisiste mandar[/acento].` (corregido tras hallazgo del revisor: la versión anterior era un claim de salud sin respaldo clínico que contradecía la propia FAQ "no es tratamiento médico")
- `Otra app de horóscopos no lo arregla: [b]más miedo no es alivio[/b].`
- Contraste: Hoy → "Opresión en el pecho y ganas de revisar sus redes a las 3 AM."
  En 6 meses si nada cambia → "El mismo nudo — solo que ahora ya perdiste 6 meses de paz."

## 4. SOLUCIÓN
- tituloMarked: `Tu alivio en 3 minutos, [acento]cada noche[/acento]`
- mecanismo: `el Escaneo Somático`
- bigIdeaMarked: `No te falta fuerza de voluntad: te falta saber dónde vive el dolor. [b]El Escaneo Somático te lo muestra en tu cuerpo[/b].`
  — traza a FICHA-MODELO §7 (mecanismo derivado de Co-Star + queja #1 corregida)
- Pasos: 1) Escaneas — "Un tránsito de tu carta natal revela tu zona de tensión de hoy."
  2) Liberas — "Sigues un ejercicio guiado de respiración de exactamente 3 minutos."
  3) Avanzas — "Ves tu progreso día a día en tu Programa de Ruptura."
- Antes/Después: Antes "Un nudo en el pecho y una notificación que te asusta más."
  Después "Sabes exactamente dónde soltarlo y ya lo hiciste en 3 minutos."

## 5. LA APP POR DENTRO
- tituloMarked: `Tu ritual de cada noche, [acento]ya decidido[/acento]`
- Frames: Hoy (tu escaneo de hoy) · Bienvenida (cómo te pregunta al empezar) ·
  Mecanismo (tu ejercicio de 3 minutos) · Duelo (tu Programa de Ruptura día a día) ·
  Plan (así eliges tu plan)
- Visuales: mockups estáticos reales en `public/mockups/*.png` (generados desde el tour de
  dirección de arte ya aprobado, `vista-previa-app.html`), con badge "Vista previa de diseño" en
  el hero — no son screenshots de la app funcionando, son el mismo diseño ya aprobado por el
  usuario en la Sesión de identidad visual. Se reemplazan por screenshots reales de la app cuando
  exista (regla 32).

## 6. OFERTA
- tituloMarked: `Empieza gratis. Sigue por [acento]$0.30 al día[/acento]` (7 palabras, presupuesto 8)
- trialDias: 7 — traza a FICHA-MERCADO §4
- Anual $49.99/año ($4.17/mes) — MÁS POPULAR · Mensual $8.99/mes — traza a FICHA-MERCADO §1
- ctaLabel idéntico a CTA_LABEL en ambos planes (anual y mensual) — la diferenciación es solo
  visual (badge "MÁS POPULAR"), nunca de texto — evita diluir la única acción primaria
- Nota redundante del stack ("Hoy: $4.17/mes...") eliminada — ese dato ya lo muestra la card Anual
  inmediatamente debajo (hallazgo del revisor, 2ª ronda)

## 6bis. LA DIFERENCIA (añadido del proyecto, no es una de las 10 secciones canónicas)
- Componente `MensajeContraste.tsx`, entre "La app por dentro" y "Oferta"
- Contrasta el tono típico de la competencia ("Mercurio retrógrado... cuidado hoy") con el tono
  de AstroSoma ("tu tránsito acumula tensión en el pecho... 3 minutos para soltarla")
  — traza a: objeción #1 de FICHA-AVATAR ("las apps de astrología solo me asustan") + pedido
  explícito de la ficha de mostrar una demo de mensaje real como diferenciador

## 7. GARANTÍA
- nombre: `la Garantía del Primer Alivio`
- condicionMarked: `7 días de prueba gratis y, si tras tu cobro el Escaneo Somático no te da [b]alivio real[/b], 15 días para tu reembolso. Sin preguntas.` (recortado a 25 palabras, presupuesto 30)
  — Prueba 7 días / Garantía 15 días (FICHA-MERCADO §4, regla dura garantía > prueba). Frase
  unificada en Garantía, FAQ ítem 5 y el recap del CTA final tras hallazgo del revisor (3 números
  sueltos sin relación explicada = confusión en el momento de mayor fricción de compra). El plazo
  de 15 días es una decisión provisional del agente dentro del rango típico de Hotmart (7-30
  días); se confirma el límite exacto de la cuenta real al conectar Hotmart en el Paso 6.

## 8. FAQ — objeciones de FICHA-AVATAR en orden de fuerza
1. `¿Esto reemplaza terapia o tratamiento médico?` — objeción de seguridad/riesgo #1 de producto
2. `¿Las notificaciones me van a asustar como otras apps?` — objeción #1 avatar
3. `¿Mis diarios y pensamientos quedan guardados en algún lado?` — objeción #4 avatar (nicho)
4. `¿Cuánto tardo en ver resultados?` — deseo de rapidez
5. `¿Qué pasa si no me sirve?` — objeción #3 avatar (cobros/cancelación)

## 9. CTA FINAL
- h2Marked: `Tu alivio te espera [acento]esta noche[/acento]`
- futurePacingMarked: `Esta noche haces tu primer escaneo, sientes dónde vive el dolor, y en 3 minutos empiezas a soltarlo.`
- psMarked: `PS: AstroSoma traduce tu carta natal en el Escaneo Somático — 3 minutos que te muestran dónde vive tu dolor y cómo soltarlo. Hoy entras con 7 días gratis.`

## 10. FOOTER LEGAL
- appName: AstroSoma · soporteEmail: soporte@astrosoma.app (placeholder — se define dominio real en Paso 6)
- Enlaces: Privacidad, Términos y Condiciones, Reembolsos, Aviso de IA — páginas placeholder
  creadas para que el link no rompa; contenido real pendiente (skill `legal`, no bloquea esta etapa).
