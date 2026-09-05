# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-04 00:00
Screenshot: docs/revisiones/onboarding-1-situacion.png (+ 7 pantallas adicionales onboarding-2..8)
Usabilidad: 29/40
Craft: 11/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Pantallas de pregunta 1, 2, 3 y 5 — mitad inferior de la pantalla] Tras las opciones queda un bloque de vacío negro de ~500-600px (casi la mitad del viewport) sin ningún elemento hasta el badge de dev fijo abajo; rompe el encaje óptico y da sensación de pantalla incompleta/rota → centrar verticalmente el bloque pregunta+opciones en el viewport, o rellenar el espacio con un elemento visual de marca (textura de papel, ilustración de fase lunar) en vez de dejarlo negro.
2. [app/onboarding/page.tsx, componente PantallaLoading, línea 239] Usa `useState(() => {...})` para programar los 3 `setTimeout` en vez de `useEffect`; el inicializador de useState no limpia correctamente al desmontar y puede disparar actualizaciones de estado en componente desmontado — coincide con el overlay rojo "1 Issue" visible en las 8 capturas → reemplazar por `useEffect(() => {...}, [])` con el mismo cleanup.
3. [Todas las pantallas, superficies/cards] FICHA-ARTE.md promete un "dispositivo ownable" (textura de papel/grano sutil en cards + micro-fase lunar como indicador de progreso) que no aparece en ningún screenshot: superficies planas sin grano, barra de progreso es una simple línea sin fase lunar → aplicar el grano de papel al `--surface` y sustituir/acompañar la barra de progreso con el indicador lunar descrito en la ficha.
4. [Pantalla 8 resultado, anillo del 72%] El SVG tiene `strokeDasharray`/`strokeDashoffset` correctos pero se renderiza ya completo desde el primer frame (sin animación de dibujo) pese a que la ficha define una "firma de movimiento" de respiración/dibujo progresivo, y contrasta con la barra de progreso del header que sí anima su ancho → animar el `strokeDashoffset` de 0 (círculo vacío) al valor final al montar la pantalla, gateado por `useReducedMotion`.
5. [Header, botón "X" de salida — todas las pantallas] Sale directo a "/" sin confirmación ni aviso de que las respuestas no se guardan, aun con progreso ya avanzado (paso 3-4 de 4) → agregar confirmación breve ("¿Salir ahora? tus respuestas no se guardan") antes de navegar fuera del flujo.
