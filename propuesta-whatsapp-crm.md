# Propuesta: Captación y seguimiento de prospectos por WhatsApp con agente de IA

## 1. Objetivo

Mantener el historial completo de cada prospecto, desde su primer contacto por WhatsApp hasta que se convierte en cliente. El seguimiento lo automatiza un agente de IA y la gestión comercial se hace en Pipedrive.

## 2. Arquitectura

```
Landing page (enlace wa.me con código de origen)
        │
        ▼
WhatsApp ──▶ Proveedor de mensajería (Meta Cloud API o Twilio)
                        │  webhook HTTPS
                        ▼
                      n8n (orquestador)
          ┌─────────────┼─────────────────────┐
          ▼             ▼                     ▼
   Postgres         Agente de IA          Pipedrive
   (historial       (memoria por          (persona, lead/deal,
   completo de      número, responde      etapa, resumen IA)
   mensajes)        al prospecto)
                        ▲
   Cron en n8n: prospectos sin actividad ──┘ (plantilla de seguimiento)
```

### Componentes

| Componente | Rol |
|---|---|
| **Landing page** | Informativa. El botón de WhatsApp lleva texto prellenado con un código de origen (`ref=...`) para atribuir cada prospecto a su canal. |
| **WhatsApp + proveedor** | Recibe y envía los mensajes. Hay dos opciones, Meta Cloud API directa o Twilio (comparadas en la sección 4). |
| **n8n** | Orquesta el flujo: recibe el webhook, llama al agente, guarda el historial, sincroniza con Pipedrive y programa los seguimientos. |
| **Agente de IA** | Responde dentro de la ventana de 24 h, califica al prospecto y decide cuándo escalar a un vendedor. |
| **Postgres** | Guarda el historial completo de la conversación, que es la fuente de verdad. |
| **Pipedrive** | CRM. Guarda solo lo comercial: persona (teléfono en formato E.164), lead o deal, etapa del embudo y un resumen periódico generado por la IA. La conversión se ve como Lead → Deal → Ganado. |

### Decisiones de diseño

- **El historial no se guarda en Pipedrive.** Registrar cada mensaje como nota satura la ficha y consume el límite de la API. Pipedrive recibe solo eventos y resúmenes.
- **El envío es un paso fijo del workflow, no una herramienta del agente.** Así cada mensaje recibe exactamente una respuesta.
- **El webhook responde 200 al instante.** La respuesta del agente se envía después por la API, porque el LLM puede tardar más de lo que el proveedor espera.
- **Se descartan mensajes duplicados** usando el ID del mensaje, ya que el proveedor puede reintentar la entrega.
- **Los mensajes en ráfaga se agrupan** con una espera de 5–10 s por número, para que el agente no responda varias veces seguidas.
- **Hay escalamiento a un humano:** una etiqueta en Pipedrive pausa al agente para ese prospecto.

## 3. Restricciones de WhatsApp

- **Ventana de 24 h:** solo se puede enviar texto libre durante las 24 h siguientes al último mensaje del prospecto. Fuera de esa ventana hacen falta **plantillas aprobadas por Meta**.
- Los seguimientos comerciales son plantillas de **marketing**. Meta reclasifica como marketing cualquier contenido promocional, aunque se envíe como "utilidad".
- Si muchos mensajes de marketing quedan sin respuesta, aumentan los bloqueos y reportes. Eso baja la calificación de calidad del número y puede llevar a que Meta lo limite.
- Hace falta consentimiento y una política de privacidad, porque se guardan teléfonos y conversaciones.

## 4. Proveedor: Meta Cloud API vs. Twilio

### Escenario de volumen

- 50 prospectos nuevos al día (~1.500 al mes).
- Conversación inicial: ~10 mensajes entrantes y ~10 salientes por prospecto.
- Seguimiento: 1 plantilla cada 7 días, hasta 20 (~140 días en el embudo).
- El 20% responde a los seguimientos, con ~2 mensajes entrantes y ~2 salientes por respuesta.

### Costo del proveedor (sin incluir las tarifas de Meta, que se pagan igual en ambos casos)

Twilio cobra **$0.005 por mensaje**, tanto entrante como saliente.

| Tipo | Mensajes al mes (régimen estable) | Twilio | Meta directo |
|---|---|---|---|
| Conversación inicial, entrantes | 15.000 | $75 | $0 |
| Conversación inicial, salientes | 15.000 | $75 | $0 |
| Seguimientos (plantillas) | 30.000 | $150 | $0 |
| Respuestas a los seguimientos | 24.000 | $120 | $0 |
| **Total al mes** | **~84.000** | **~$420** | **$0** |

