/**
 * CAPA DE PERSISTENCIA — Motor OVA LEXUM
 * 
 * Toda la persistencia usa localStorage con claves con prefijo 'ova_'.
 * Esto permite coexistir con otras apps sin conflictos.
 * 
 * Estructura de datos:
 *  ova_historial       → Array de sesiones completadas
 *  ova_errores         → { [questionId]: { count, tema, parcial, materia } }
 *  ova_temas_debiles   → { [materia_parcial_tema]: { correcto, total } }
 *  ova_cola_repaso     → Array de IDs de preguntas con errores
 */

const KEY = {
  HISTORIAL:    'ova_historial',
  ERRORES:      'ova_errores',
  TEMAS:        'ova_temas_debiles',
  COLA_REPASO:  'ova_cola_repaso',
};

// ── Helpers base ──────────────────────────────────────────────

function leer(clave) {
  try {
    const raw = localStorage.getItem(clave);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

// ── HISTORIAL ─────────────────────────────────────────────────

/**
 * Guarda una sesión de evaluación completada.
 * @param {Object} sesion - Datos de la sesión
 */
export function guardarSesion(sesion) {
  const historial = leer(KEY.HISTORIAL) || [];
  const entrada = {
    id: Date.now(),
    fecha: new Date().toLocaleString('es-CO'),
    materia: sesion.materia,
    parcial: sesion.parcial,
    total: sesion.total,
    correctas: sesion.correctas,
    pct: Math.round((sesion.correctas / sesion.total) * 100),
    temas:     sesion.temas || [],
    modoBanco: sesion.modoBanco || 'full',
    duracion:  sesion.duracion || null,
  };
  historial.unshift(entrada); // más reciente primero
  guardar(KEY.HISTORIAL, historial.slice(0, 50)); // máximo 50 sesiones
  return entrada;
}

/** Retorna todas las sesiones guardadas. */
export function obtenerHistorial() {
  return leer(KEY.HISTORIAL) || [];
}

/** Elimina todo el historial. */
export function limpiarHistorial() {
  localStorage.removeItem(KEY.HISTORIAL);
}

// ── ERRORES POR PREGUNTA ──────────────────────────────────────

/**
 * Registra un error en una pregunta específica.
 * @param {Object} pregunta - Objeto pregunta del banco
 * @param {string} materia - Nombre de la materia
 */
export function registrarError(pregunta, materia) {
  const errores = leer(KEY.ERRORES) || {};
  const key = `${materia}_${pregunta.id}`;
  errores[key] = {
    id: pregunta.id,
    count: (errores[key]?.count || 0) + 1,
    tema: pregunta.tema,
    parcial: pregunta.parcial,
    materia,
    pregunta: pregunta.pregunta?.substring(0, 80) + '…',
    ultimoError: new Date().toISOString(),
  };
  guardar(KEY.ERRORES, errores);
  actualizarColaRepaso(key, materia, pregunta);
}

/**
 * Registra una respuesta correcta; reduce el contador de error.
 */
export function registrarAcierto(pregunta, materia) {
  const errores = leer(KEY.ERRORES) || {};
  const key = `${materia}_${pregunta.id}`;
  if (errores[key]) {
    errores[key].count = Math.max(0, errores[key].count - 1);
    if (errores[key].count === 0) delete errores[key];
    guardar(KEY.ERRORES, errores);
  }
  quitarDeColaRepaso(key);
}

/** Retorna todos los errores registrados. */
export function obtenerErrores(materia = null) {
  const errores = leer(KEY.ERRORES) || {};
  if (!materia) return errores;
  return Object.fromEntries(
    Object.entries(errores).filter(([, v]) => v.materia === materia)
  );
}

/** Retorna IDs de preguntas con errores para una materia. */
export function obtenerIdsConError(materia) {
  const errores = obtenerErrores(materia);
  return Object.values(errores)
    .sort((a, b) => b.count - a.count)
    .map(e => e.id);
}

// ── TEMAS DÉBILES ─────────────────────────────────────────────

/**
 * Actualiza estadísticas de un tema tras responder una pregunta.
 */
export function actualizarTemasDebiles({ materia, parcial, tema, correcto }) {
  const temas = leer(KEY.TEMAS) || {};
  const key = `${materia}__${parcial}__${tema}`;
  temas[key] = {
    materia, parcial, tema,
    correcto: (temas[key]?.correcto || 0) + (correcto ? 1 : 0),
    total:    (temas[key]?.total || 0) + 1,
  };
  guardar(KEY.TEMAS, temas);
}

/** Retorna temas débiles de una materia, ordenados por % de error. */
export function obtenerTemasDebiles(materia = null) {
  const temas = leer(KEY.TEMAS) || {};
  let lista = Object.values(temas);
  if (materia) lista = lista.filter(t => t.materia === materia);
  return lista
    .map(t => ({ ...t, pct: Math.round((t.correcto / t.total) * 100) }))
    .sort((a, b) => a.pct - b.pct);
}

/** Limpia temas débiles. */
export function limpiarTemasDebiles() {
  localStorage.removeItem(KEY.TEMAS);
}

// ── COLA DE REPASO ────────────────────────────────────────────

function actualizarColaRepaso(key, materia, pregunta) {
  const cola = leer(KEY.COLA_REPASO) || [];
  const existe = cola.find(i => i.key === key);
  if (!existe) {
    cola.push({ key, id: pregunta.id, materia, parcial: pregunta.parcial });
  }
  guardar(KEY.COLA_REPASO, cola);
}

function quitarDeColaRepaso(key) {
  const cola = leer(KEY.COLA_REPASO) || [];
  guardar(KEY.COLA_REPASO, cola.filter(i => i.key !== key));
}

/** Retorna la cola de repaso para una materia. */
export function obtenerColaRepaso(materia = null) {
  const cola = leer(KEY.COLA_REPASO) || [];
  if (!materia) return cola;
  return cola.filter(i => i.materia === materia);
}

/** Limpia la cola de repaso. */
export function limpiarColaRepaso(materia = null) {
  if (!materia) {
    localStorage.removeItem(KEY.COLA_REPASO);
  } else {
    const cola = leer(KEY.COLA_REPASO) || [];
    guardar(KEY.COLA_REPASO, cola.filter(i => i.materia !== materia));
  }
}

// ── EXPORTAR / IMPORTAR PROGRESO ──────────────────────────────

/** Exporta todo el progreso como JSON descargable. */
export function exportarProgreso() {
  const data = {
    exportado: new Date().toISOString(),
    version: '1.0',
    historial: leer(KEY.HISTORIAL) || [],
    errores:   leer(KEY.ERRORES) || {},
    temas:     leer(KEY.TEMAS) || {},
    colaRepaso: leer(KEY.COLA_REPASO) || [],
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ova-progreso-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Importa progreso desde un archivo JSON. */
export function importarProgreso(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (!data.version) throw new Error('Formato inválido');
    if (data.historial)  guardar(KEY.HISTORIAL, data.historial);
    if (data.errores)    guardar(KEY.ERRORES, data.errores);
    if (data.temas)      guardar(KEY.TEMAS, data.temas);
    if (data.colaRepaso) guardar(KEY.COLA_REPASO, data.colaRepaso);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

/** Borra TODO el progreso (usar con precaución). */
export function limpiarTodo() {
  Object.values(KEY).forEach(k => localStorage.removeItem(k));
}
