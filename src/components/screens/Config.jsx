/**
 * CONFIG.JSX — OVA LEXUM
 *
 * Fuente única de verdad de los filtros de sesión:
 *   modoBanco, parcial, tipo, temas, cantidad
 *
 * Flujo de modoBanco:
 *   usuario cambia toggle
 *   → Config llama onCambiarModoBanco(modo)
 *   → App actualiza modoBancoActivo
 *   → useBanco recarga
 *   → cargandoBanco baja a false
 *   → recién se habilita "Iniciar"
 *
 * El botón Iniciar está bloqueado si:
 *   cargandoBanco === true
 *   o modoBancoActivo !== filtros.modoBanco
 */

import { useState, useMemo, useEffect } from 'react';
import { Header, Btn } from '../ui/UIComponents.jsx';
import { obtenerTemas, obtenerParciales, seleccionarPreguntas, estadisticasBanco } from '../../engine/questionSelector.js';

const TIPOS = [
  { key:'todos', label:'TODOS' },
  { key:'MC',    label:'SELECCIÓN' },
  { key:'TF',    label:'F / V' },
  { key:'CC',    label:'CASO' },
  { key:'CD',    label:'COMPLETAR' },
];
const CANTIDADES = [5, 10, 15, 20, 30];

const FILTROS_DEFECTO = {
  modoBanco: 'full',
  parcial:   'todos',
  tipo:      'todos',
  temas:     [],
  cantidad:  10,
};

