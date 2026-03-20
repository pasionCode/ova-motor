/**
 * MOTOR DE PUNTUACIÓN — OVA LEXUM
 *
 * Calcula resultados de sesión, diagnóstico por tema
 * y métricas de rendimiento. Sin efectos secundarios.
 */

/**
 * Calcula el resumen de una sesión completa.
 * @param {Array} resultados - Array de { pregunta, correcto }
 * @returns {Object}
 */
export function calcularResumen(resultados) {
  const total     = resultados.length;
  const correctas = resultados.filter(r => r.correcto).length;
  const pct       = total > 0 ? Math.round((correctas / total) * 100) : 0;

  const nivel =
    pct >= 90 ? { label: 'EXCEPCIONAL', color: '#34d399' } :
    pct >= 75 ? { label: 'APROBADO',    color: '#60a5fa' } :
    pct >= 60 ? { label: 'EN PROGRESO', color: '#fbbf24' } :
                { label: 'REPASAR',     color: '#f87171' };

  return { total, correctas, pct, nivel };
}

/**
 * Calcula el rendimiento por tema en una sesión.
 * @param {Array} resultados - Array de { pregunta, correcto }
 * @returns {Array} - Ordenado de menor a mayor rendimiento
 */
export function calcularPorTema(resultados) {
  const mapa = {};
  resultados.forEach(({ pregunta, correcto }) => {
    const t = pregunta.tema;
    if (!mapa[t]) mapa[t] = { tema: t, correcto: 0, total: 0 };
    mapa[t].total++;
    if (correcto) mapa[t].correcto++;
  });

  return Object.values(mapa)
    .map(t => ({ ...t, pct: Math.round((t.correcto / t.total) * 100) }))
    .sort((a, b) => a.pct - b.pct);
}

/**
 * Retorna IDs de preguntas incorrectas de una sesión.
 * @param {Array} resultados
 * @returns {Array<number>}
 */
export function obtenerIdsFalladas(resultados) {
  return resultados
    .filter(r => !r.correcto)
    .map(r => r.pregunta.id);
}

/**
 * Calcula el color de una barra de progreso según el porcentaje.
 */
export function colorPorcentaje(pct) {
  if (pct >= 80) return '#059669';
  if (pct >= 60) return '#d97706';
  return '#dc2626';
}
