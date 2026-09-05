# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-05 00:00
Screenshot: docs/revisiones/onboarding-1-situacion.png (+ 7 pantallas del flujo)
Usabilidad: 30/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [app/onboarding/page.tsx, PantallaLoading L320-360] `setError(true)` no se llama en ningún punto del código (grep confirma que la única invocación es `setError(false)` en el reintento) → la UI de error es código muerto: en producción el loading SIEMPRE termina en éxito, exactamente el problema que se dijo resuelto. Fix: disparar `setError(true)` desde el fallo real de la llamada que arma el escaneo (catch de la petición), no dejarlo sin gatillo.
2. [Reconocimiento 1 y 2, screenshots 4 y 6] El cuerpo de texto sigue en 4 líneas en ambas pantallas ("No es falta de voluntad..." y "Nombrar dónde te duele..."), no en 2 como se reporta arreglado → recortar el copy real a 2 líneas o subir el tamaño de fuente/ancho para que quepa, y verificar la variante `situacion?.includes('ruptura')` que es la más larga.
3. [Reconocimiento 1/2 y Resultado, screenshots 4, 6, 8] Queda ~45-50% de viewport vacío debajo del CTA (contenido pineado arriba, nada ancla la mitad inferior) → se movió el hueco de "antes" a "después" del botón pero el vacío visual persiste igual de grande y un usuario lo nota de inmediato; centrar verticalmente el bloque contenido+CTA o rellenar con elemento ownable (textura/ilustración) en vez de dejar espacio muerto.
4. [Resultado, screenshot 8] No hay forma de editar una respuesta previa desde el resultado (ni enlace "cambiar mi zona/meta") y las únicas alternativas al flujo lineal son el botón atrás por pantalla → h3 control y h7 flexibilidad se quedan en lo mínimo; agregar un "editar" accesible desde el resultado antes de ir a paywall.
5. [PantallaPregunta, input "Otra cosa" — no visible en capturas] El hint de validación ("Escribe algo para continuar") no lleva foco/aria-live al input tras el submit vacío, según el código no hay `aria-describedby` ni foco explícito → un usuario de lector de pantalla no se entera del error; conectar el hint al input con `aria-describedby` y devolver foco.
