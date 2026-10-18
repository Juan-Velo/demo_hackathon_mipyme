/* =====================================================================
   CONFIGURACIÓN DEL ESTUDIO
   Datos de bachatastudio.com y del pitch. Los marcados "POR CONFIRMAR"
   deben validarse con Alberto antes del pitch.
   ===================================================================== */
const CONFIG = {
  estudio: 'Bachata Studio',
  director: 'Alberto Pérez',
  directorCorto: 'Alberto',
  direccion: 'Calle Tarata 269, Int. 205, Miraflores',
  numero: '+51 963 068 846',
  phoneNumberId: '481920374651029',
  paquetes: [{ h: 4, p: 200, v: '1 mes', en: '1 month' }, { h: 8, p: 350, v: '2 meses', en: '2 months' }, { h: 16, p: 600, v: '3 meses', en: '3 months' }], // paquetes reales (página de reservas)
  prueba: [{ h: 1, p: 60 }, { h: 2, p: 90 }],   // clase de prueba: solo para indecisos, se paga para confirmar
  horario: {
    es: 'de lunes a viernes de 6 a 10 p.m. y los sábados de 5 a 10 p.m.',
    en: 'Monday to Friday 6–10 p.m. and Saturdays 5–10 p.m.'
  },
  pruebas: [{ dow: 4, h: 19 }, { dow: 6, h: 17 }], // horarios de prueba: jueves 7 p.m. y sábado 5 p.m. (POR CONFIRMAR)
  ltv: 2100,
  silencio: { desde: 21, hasta: 9 },            // no se envían seguimientos comerciales de 9 p.m. a 9 a.m.
  cadencia: [
    { k: 's8',  h: 8,   n: 'Seguimiento 8 h' },
    { k: 's23', h: 23,  n: 'Seguimiento 23 h' },
    { k: 'd3',  h: 72,  n: 'Seguimiento día 3' },
    { k: 'd7',  h: 168, n: 'Seguimiento día 7' }
  ],
  umbralCaliente: 80,
  modelo: 'claude-haiku-5-5',
  // Agente real en n8n. Los mensajes que se escriben a mano en el celular
  // se responden con él; los escenarios guiados siguen simulados para que
  // el pitch funcione igual sin internet.
  agente: {
    url: 'https://mekanico-vps.tail805b57.ts.net/webhook/3f6c2a9e-8b1d-4e57-a0c4-bachata00001/chat',
    timeoutMs: 25000
  }
};
