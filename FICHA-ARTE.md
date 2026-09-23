# FICHA DE DIRECCIÓN DE ARTE — AstroSoma

## Referencia del usuario
- ¿Hay imagen(es) de referencia del usuario?: NO → el usuario eligió entre 3 direcciones propuestas ("Mística cálida") en vez de traer una imagen propia

## Identidad derivada (FUSIÓN de líderes — sin referencia propia)
- TABLA DE LÍDERES:
  - CHANI (app de astrología #1 en revenue US) → paleta espiritual cálida sobre base clara/off-white, identidad tipo collage hecha a mano, sensación "segura y humana" en vez de mística fría
  - Calm → modo oscuro nocturno con gradientes cálidos tipo atardecer para rituales antes de dormir; framing de "sesión" corta y guiada
  - Stoic (journaling) → tipografía editorial minimalista, tono de cuaderno personal, cero decoración de sobra
  - Clue → cards redondeadas suaves, un solo acento de color haciendo todo el trabajo emocional
- Combinación tipográfica probada usada: fila "Femenina, adulta, busca calma" (`29`): acento durazno/terracota sobre fondo oscuro, clase serif display o humanista + fila "Journaling/diario" del banco `54` para el dispositivo (paleta ámbar-papel) — validada contra líderes: SÍ (CHANI + Stoic confirman calidez editorial, no neón místico)
- Arquetipo: la Sabia (Sage) + la Cuidadora (Caregiver) — guía cálida que acompaña, no que predice el futuro con miedo
- Mundo del sujeto (0.45): ritual de vela/incienso antes de dormir, papel de cuaderno envejecido, fases de la luna, tinta terracota escrita a mano — NO cristales genéricos ni glow neón "esotérico de stock"

## Personalidad compilada
- 3 adjetivos de personalidad: cálida, contenida, acompañante (nunca "mágica-espectacular" ni "clínica-fría")
- Compilación: spring bounce 0.15 (suave, sin rebote juguetón) · duración base 320ms (ritmo de respiración, más lento que un app de productividad) · exclamaciones máx 1/pantalla · celebración nivel N1 (sutil — un fade cálido, no confetti) · radio tendencial 20px (suave, orgánico)

## Brand kit final
- **Repaletizado a azul marino (2026-09-09, adenda aprobada por el usuario):** Fondo: `#0F2436`
  (azul marino oscuro — antes café `#211609`; el usuario probó una referencia de app de carta
  natal, comparó lado a lado en `docs/revisiones/prueba-color-azul.png`, primero lo aplicó solo a
  la app interna y después de confirmarlo pidió llevarlo a todo el sitio) · Superficie: `#1B3A4D`
  (antes `#392616`) · Hundido: `#081420` (antes `#160E05`) · Texto 1º: `#F0EAE2` (sin cambio) ·
  Texto 2º: `#9FB4C2` (azul-gris cálido, antes beige `#A9977F` — reajustado para seguir cumpliendo
  AA sobre el nuevo fondo azul). El dorado se mantiene EXACTO, sin cambios (ver abajo) — el
  usuario pidió explícitamente combinarlo "tal cual" con el azul.
- Acento: `#C4A177` (beige-dorado — SIN CAMBIOS en el repaletizado a azul del 2026-09-09; SOLO en CTAs, progreso y momentos de logro) · 2ª nota: `#D08B5E` (ámbar-terracota — antes `#8C4A3C` burdeos; aclarado el 2026-09-09 porque el burdeos original casi no se distinguía sobre el nuevo fondo azul marino, mismo uso: solo en el módulo de Duelo/Programa de Sanación)
- Semánticos: éxito `#7A9E6E` (verde salvia, no verde chillón) · error `#B85C4D` (terracota-rojo, coherente con la paleta) · aviso `#D4A24C`
- Display: serif humanista cálida (ej. familia tipo Fraunces/Lora — se confirma candidata final en la sesión de código) pesos 400/600 · Body: sans humanista (ej. tipo Inter/Karla) pesos 400/500 · Escala: display 32px / title 22px / body 16px / label 13px
- Radio: 20px · Profundidad: sombras sutiles de 1 nivel (nada de glass ni glow) · Espaciado base: escala 4·8·12·16·24·32·48·64
- Dispositivo ownable: textura de papel/grano muy sutil en cards de diario + micro-fase lunar como indicador de progreso del módulo de duelo (14/30 días) — receta propia, no genérica
- Motion signature: easing suave tipo ease-out lento (curva de respiración, no rebote) · stagger 60ms entre elementos · firma: el escaneo somático "respira" (opacidad+escala sutil en loop, 4s) en vez de animar con spring energético

## Trazabilidad y vetos
- Ruta de diseño: propuesta propia (fusión de líderes, sin captura de referencia)
- Protocolo A/B/C: ejecutado en `direcciones-abc.html` (raíz del proyecto) — 3 composiciones
  estructuralmente distintas dentro de "mística cálida": A "Bitácora de Luna" (clara/editorial),
  B "Ritual Nocturno" (oscura/anillo — ELEGIDA), C "Carta y Cuerpo" (pergamino/timeline).
  Screenshot: `docs/revisiones/direcciones-abc.png`. Descartadas: A (muy diurna/clara para un
  avatar cuya crisis ocurre de noche) y C (formato editorial, se sintió menos "app" y más
  "revista"). Opción elegida: B — coincide con el ritual nocturno de Calm y el momento de
  mayor dolor del avatar (3 AM).
- Tour de la app: `vista-previa-app.html` (raíz), 5 vistas (Hoy, onboarding, paywall, mecanismo
  en curso, módulo de duelo) con los tokens de la Opción B. Screenshot:
  `docs/revisiones/vista-previa-app.png`.
- Paleta derivada de: banco `54` "Journaling/diario" (tomada tal cual para el ámbar) + acento burdeos añadido por pedido explícito del usuario · Dispositivo ownable elegido: papel con grano + fase lunar de progreso
- Registro anti-repetición: paleta ámbar-terracota-burdeos oscura + par serif humanista/sans humanista — vetados para el próximo proyecto del SO
- Modo (claro/oscuro) DERIVADO por: naturaleza nocturna del ritual del avatar (crisis a las 3 AM, "ritual antes de dormir" tomado de Calm) — nunca asumido por defecto

## Logo oficial (2026-09-10, adenda aprobada por el usuario)
El usuario entregó el logo real: un isotipo (luna protectora + estrella de luz somática, degradé
dorado `#F4E0C8`→`#D29E68`→`#B37D46`, mismos tonos ya aprobados) y un lockup completo con el
wordmark "BEYOND ASTROSOMA" en serif. Reemplaza en TODO el sitio el sello sol/luna provisional
(`SelloSolLuna`, inventado por el agente antes de que existiera un logo real — ya eliminado de
`Ornamentos.tsx`): ahora vive como `components/landing/Isotipo.tsx`, usado en el logo del header
de la landing, el centro del Hero, Oferta, login y paywall, y como ícono de pestaña
(`app/icon.svg`). El lockup completo con el wordmark ("BEYOND ASTROSOMA") todavía NO se usó en
ningún lugar — pendiente de confirmar con el usuario si el nombre de marca pasa a ser
"Beyond: AstroSoma" en el copy visible (hoy el sitio dice solo "AstroSoma").

## Idioma UI: Español (tuteo) · Fecha de cierre de la ficha: 2026-09-04 · Aprobada por el usuario: SÍ — tour confirmado ("me encanta") tras 2 ajustes (fondo a café oscuro `#211609`, acento aclarado a beige-dorado `#C4A177`). COSA JUZGADA: no se re-decide a mitad de proyecto.

**Adenda 2026-09-09 (SÍ afecta cosa juzgada, con aprobación explícita del usuario):** repaletizado
de café a azul marino en TODO el sitio (landing, onboarding, paywall, login, app interna) — ver
"Brand kit final" arriba. Cambio de un solo archivo (`components/landing/tokens.css`, más su
espejo en `vista-previa-app.html`), sin tocar estructura ni componentes. El dorado, la tipografía,
los radios y el motion signature NO cambiaron — solo la base de color. Verificado con
tsc+eslint+build limpios y capturas de landing/onboarding/paywall/entrar/app mostradas al usuario.
