# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-14 00:00
Screenshot: docs/revisiones/onboarding-01-frecuencia.png (+ 9 pantallas del flujo, 02 a 10)
Usabilidad: 33/40  (detalle: h1:3 h2:4 h3:3 h4:4 h5:3 h6:4 h7:2 h8:4 h9:3 h10:3)
Craft:      18/20  (detalle: jerarquía:4 profundidad:4 identidad:3 movimiento:4 encaje:3)
Copy (si vende): N-A (esta pantalla no vende directamente; conduce al paywall pero no aplica RÚBRICA 4)
Fidelidad (si hubo referencia): N-A (sin referencia de usuario — dirección por fusión de líderes)
Veredicto: NO LISTA

Ronda de re-evaluación — cambio verificado (EstrellasFondo en PantallaPregunta):
- Confirmado en código (`app/onboarding/page.tsx` L175: `<EstrellasFondo cantidad={14}
  opacidad={0.25} />` dentro de `PantallaPregunta`, que compone los pasos 01, 02, 03, 04, 05 y 07)
  y en las 10 capturas: el componente es el mismo `EstrellasFondo` de `components/landing/
  Ornamentos.tsx` ya usado en Hero.tsx/CtaFinal.tsx — mismos tokens (`--accent` para el color de
  la estrella, sin glow, sin brillo regado), consistente con la restricción cromática de
  FICHA-ARTE.md (nada nuevo, nada de neón).
- Efecto visual verificado en 01-frecuencia, 03-zona y 05-experiencia (las más cortas, ≤3
  opciones): puntos dorados de 4 picos dispersos en el vacío superior e inferior, opacidad 0.25,
  con leve animación de respiración. No se ve ruidoso ni contradice la dirección "mística cálida
  contenida" — al contrario, refuerza la identidad de la Opción B elegida ("Ritual Nocturno",
  cielo nocturno) mejor que un glifo aislado hubiera hecho. Sube EJE 2 (profundidad) de 3 a 4: el
  fondo deja de ser un fill plano y gana una capa sutil de textura consistente en las 6 pantallas
  de pregunta.
- PERO el defecto de fondo NO queda resuelto, solo mitigado: en 03-zona.png y 05-experiencia.png
  el bloque de opciones sigue ocupando ~40% del alto y el resto (arriba del título + debajo de la
  última opción) sigue siendo >55% de la pantalla con solo 6-8 puntos de 2-5px de tamaño — muy
  poco peso visual para el espacio que cubren. Un ojo entrenado (craft) todavía nota el vacío
  desbalanceado; un usuario promedio ya no lo lee como "pantalla sin terminar" (el cielo estrellado
  se lee como intencional), así que el criterio pasa de defecto TOP a nota menor. EJE 5 (encaje
  óptico) se mantiene en 3: el problema de fondo — mucho espacio muerto vertical sin anclar el
  bloque de contenido — sigue ahí, las estrellas lo disimulan pero no lo corrigen estructuralmente
  (ej. centrar verticalmente el bloque completo o reducir el padding superior fijo lo resolvería
  de raíz).
- Sin regresiones en el resto del flujo (04, 06, 08, 09, 10): jerarquía, íconos, hairlines
  degradé con glifos de zodiaco, checkmarks custom y CTA dorado se mantienen idénticos a la ronda
  anterior. `06-reconocimiento1` y `08-reconocimiento2` (pantallas de una sola frase + CTA, no
  `PantallaPregunta`) NO llevan `EstrellasFondo` — no estaban en el alcance del fix reportado y no
  se tocaron; quedan con el mismo vacío que antes pero no fueron el foco del defecto original
  (tenían chip-ícono + glifos + CTA como anclas, no calificaban como "sin apoyo visual").

Craft total sube de 17/20 a 18/20 (solo profundidad +1). Usabilidad se mantiene en 33/40: el fix
era puramente de craft/estético, no toca ninguno de los 3 defectos de fondo (loading sin error
real, onEditar reinicia todo, sin atajo para recurrente) que siguen bloqueando h1/h3/h7/h9 — todos
documentados como pendientes del Paso 6 (backend) en ESTADO.md, sin tocar en esta ronda.

GATE DOBLE: requiere ≥36/40 usabilidad Y ≥16/20 craft. Craft (18/20) YA PASA el umbral. Usabilidad
(33/40) SIGUE POR DEBAJO de 36 — el gate es un AND, no un promedio: la pantalla no puede declararse
lista mientras h1/h3/h7/h9 dependan de un backend que no existe. Esto es correcto y esperado: la
pantalla NO se “fuerza” a pasar tocando solo craft cuando la usabilidad depende de una capa que
todavía no se construye (Paso 6). El veredicto se mantiene NO LISTA hasta que exista esa capa.

Defectos anteriores que siguen abiertos (sin tocar en esta ronda, dependen del Paso 6):
1. [PantallaLoading, `app/onboarding/page.tsx`] `setError(true)` solo se dispara con el flag de
   debug `?simular_error=1`; sin backend real conectado, el loading SIEMPRE termina en éxito →
   conectar `setError(true)` al catch de la petición real en cuanto exista el Paso 6.
2. [Resultado → onEditar] Reinicia el flujo completo en vez de editar una respuesta puntual →
   vista resumen editable por pregunta cuando exista persistencia de respuestas.
3. [Todo el flujo, código] Sin atajos/defaults para usuario recurrente (sin "sigue igual") →
   prellenar con la última respuesta cuando exista historial real.

TOP DEFECTOS (máx 5, ordenados por impacto):
1. [PantallaLoading, `app/onboarding/page.tsx`] Error solo simulable con flag de debug, sin
   gatillo real conectado a ninguna petición → conectar `setError(true)` al catch real cuando se
   construya el backend de Paso 6.
2. [Resultado → onEditar] Reinicia el flujo completo en vez de editar una respuesta puntual →
   vista resumen editable por pregunta cuando exista persistencia de respuestas.
3. [Todo el flujo, código] Sin atajos/defaults para usuario recurrente → prellenar con la última
   respuesta cuando exista historial real.
4. [Preguntas cortas, 03-zona.png / 05-experiencia.png] El vacío estructural (>55% del alto sin
   contenido) sigue ahí; EstrellasFondo lo disimula pero no lo corrige de raíz → considerar
   centrar verticalmente el bloque pregunta+opciones en vez de anclarlo arriba con padding fijo.
5. [06-reconocimiento1.png / 08-reconocimiento2.png] Mismo patrón de vacío superior/inferior que
   las preguntas cortas, pero sin el fix de EstrellasFondo (no son `PantallaPregunta`) → si se
   decide extender el fix, aplicarlo también aquí para consistencia entre pantallas del mismo tipo.