El costo de Twilio sube durante los primeros meses, a medida que se acumulan grupos de prospectos en seguimiento: ~$210 el mes 1, ~$340 el mes 3 y ~$420 desde el mes 5. Equivale a **~$0,28 por prospecto** en todo su ciclo.

Con una cadencia optimizada de 8 toques decrecientes (sección 5), Twilio baja a **~$230 al mes**.

### Comparación funcional

| | Twilio | Meta Cloud API directo |
|---|---|---|
| Cargo por mensaje | $0.005 | $0 |
| Número | Comprado en Twilio (~$1–2 al mes) o uno propio | Uno propio, sin costo |
| Recibir mensajes en n8n | Webhook genérico | Nodo nativo **WhatsApp Trigger** |
| Enviar plantillas en n8n | No hay soporte nativo; se usa HTTP Request con `ContentSid` | Nodo nativo **Send Template** |
| Multimedia | Limitado en el nodo | Upload y Download nativos |
| Soporte técnico | Bueno, con planes de soporte | Limitado |
| Configuración inicial | Guiada y con menos fricción | Más trabajosa: Business Manager, app, token de *System User*, verificación del webhook |
| Otros canales (SMS, voz) | Sí | Solo WhatsApp |
| Facturación | Una sola factura | Tarjeta en la cuenta de WhatsApp Business |

### Recomendación

Para un solo canal (WhatsApp), un solo número y n8n como orquestador, se recomienda **Meta Cloud API directa**:

- Ahorra **$230–420 al mes** (~$2.800–5.000 al año).
- Los nodos nativos de n8n cubren mensajes entrantes, envío de plantillas y multimedia, y simplifican el workflow.

Twilio conviene si más adelante se necesita SMS o voz, varios números o países, o soporte con SLA.

## 5. Recomendaciones para el seguimiento

20 toques semanales no es una cadencia eficiente. La mayoría de las conversiones ocurren en los primeros 3–5 contactos, y los demás aumentan costo y riesgo de bloqueo.

- **Cadencia decreciente:** días 1, 3, 7, 14, 21, 30, 45 y 60 (8 toques).
- **Salida inmediata de la secuencia** si el prospecto responde, compra, rechaza o lleva mucho tiempo sin interactuar.
- **Capturar el email** durante la conversación y hacer los seguimientos largos por correo.
- **Calificación por el agente:** los prospectos fríos se marcan en Pipedrive y no entran a la secuencia completa.

## 6. Escalabilidad

| Componente | Límite | Cuándo actuar | Solución |
|---|---|---|---|
| n8n (una instancia) | Webhooks y agente en el mismo proceso | Decenas de conversaciones simultáneas | n8n en *queue mode* (Redis + workers) |
| Pipedrive API | Límite de llamadas según el plan | Si se sincroniza cada mensaje | Sincronizar solo eventos y resúmenes |
| WhatsApp | Cuotas de envío según la calidad del número | Envíos masivos de plantillas | Subir el volumen de forma gradual y cuidar la calidad |
| LLM | Costo por token | Historiales largos | Memoria resumida con los últimos N mensajes |

Una instancia de n8n en modo normal alcanza para cientos de prospectos al día. Para miles se recomienda *queue mode*.

## 7. Requisitos previos

1. n8n accesible con un **webhook público por HTTPS**.
2. Cuenta de **Meta Business** verificada y número dedicado a la API, o una cuenta de Twilio si se elige esa opción.
3. **Plantillas de seguimiento** aprobadas por Meta.
4. Pipedrive con el embudo definido (Lead → Deal → Ganado) y credencial de API.
5. Base Postgres para el historial.

## 8. Fuentes

- [Twilio – Cambios de precios de WhatsApp (octubre 2026)](https://support.twilio.com/hc/en-us/articles/53100480177819-Notice-Changes-to-WhatsApp-s-Pricing-October-2026)
- [Customer.io – Facturación de WhatsApp (tarifa de Twilio $0.005)](https://docs.customer.io/accounts/billing/whatsapp-billing/)
- [Landbot – Precios de Twilio WhatsApp](https://landbot.io/blog/twilio-whatsapp-pricing)
- [Zernio – Desglose de precios de Twilio WhatsApp](https://my.zernio.com/blog/twilio-whatsapp-pricing-breakdown-what-it-really-costs)
- [Sleekflow – Precios de WhatsApp Business API 2026/2027](https://sleekflow.io/blog/whatsapp-business-price)

*Las tarifas están vigentes a octubre de 2026 y deben confirmarse con las páginas oficiales de Twilio y Meta antes de presupuestar.*
