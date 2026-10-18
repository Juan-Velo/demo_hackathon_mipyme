/* =====================================================================
   AGENTE REAL (webhook de chat de n8n)
   POST { action: 'sendMessage', sessionId, chatInput } → { output }
   Cada prospecto de la demo tiene su propio sessionId, así el agente
   recuerda la conversación de esa persona.
   ===================================================================== */
const uuid = () => (crypto.randomUUID ? crypto.randomUUID()
  : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); }));

// Devuelve el texto del agente, o null si no hubo respuesta (sin internet, error o tiempo agotado).
async function askAgent(L, text) {
  if (!L.sessionId) L.sessionId = uuid();
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), CONFIG.agente.timeoutMs);
  try {
    const res = await fetch(CONFIG.agente.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'sendMessage', sessionId: L.sessionId, chatInput: text }),
      signal: ctrl.signal
    });
    if (!res.ok) return null;
    const data = await res.json();
    const out = (Array.isArray(data) ? data[0] : data) || {};
    return typeof out.output === 'string' && out.output.trim() ? out.output.trim() : null;
  } catch (e) {
    return null;
  } finally {
    clearTimeout(t);
  }
}
