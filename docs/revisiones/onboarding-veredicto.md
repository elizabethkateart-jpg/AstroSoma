# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-04 00:00
Screenshot: docs/revisiones/onboarding-1-situacion.png (+ 7 pantallas adicionales onboarding-2..8)
Usabilidad: 30/40  (detalle: h1:3 h2:4 h3:3 h4:4 h5:2 h6:4 h7:2 h8:3 h9:2 h10:3)
Craft: 16/20  (detalle: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3)
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Pantalla "Otra cosa" en situación/meta, botón "Continuar" bajo el input] `disabled={!textoOtra.trim()}` con `disabled:opacity-50` — es exactamente el patrón "pill muerto al 50% esperando el form perfecto" que las anclas del CTA héroe vivo prohíben; el usuario que toca el botón vacío no recibe ningún feedback (evento bloqueado por `disabled`, sin hint de qué falta) → habilitar siempre el botón, validar al click y mostrar un hint inline ("Escribe algo para continuar") en vez de deshabilitarlo.
2. [Todo el flujo, campo de texto "Otra cosa"] El `<input>` no está en un `<form>` ni tiene `onKeyDown` para Enter → un usuario que escribe y presiona Enter (comportamiento esperado en cualquier input de una sola línea) no avanza, tiene que ir a tocar el botón → envolver en `<form onSubmit>` o agregar handler de Enter.
3. [Código completo, paso "loading" y cualquier llamada futura a datos reales] Cero manejo de estados de error en todo el archivo: el "loading" es un `setTimeout` fijo que siempre termina en éxito, sin rama de fallo ni mensaje de reintento → cuando se conecte a datos reales, definir un estado de error con qué pasó + qué hacer (ninguna heurística de error está implementada hoy, ni siquiera de forma simulada).
4. [Pantallas pregunta-situación, pregunta-zona, pregunta-momento, pregunta-meta, reconocimiento-1, reconocimiento-2, resultado] El bloque de contenido ahora se ancla arriba (pt-15vh/12vh) pero sigue dejando ~25-40% de la pantalla en marrón plano vacío entre el contenido y el borde inferior (o entre el cuerpo y el botón CTA en reconocimiento/resultado) — mejoró respecto al centrado total previo, pero un usuario todavía percibe la mitad inferior de la pantalla como sub-utilizada → acercar el CTA al bloque de contenido o añadir un elemento secundario (ilustración/dato) que ocupe ese tercio inferior.
5. [Pantallas reconocimiento-1 y reconocimiento-2, párrafo de cuerpo] El copy de cuerpo se extiende a 5 líneas (excede la guía de 3-4 líneas por bloque de la carga cognitiva), sumado a que no hay atajos de teclado en ningún punto del flujo (heurística 7) → recortar el copy a 3-4 líneas y agregar soporte de teclado (Enter/Tab) donde aplique.
