/**
 * INICIO.JSX — OVA LEXUM
 *
 * Portada dinámica de la materia.
 * No asume P1/P2 — detecta parciales desde el banco.
 * Escala a P3, P4 o cualquier etiqueta automáticamente.
 */

import { useState, useEffect, useMemo } from 'react';
import { Header, Btn, ProgressBar, StatusDot } from '../ui/UIComponents.jsx';
import {
  obtenerHistorial, obtenerTemasDebiles, obtenerColaRepaso,
  exportarProgreso, importarProgreso, limpiarTodo,
} from '../../storage/persistence.js';

export default function Inicio({ materia, banco, cargando, onIniciar, onRepaso }) {
  const [historial,    setHistorial]   = useState([]);
  const [temasDebiles, setTemasDebiles]= useState([]);
  const [colaRepaso,   setColaRepaso]  = useState([]);
  const [confirmLimpiar, setConfirm]  = useState(false);

  function recargarDatos() {
    setHistorial(obtenerHistorial());
    setTemasDebiles(obtenerTemasDebiles(materia?.nombre).slice(0, 5));
    setColaRepaso(obtenerColaRepaso(materia?.nombre));
  }

  useEffect(() => { recargarDatos(); }, [materia?.nombre]);

  // Calcular estadísticas del banco dinámicamente
  // Sin hardcodear P1/P2 — agrupa por cualquier parcial presente
  const statsBanco = useMemo(() => {
    if (!banco?.length) return { total: 0, porParcial: [] };
    const mapa = {};
    banco.forEach(q => {
      mapa[q.parcial] = (mapa[q.parcial] || 0) + 1;
    });
    const porParcial = Object.entries(mapa)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([parcial, count]) => ({ parcial, count }));
    return { total: banco.length, porParcial };
  }, [banco]);

  const ultimaSesion = historial.find(h => h.materia === materia?.nombre);

  function manejarImportar(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const r = importarProgreso(ev.target.result);
      if (r.ok) { recargarDatos(); alert('Progreso importado.'); }
      else alert('Error al importar: ' + r.error);
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function manejarLimpiar() {
    if (!confirmLimpiar) { setConfirm(true); return; }
    limpiarTodo(); recargarDatos(); setConfirm(false);
  }

  // Colores para los parciales detectados
  const COLORES_PARCIAL = ['#86efac','#93c5fd','#fdba74','#c4b5fd','#f9a8d4'];

  return (
    <div className="screen">
      <Header titulo={materia?.nombre || 'OVA Motor'} subtitulo="LEXUM · HERRAMIENTA DE ESTUDIO">
        <StatusDot
          activo={!cargando && banco?.length > 0}
          label={cargando ? 'CARGANDO…' : banco?.length > 0 ? `${banco.length} PREGS` : 'SIN BANCO'}
        />
      </Header>

      <div className="container">

        {/* Card principal */}
        <div className="card" style={{ borderColor:'#1e40af' }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:20, fontWeight:700, color:'#93c5fd', marginBottom:2 }}>
            {materia?.nombre}
          </div>
          <div style={{ color:'#475569', fontSize:12, marginBottom:16 }}>
            {materia?.semestre} · {materia?.docente}
          </div>

          {/* Stats dinámicos del banco */}
          {statsBanco.total > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(statsBanco.porParcial.length + 1, 4)}, 1fr)`,
              gap: 8, marginBottom: 18,
            }}>
              {/* Total */}
              <div style={{ background:'#0a1929', border:'1px solid #1e3a5f', borderRadius:6, padding:'10px 8px', textAlign:'center' }}>
                <div style={{ fontSize:20, fontWeight:700, color:'#e2e8f0', fontFamily:'var(--font-mono)' }}>
                  {statsBanco.total}
                </div>
                <div style={{ fontSize:10, color:'#475569', letterSpacing:1 }}>TOTAL</div>
              </div>
              {/* Por parcial — dinámico */}
              {statsBanco.porParcial.map(({ parcial, count }, i) => (
                <div key={parcial} style={{ background:'#0a1929', border:'1px solid #1e3a5f', borderRadius:6, padding:'10px 8px', textAlign:'center' }}>
                  <div style={{ fontSize:20, fontWeight:700, color: COLORES_PARCIAL[i % COLORES_PARCIAL.length], fontFamily:'var(--font-mono)' }}>
                    {count}
                  </div>
                  <div style={{ fontSize:10, color:'#475569', letterSpacing:1 }}>{parcial}</div>
                </div>
              ))}
            </div>
          )}

          {/* Última sesión */}
          {ultimaSesion && (
            <div style={{ background:'#0a1929', border:'1px solid #1e3a5f', borderRadius:6, padding:12, marginBottom:16 }}>
              <div style={{ color:'#64748b', fontSize:11, letterSpacing:1, marginBottom:4 }}>ÚLTIMA SESIÓN</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <span style={{ color:'#e2e8f0', fontSize:13, fontFamily:'var(--font-mono)' }}>
                    {ultimaSesion.correctas}/{ultimaSesion.total}
                  </span>
                  <span style={{ color:'#334155', margin:'0 8px' }}>·</span>
                  <span style={{ color:'#475569', fontSize:11 }}>{ultimaSesion.fecha}</span>
                  {ultimaSesion.parcial && (
                    <span style={{ color:'#334155', marginLeft:8, fontSize:11 }}>{ultimaSesion.parcial}</span>
                  )}
                </div>
                <span style={{
                  fontSize:22, fontWeight:700, fontFamily:'var(--font-mono)',
                  color: ultimaSesion.pct>=75 ? '#34d399' : ultimaSesion.pct>=60 ? '#fbbf24' : '#f87171',
                }}>
                  {ultimaSesion.pct}%
                </span>
              </div>
            </div>
          )}

          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <Btn onClick={onIniciar} disabled={cargando || !banco?.length} style={{ flex:1 }}>
              {cargando ? '⟳ CARGANDO…' : '▶ NUEVA EVALUACIÓN'}
            </Btn>
            {colaRepaso.length > 0 && (
              <Btn variante="warn" onClick={onRepaso}>
                ⟳ REPASAR ({colaRepaso.length})
              </Btn>
            )}
          </div>
        </div>

        {/* Temas débiles */}
        {temasDebiles.length > 0 && (
          <div className="card">
            <div style={{ color:'#fbbf24', fontSize:12, letterSpacing:1, marginBottom:12, fontFamily:'var(--font-mono)' }}>
              ⚠ TEMAS DÉBILES
            </div>
            {temasDebiles.map(t => (
              <div key={t.tema} style={{ marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4 }}>
                  <span style={{ color:'#94a3b8' }}>{t.tema}</span>
                  <span style={{ fontFamily:'var(--font-mono)',
                    color: t.pct<60?'#f87171':t.pct<80?'#fbbf24':'#34d399' }}>
                    {t.pct}% ({t.correcto}/{t.total})
                  </span>
                </div>
                <ProgressBar pct={t.pct} />
              </div>
            ))}
          </div>
        )}

        {/* Gestión de progreso */}
        <div className="card">
          <div style={{ color:'#64748b', fontSize:11, letterSpacing:1, marginBottom:12 }}>
            GESTIONAR PROGRESO
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <Btn variante="ghost" onClick={exportarProgreso}>↓ EXPORTAR</Btn>
            <label style={{
              background:'#1e293b', color:'#94a3b8', border:'1px solid #334155',
              padding:'10px 18px', borderRadius:6, cursor:'pointer',
              fontSize:13, fontFamily:'var(--font-mono)',
            }}>
              ↑ IMPORTAR
              <input type="file" accept=".json" onChange={manejarImportar} style={{ display:'none' }} />
            </label>
            <Btn variante="danger" onClick={manejarLimpiar}>
              {confirmLimpiar ? '¿CONFIRMAR?' : '✕ LIMPIAR TODO'}
            </Btn>
          </div>
        </div>

      </div>
    </div>
  );
}
