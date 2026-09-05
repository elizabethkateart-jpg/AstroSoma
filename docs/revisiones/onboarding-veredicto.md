# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-04 00:00
Screenshot: docs/revisiones/onboarding-1-situacion.png (+ 7 pantallas adicionales onboarding-2..8)
Usabilidad: 30/40  (detalle: h1:3 h2:3 h3:2 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:3)
Craft: 15/20  (detalle: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3)
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Header, botón X "Salir del escaneo", todas las pantallas de pregunta/reconocimiento] `onClick` usa `window.confirm('¿Salir ahora?...')` — un diálogo nativo del navegador con su propia tipografía/chrome del sistema, rompe por completo la inmersión de marca justo en el momento de mayor fricción emocional (salir a mitad del duelo/ansiedad) → reemplazar por un modal propio animado (mismo radio 20px, acento, tipografía display/body) con botones "Seguir aquí" / "Salir sin guardar".
2. [Pantallas 1, 2, 3, 5 — situación/zona/momento/meta, franja inferior] El bloque pregunta+opciones queda centrado simétricamente pero ocupa solo ~40% del alto, dejando ~55-60% de la pantalla en negro plano arriba y abajo sin ningún elemento (ni ilustración, ni texto residual) — un usuario percibe la pantalla como "vacía/a medio cargar" sin necesidad de buscarlo → anclar el bloque más arriba (justify-start + padding-top fijo ~15-20% viewport) en vez de centrarlo en toda la altura disponible entre header y borde inferior.
3. [PantallaResultado, número "72%" dentro del anillo] El anillo SVG se dibuja con animación pero el texto "72%" aparece estático desde el frame 0, sin contar hacia arriba — rompe uno de los 7 baseline de movimiento (conteo de números héroe) que el resto del proyecto sí cumple en otras pantallas → animar el número con un motion value sincronizado a la duración del trazo del anillo (0 a 72 en 1.1s).
4. [Todas las cards de opción y la card de meta en resultado] La textura de papel/grano descrita como dispositivo ownable en FICHA-ARTE.md (línea 26, "textura de papel/grano muy sutil en cards de diario") sigue sin percibirse en el screenshot — las cards se ven como fills planos de `--surface` sin grano visible, dejando la fase lunar como único dispositivo ownable real → subir la opacidad del grano hasta que sea perceptible en captura estándar, o retirar la promesa de la ficha si se decide no implementarlo.
5. [Header, indicador luna, pantalla 1 "situación", paso=0] Con `frac=0` la luna de progreso se renderiza como un anillo hueco sin relleno visible junto al botón X — a primera vista puede leerse como un ícono roto o un placeholder vacío en vez de "0% completado" → dar al estado inicial un mínimo de relleno/borde perceptible que comunique que es un indicador funcionando, no un elemento sin cargar.
