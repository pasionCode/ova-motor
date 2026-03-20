/**
 * MOTOR DE SELECCIÓN DE PREGUNTAS — OVA LEXUM
 *
 * Este módulo es el corazón del motor. Recibe el banco completo
 * y los filtros del usuario, y devuelve la lista de preguntas
 * para la sesión actual, mezcladas y listas para evaluar.
 *
 * Es completamente puro (sin efectos secundarios).
 * No sabe nada de React ni de localStorage.
 */

/**
 * Mezcla un array aleatoriamente (Fisher-Yates).
 * @param {Array} arr
 * @returns {Array} nuevo array mezclado
 */
export function mezclar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Selecciona preguntas del banco según los filtros dados.
 *
 * @param {Array}  banco     - Array completo de preguntas del JSON
 * @param {Object} filtros   - { parcial, temas, tipo, cantidad, idsRepaso }
 * @returns {Array}          - Preguntas seleccionadas y mezcladas
 */
export function seleccionarPreguntas(banco, filtros = {}) {
  const {
    parcial   = 'todos',   // 'P1' | 'P2' | 'MIX' | 'todos'
    temas     = [],         // [] = todos los temas
    tipo      = 'todos',   // 'MC' | 'TF' | 'CC' | 'CD' | 'todos'
    cantidad  = 10,
    idsRepaso = null,       // Si se pasa, solo selecciona esos IDs
  } = filtros;

  let pool = [...banco];

  // Modo repaso: forzar lista de IDs con errores
  if (idsRepaso && idsRepaso.length > 0) {
    pool = pool.filter(q => idsRepaso.includes(q.id));
    return mezclar(pool).slice(0, cantidad);
  }

  // Filtro por parcial
  if (parcial !== 'todos' && parcial !== 'MIX') {
    pool = pool.filter(q => q.parcial === parcial);
  }

  // Filtro por temas
  if (temas.length > 0) {
    pool = pool.filter(q => temas.includes(q.tema));
  }

  // Filtro por tipo
  if (tipo !== 'todos') {
    pool = pool.filter(q => q.tipo === tipo);
  }

  // Si hay menos preguntas que la cantidad pedida, usar todas
  const n = Math.min(cantidad, pool.length);

  return mezclar(pool).slice(0, n);
}

/**
 * Extrae los temas únicos de un banco.
 * @param {Array} banco
 * @param {string} parcial - opcional para filtrar por parcial
 * @returns {Array<string>}
 */
export function obtenerTemas(banco, parcial = 'todos') {
  let pool = banco;
  if (parcial !== 'todos' && parcial !== 'MIX') {
    pool = banco.filter(q => q.parcial === parcial);
  }
  return [...new Set(pool.map(q => q.tema))].sort();
}

/**
 * Extrae los parciales únicos de un banco.
 * @param {Array} banco
 * @returns {Array<string>}
 */
export function obtenerParciales(banco) {
  return [...new Set(banco.map(q => q.parcial))].sort();
}

/**
 * Estadísticas del banco por tipo de pregunta.
 * @param {Array} banco
 * @returns {Object}
 */
export function estadisticasBanco(banco) {
  return banco.reduce((acc, q) => {
    acc[q.tipo] = (acc[q.tipo] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Verifica si la respuesta del usuario es correcta.
 * Maneja los 4 tipos de pregunta.
 *
 * @param {Object} pregunta  - Objeto del banco
 * @param {*}      respuesta - Lo que respondió el usuario
 * @returns {boolean}
 */
export function esCorrecta(pregunta, respuesta) {
  switch (pregunta.tipo) {
    case 'MC':
      // respuesta es el índice seleccionado (número)
      return respuesta === pregunta.respuesta;

    case 'TF':
      // respuesta es 'VERDADERO' | 'FALSO'
      if (pregunta.respuesta === true)  return respuesta === 'VERDADERO';
      if (pregunta.respuesta === false) return respuesta === 'FALSO';
      return false;

    case 'CD':
    case 'CC':
      // respuesta es texto libre; verificar palabras clave
      if (!respuesta || !pregunta.palabrasClave) return false;
      const texto = respuesta.toLowerCase();
      return pregunta.palabrasClave.some(k => texto.includes(k.toLowerCase()));

    default:
      return false;
  }
}