export default function Config({
  materia,
  banco,
  modoBancoActivo,
  cargandoBanco,
  modoRepaso,
  idsRepaso,
  onCambiarModoBanco,
  onIniciarQuiz,
  onVolver,
}) {
  const [filtros, setFiltros] = useState({ ...FILTROS_DEFECTO });

  // Resetear filtros si cambia la materia
  useEffect(() => {
    setFiltros({ ...FILTROS_DEFECTO });
  }, [materia?.id]);

  // Sincronizar filtros.modoBanco con modoBancoActivo cuando App termina de cargar
  // (por si el usuario vuelve a Config desde otro estado)
  useEffect(() => {
    setFiltros(prev => ({ ...prev, modoBanco: modoBancoActivo }));
  }, [modoBancoActivo]);

  function set(campo, valor) {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  }

  function cambiarModo(modo) {
    set('modoBanco', modo);
    set('temas', []); // resetear temas al cambiar modo
    onCambiarModoBanco(modo); // dispara recarga en App
  }

  function toggleTema(tema) {
    setFiltros(prev => ({
      ...prev,
      temas: prev.temas.includes(tema)
        ? prev.temas.filter(t => t !== tema)
        : [...prev.temas, tema],
    }));
  }

  const temasDisponibles = useMemo(
    () => obtenerTemas(banco, filtros.parcial),
    [banco, filtros.parcial]
  );

  // Opciones de parcial dinámicas: detecta lo que hay en el banco
  // + siempre incluye 'todos' y 'MIX'
  const opcionesParcial = useMemo(() => {
    const detectados = obtenerParciales(banco); // ['P1','P2',...]
    return [
      { key: 'todos', label: 'TODOS' },
      ...detectados.map(p => ({ key: p, label: p })),
      { key: 'MIX', label: '◈ MIX' },
    ];
  }, [banco]);

  const stats = useMemo(() => estadisticasBanco(banco), [banco]);

  const preview = useMemo(() => {
    if (modoRepaso) return idsRepaso?.length || 0;
    return seleccionarPreguntas(banco, {
      parcial:  filtros.parcial,
      temas:    filtros.temas,
      tipo:     filtros.tipo,
      cantidad: 99999,
    }).length;
  }, [banco, filtros.parcial, filtros.temas, filtros.tipo, modoRepaso, idsRepaso]);

  const cantidadFinal = Math.min(filtros.cantidad, preview);

  // Bloquear Iniciar si banco no está sincronizado con el modo elegido
  const bancoPendiente = cargandoBanco || modoBancoActivo !== filtros.modoBanco;
  const iniciarBloqueado = bancoPendiente || preview === 0 || cantidadFinal === 0;

  function confirmar() {
    onIniciarQuiz({
      modoBanco:  filtros.modoBanco,
      parcial:    filtros.parcial,
      tipo:       filtros.tipo,
      temas:      filtros.temas,
      cantidad:   cantidadFinal,
      modoRepaso: modoRepaso || false,
    });
  }

  const chip = (activo) => ({
    background:  activo ? '#1e40af' : '#0a1929',
    color:       activo ? '#e2e8f0' : '#94a3b8',
    border:     `1px solid ${activo ? '#60a5fa' : '#1e3a5f'}`,
    padding: '7px 12px', borderRadius: 6, cursor: 'pointer',
    fontSize: 12, fontFamily: 'var(--font-mono)', transition: 'all 0.15s',
  });

  const lbl = {
    color: '#94a3b8', fontSize: 11, letterSpacing: 1,
    marginBottom: 8, display: 'block', fontFamily: 'var(--font-mono)',
  };

  return (
    <div className="screen">
      <Header
        titulo={modoRepaso ? 'MODO REPASO' : 'CONFIGURAR EVALUACIÓN'}
        subtitulo={materia?.nombre}
        onVolver={onVolver}
      />
      <div className="container">

        {/* Banner modo repaso */}
        {modoRepaso && (
          <div className="card" style={{ borderColor:'#d97706' }}>
            <div style={{ color:'#fbbf24', fontFamily:'var(--font-mono)', fontSize:13, marginBottom:6 }}>
              ⟳ MODO REPASO ACTIVO
            </div>
            <div style={{ color:'#94a3b8', fontSize:13 }}>
              <strong style={{ color:'#fbbf24' }}>{idsRepaso?.length || 0}</strong> preguntas
              con errores registrados. Ajusta la cantidad si quieres.
            </div>
          </div>
        )}

        {!modoRepaso && (
          <>
            {/* Modo banco */}
            <div className="card">
              <span style={lbl}>MODO DE BANCO</span>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
                {[
                  ['full', `COMPLETO (${banco.length} pregs.)`],
                  ['demo', 'DEMO (muestra reducida)'],
                ].map(([v, l]) => (
                  <button key={v} style={chip(filtros.modoBanco === v)}
                    onClick={() => cambiarModo(v)}>
                    {l}
                  </button>
                ))}
                {bancoPendiente && (
                  <span style={{ color:'#fbbf24', fontSize:11, fontFamily:'var(--font-mono)' }}>
                    ⟳ cargando banco…
                  </span>
                )}
              </div>
            </div>

            {/* Parcial */}
            <div className="card">
              <span style={lbl}>PARCIAL</span>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {opcionesParcial.map(({ key, label }) => (
                  <button key={key} style={chip(filtros.parcial===key)}
                    onClick={() => { set('parcial', key); set('temas', []); }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tipo */}
            <div className="card">
              <span style={lbl}>TIPO DE PREGUNTA</span>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {TIPOS.map(t => (
                  <button key={t.key} style={chip(filtros.tipo===t.key)}
                    onClick={() => set('tipo', t.key)}>
                    {t.label}{t.key!=='todos' ? ` (${stats[t.key]||0})` : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Temas */}
            <div className="card">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <span style={lbl}>TEMAS — opcional</span>
                {filtros.temas.length > 0 && (
                  <button onClick={() => set('temas',[])}
                    style={{ background:'none', color:'#94a3b8', border:'none', fontSize:11, cursor:'pointer' }}>
                    limpiar
                  </button>
                )}
              </div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {temasDisponibles.map(t => (
                  <button key={t}
                    style={{ ...chip(filtros.temas.includes(t)), fontSize:11, padding:'5px 10px' }}
                    onClick={() => toggleTema(t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Cantidad */}
        <div className="card">
          <span style={lbl}>CANTIDAD DE PREGUNTAS</span>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {CANTIDADES.map(n => (
              <button key={n} style={chip(filtros.cantidad===n)}
                onClick={() => set('cantidad', n)}>{n}</button>
            ))}
            <button style={chip(filtros.cantidad===9999)}
              onClick={() => set('cantidad', 9999)}>TODAS</button>
          </div>
        </div>

        {/* Preview + Iniciar */}
        <div className="card" style={{ borderColor: iniciarBloqueado ? '#1e293b' : '#1e40af' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div>
              <div style={{ color:'#94a3b8', fontSize:11, letterSpacing:1 }}>DISPONIBLES</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:28,
                color: bancoPendiente ? '#94a3b8' : '#93c5fd' }}>
                {bancoPendiente ? '…' : preview}
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ color:'#94a3b8', fontSize:11, letterSpacing:1 }}>SE EVALUARÁN</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:28, color:'#60a5fa' }}>
                {bancoPendiente ? '…' : cantidadFinal}
              </div>
            </div>
          </div>

          <Btn onClick={confirmar} disabled={iniciarBloqueado} full>
            {bancoPendiente ? '⟳ CARGANDO BANCO…' : '▶ INICIAR EVALUACIÓN'}
          </Btn>

          {!bancoPendiente && preview === 0 && (
            <div style={{ color:'#f87171', fontSize:12, marginTop:8, textAlign:'center' }}>
              Sin preguntas con esos filtros. Ajusta parcial o temas.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
