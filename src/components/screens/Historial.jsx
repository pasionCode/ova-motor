/**
 * HISTORIAL.JSX — OVA LEXUM
 * Muestra sesiones guardadas agrupadas por materia.
 */

import { useState } from 'react';
import { Header, Btn, ProgressBar } from '../ui/UIComponents.jsx';
import { obtenerHistorial, limpiarHistorial } from '../../storage/persistence.js';

export default function Historial({ onVolver }) {
  const [historial, setHistorial] = useState(() => obtenerHistorial());
  const [confirmLimpiar, setConfirm] = useState(false);

  function limpiar() {
    if (!confirmLimpiar) { setConfirm(true); return; }
    limpiarHistorial();
    setHistorial([]);
    setConfirm(false);
  }

  const materias = [...new Set(historial.map(h => h.materia))];

  return (
    <div className="screen">
      <Header titulo="HISTORIAL" subtitulo={`${historial.length} sesiones registradas`} onVolver={onVolver} />
      <div className="container">

        {historial.length === 0 ? (
          <div className="card" style={{ textAlign:'center', padding:40 }}>
            <div style={{ color:'#475569', fontSize:14 }}>Sin sesiones registradas aún.</div>
          </div>
        ) : (
          <>
            {materias.map(mat => {
              const sesiones = historial.filter(h => h.materia === mat);
              const promedio = Math.round(sesiones.reduce((a,h) => a+h.pct,0) / sesiones.length);
              return (
                <div key={mat} className="card">
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                    <div>
                      <div style={{ fontFamily:'var(--font-mono)', color:'#93c5fd', fontSize:14 }}>{mat}</div>
                      <div style={{ color:'#475569', fontSize:11 }}>{sesiones.length} sesiones · promedio {promedio}%</div>
                    </div>
                    <div style={{ fontFamily:'var(--font-mono)', fontSize:28, fontWeight:700,
                      color: promedio>=75?'#34d399':promedio>=60?'#fbbf24':'#f87171' }}>
                      {promedio}%
                    </div>
                  </div>
                  <ProgressBar pct={promedio} />

                  <div style={{ marginTop:12 }}>
                    {sesiones.slice(0,8).map(h => (
                      <div key={h.id} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid #1e293b', fontSize:12 }}>
                        <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                          <span style={{ color:'#94a3b8', fontFamily:'var(--font-mono)' }}>
                            {h.parcial || 'todos'}
                          </span>
                          {h.modoBanco === 'demo' && (
                            <span style={{ color:'#d97706', fontSize:10, fontFamily:'var(--font-mono)' }}>DEMO</span>
                          )}
                          <span style={{ color:'#475569' }}>{h.correctas}/{h.total}</span>
                          <span style={{ color:'#334155', fontSize:11 }}>{h.fecha}</span>
                        </div>
                        <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, flexShrink:0,
                          color: h.pct>=75?'#34d399':h.pct>=60?'#fbbf24':'#f87171' }}>
                          {h.pct}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            <Btn variante="danger" onClick={limpiar}>
              {confirmLimpiar ? '¿CONFIRMAR BORRADO?' : '✕ LIMPIAR HISTORIAL'}
            </Btn>
          </>
        )}
      </div>
    </div>
  );
}
