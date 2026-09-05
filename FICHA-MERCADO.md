# FICHA DE MERCADO — AstroSoma

## Alcance de esta ficha
- Nicho/categoría exacta: apps de astrología personal con enfoque en salud somática y acompañamiento de duelo/ruptura amorosa
- País(es) donde se va a vender: mercado hispanohablante LATAM + comunidad hispana US (idioma español; benchmarks de competencia en inglés/mercado US) · Moneda de cobro: USD
- Fecha de investigación: 2026-09-04 (heredada del documento de validación de idea) · **Vence el:** 2027-03-04
- Pasarela/plataforma de venta elegida: Hotmart (definido por el SO como pasarela por defecto)

## 1. PRECIO — contra qué se compara el tuyo
- Mediana de precio de la categoría (mensual): NO ENCONTRADO — se decide por criterio y se revisa el 2027-03-04 · (anual): NO ENCONTRADO | fuente: — | fecha: —
- Ajuste por país: NO ENCONTRADO — se decide por criterio y se revisa el 2027-03-04
- Rango que cobran los líderes investigados: After: Heartbreak & Grief ~$12.99/mes | fuente: PDF de validación (apps.apple.com/us/app/after-heartbreak-grief) | fecha: 2026-09-04. Co-Star y The Pattern: freemium con upsells, precio exacto NO ENCONTRADO en la investigación original
- **Precio elegido para esta app:** $8.99/mes o $49.99/año, más Pase Único de Temporada de Duelo $14.99 · **Desvío respecto a la mediana:** ~-31% vs. After ($12.99)
- Razón del desvío (>±30%): posicionamiento deliberado como alternativa más accesible frente a After, principal competidor directo con módulo de duelo — diferenciador de precio explícito en la investigación de idea
- Precio por país/moneda: NO ENCONTRADO — pendiente de decisión de price parity si se abre venta multi-país; por ahora un solo precio en USD

## 2. CICLO DE DECISIÓN — cuándo se puede juzgar una campaña
- ¿Se compra el mismo día o se piensa?: probablemente compra impulsiva por dolor agudo (ruptura reciente) según el ángulo de venta ganador del PDF, pero sin dato de fuente propia | fuente: NO ENCONTRADO | fecha: —
- % de compras que arrancan >30 días después del primer contacto: NO ENCONTRADO — se decide por criterio y se revisa el 2027-03-04
- **Ventana mínima antes de declarar que una campaña fracasó:** 14 días (criterio conservador por defecto del SO ante falta de dato propio)

## 3. CÓMO PAGA ESTE MERCADO
- Medios de pago disponibles en el checkout real: pendiente de verificar al abrir el checkout de Hotmart en el Paso 6 (Servicios externos)
- Medios deshabilitados con el modelo elegido (suscripción): pendiente — Hotmart no auto-cobra PIX/boleto, impacta el dunning
- Penetración de tarjeta de crédito: NO ENCONTRADO | fuente: — | fecha: —
- ¿PIX/boleto disponibles?: pendiente de verificación en checkout real (Hotmart, Brasil)
- Medio de pago dominante local: NO ENCONTRADO
- **Consecuencia para el producto:** pendiente de evaluación al conectar Hotmart real (Paso 6)

## 4. PRUEBA Y GARANTÍA
- Plazos de prueba que admite la pasarela: pendiente de verificar en Hotmart real (Paso 6) — el PDF propone 7 días
- Plazos de garantía/reembolso que admite: pendiente de verificar en Hotmart (política estándar Hotmart: 7 días naturales / "garantía incondicional" según producto)
- Prueba elegida: 7 días · Garantía elegida: 15 días
- Comprobación: garantía 15 > prueba 7 → SÍ. Decisión provisional del agente (Hotmart soporta
  garantías configurables típicamente de 7-30 días; 15 dispara la regla dura sin depender de un
  dato aún no verificado). Se confirma el límite exacto de la cuenta real al conectar Hotmart en
  el Paso 6 — si el límite real de la cuenta es menor a 15, se ajusta este valor y el copy antes
  de abrir tráfico de pago (gate de `61-INTEGRIDAD-DE-LANZAMIENTO.md`).
- ¿Desde cuándo cuenta el plazo de garantía?: pendiente de confirmar con Hotmart

## 5. CONVERSIÓN ESPERABLE
- Conversión típica visita→registro del nicho: NO ENCONTRADO | fuente: —
- Conversión típica prueba→pago del nicho: NO ENCONTRADO | fuente: —
- **Umbral de muestra antes de decidir:** se define al llegar a la etapa de analítica/operación (60), tras tener tráfico real

## 6. ESTACIONALIDAD Y CONTEXTO
- ¿La demanda tiene picos?: sí — disparada por evento personal (ruptura/pérdida), no por calendario fijo; posible pico secundario en fechas de alta carga emocional (San Valentín, fin de año) | fuente: criterio propio sobre naturaleza del producto
- Horas de mayor intención observadas: madrugada (según escena del avatar, 3:00 AM) — hipótesis del avatar, no medición propia aún
- Regulación que afecte la venta: contenido de bienestar emocional/salud — revisar disclaimer de "no es tratamiento médico ni terapia" en `47-LEGAL-FISCAL-Y-PRIVACIDAD.md` antes de vender

## Notas de costo unitario (fuente: PDF de validación de idea)
- Costo estimado por usuario: ~$0.15/mes (API de efemérides + llamadas a modelo de IA) | fuente: PDF ASTROSOMA.pdf, sin desglose de proveedor específico — a validar con costos reales de IA al implementar
- Margen bruto estimado: ~98% a precio de $8.99/mes
