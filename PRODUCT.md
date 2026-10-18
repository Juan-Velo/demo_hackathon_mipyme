# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

El público principal es el jurado del hackathon Transforma+ MIPYME 2026. Ven el pitch y la demo proyectados en pantalla, desde lejos y con poco tiempo, y juzgan si la solución es clara, creíble y tiene impacto real.

El cliente es Bachata Studio, escuela de salsa y bachata en Miraflores, Lima, dirigida por Alberto Pérez. Es el caso para el que se construye la solución, no el público principal de estas pantallas.

## Product Purpose

Un asistente de ventas por WhatsApp para un negocio pequeño cuyas ventas empiezan con un mensaje y se pierden cuando nadie contesta. Responde en segundos a cualquier hora con los precios, horarios y dirección reales del estudio. Califica a cada prospecto, mantiene al día su ficha en el CRM, agenda y recuerda la clase de prueba, hace seguimiento (solo con permiso) a quien deja de responder, alerta al dueño cuando un prospecto está caliente y cierra la venta con la verificación del pago.

Éxito en el hackathon: que el jurado entienda cómo funciona y crea en su impacto (pasar de 10 a 32 compradores de cada 100 prospectos).

## Positioning

Está hecho alrededor de un dolor concreto: los prospectos escriben justo cuando el dueño está dictando clase (L–V 6–10 p.m., sábados 5–10 p.m.), y hoy a 90 de cada 100 nadie les vuelve a escribir. El asistente cubre esas horas sin que el dueño deje la clase. Respeta las reglas de WhatsApp (ventana de 24 h, plantillas aprobadas por Meta, consentimiento explícito, botón de baja) para cuidar la calidad del número.

## Operating Context

- Se entrega como un pitch en vivo (`pitch-bachata-studio.html`, 8 diapositivas) y una demo interactiva (`demo/index.html`, con su CSS, JS e imágenes en `demo/`), en una laptop conectada a un proyector o TV.
- La demo recorre escenarios guiados (boda → venta, seguimiento, prospecto en inglés, baja, modo libre) con un reloj simulado para mostrar seguimientos que ocurren horas o días después.
- Se planea una demo real: el asistente responderá a través de un webhook de n8n (POST `https://mekanico-vps.tail805b57.ts.net/webhook/3f6c2a9e-8b1d-4e57-a0c4-bachata00001/chat`). Los mensajes escritos a mano en la demo ya usan ese agente; los escenarios guiados siguen simulados para funcionar sin internet.

## Capabilities and Constraints

- Arquitectura: WhatsApp Cloud API (Meta) → n8n (orquestador) → agente de IA, Postgres (historial completo), Pipedrive (persona, deal, etapa, resumen de la IA), FitCo (alta de clientes y pagos). Detalle en `propuesta-whatsapp-crm.md`.
- Flujo de venta en la demo: el prospecto llega por la web del estudio y abre WhatsApp; el asistente ofrece primero los paquetes (4 h S/ 200, 8 h S/ 350, 16 h S/ 600). La clase de prueba (1 h S/ 60, 2 h S/ 90) se ofrece solo a quien duda, y se paga para confirmar el lugar. Pago con Mercado Pago (enlace a un checkout simulado) o con Yape (la IA lee el comprobante y Alberto lo confirma).
- Cadencia de seguimiento en la demo: 8 h, 23 h, día 3 y día 7; máximo 4 seguimientos; sin envíos de 9 p.m. a 9 a.m.; recordatorios 24 h y 2 h antes de la clase de prueba.
- WhatsApp: texto libre solo dentro de las 24 h siguientes al último mensaje del prospecto; después, plantillas aprobadas. Se requiere consentimiento y política de privacidad.
- Costo del pitch: S/ 919 al mes; implementación en menos de 3 meses.
- Archivos estáticos: el pitch es un HTML autocontenido; la demo separa HTML, CSS (`demo/css/`), JS (`demo/js/`) e imágenes (`demo/img/`). La demo escala un lienzo fijo de 1600×900.
- **Sin confirmar con el estudio:** mensualidad de S/ 220 y horarios de clase de prueba (jueves 7 p.m. y sábado 5 p.m.). No se presentan como hechos confirmados.
- Pendiente: nombres del equipo en el pitch (`[nombres del equipo]`).

## Brand Commitments

- Nombre: Bachata Studio, "Ritmos Latinos". Logo y marca "B" embebidos en ambos HTML.
- Degradado de la marca: rojo → rosa → magenta → rosa claro → amarillo (#FD1405, #FF3D8B, #FF59EF, #FEABB5, #FEF305).
- Todo el texto en español (Perú); el asistente responde en inglés cuando el prospecto escribe en inglés.
- El chat del prospecto se ve como WhatsApp, porque ese es el canal real.

## Evidence on Hand

- Datos del estudio (bachatastudio.com y el propio estudio): más de 10 años de experiencia del director, 5.0 en Google con 103 reseñas, clases privadas a S/ 50 la hora, paquetes de 4 h por S/ 200, 8 h por S/ 350 y 16 h por S/ 600, dirección Calle Tarata 269, Int. 205, Miraflores.
- Valor de vida de un cliente: S/ 2,100.
- Fuente externa: responder en la primera hora da 7× más probabilidad de lograr una conversación de venta (Harvard Business Review, 2,241 empresas).
- La proyección de 10 % → 32 % de conversión es un análisis del equipo, no un resultado medido. No hay testimonios, clientes ni resultados medidos del asistente; no inventarlos.

## Product Principles

1. Claridad en segundos: un miembro del jurado que mira desde lejos debe entender qué pasa y por qué importa, sin jerga técnica.
2. Mostrar, no contar: el valor se transmite viendo al asistente trabajar en una conversación real, no con listas de funciones.
3. Números honestos: lo proyectado se marca como proyección, y los datos sin confirmar no se afirman como hechos.
4. Respeto al prospecto: permiso antes de escribir, salida fácil y nada de spam. Es parte del producto, no una nota al pie.
5. El dueño sigue enseñando: cada flujo se mide por cuánto tiempo le ahorra a Alberto.

## Accessibility & Inclusion

Lectura proyectada: texto grande, alto contraste y estados que se distingan a distancia.
