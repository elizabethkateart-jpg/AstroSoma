# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-04 00:00
Screenshot: docs/revisiones/onboarding-1-situacion.png (+ 7 pantallas adicionales onboarding-2..8)
Usabilidad: 25/40
Craft: 12/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Todas las pantallas — badge "1 Issue" rojo abajo-izquierda, visible en las 8 capturas] Sigue apareciendo el overlay de error de Next.js dev en TODAS las pantallas nuevas (el mismo síntoma que motivó el defecto #2 de la revisión anterior); en resultado (pantalla 8) y en ambos reconocimientos tapa parcialmente el texto del CTA ("Ver mi plan de liberación" se lee cortado como "...i plan de liberación") → el cambio de `useState` a `useEffect` en `PantallaLoading` no eliminó la causa raíz; revisar consola/errores del build más allá de ese timer y confirmar en un build de producción real (sin overlay de dev) que no hay warnings/errors pendientes.
2. [Pantallas de pregunta 1 (situación), 2 (zona), 3 (momento), 5 (meta) — mitad inferior] El vacío negro tras las opciones sigue presente y queda asimétrico: el bloque pregunta+opciones se ve muy por encima del centro real del viewport (gap superior visiblemente menor que el inferior), pese al `justify-center` agregado en `PantallaPregunta` → el `pb-20` fijo descentra el contenido hacia arriba; quitarlo y centrar con `justify-center` puro, o verificar que `min-h-dvh` resuelva la altura real del viewport en el entorno donde se capturó.
3. [Pantallas de reconocimiento 4 y 6 — sin tocar] `PantallaReconocimiento` sigue usando `mt-16` fijo + contenido top-alineado con el botón "Continuar" pinneado abajo, dejando el mismo vacío enorme sin resolver; el fix de centrado documentado solo se aplicó a `PantallaPregunta`, no a este componente hermano → aplicar la misma estrategia de centrado vertical a ambos, no solo a uno.
4. [Header, barra de progreso + luna — pantalla 5 "meta"] La barra llega a 100% y la luna se ve llena ANTES de que el usuario responda la última pregunta (`frac = paso/TOTAL_PREGUNTAS` = 4/4 ya en la pantalla de la pregunta 4, no al completarla) → declarar "completo" antes de tiempo es un estado de sistema falso; calcular con `(paso-1)/TOTAL_PREGUNTAS` o avanzar el contador solo tras responder.
5. [Cards y superficies — todas las pantallas] La textura de papel/grano que promete FICHA-ARTE.md como dispositivo ownable (línea 26) sigue sin ser perceptible: las cards de opción y la card de resultado se ven como fills planos de color sin grano visible → si está implementado, subir su opacidad hasta que se perciba en captura; si no, añadirlo (ej. overlay SVG de ruido de baja opacidad sobre `--surface`).
