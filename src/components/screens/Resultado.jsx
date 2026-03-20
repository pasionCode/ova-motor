/**
 * RESULTADO.JSX — OVA LEXUM
 * Resumen de sesión con desglose por tema y acciones post-evaluación.
 */

import { useEffect, useRef } from 'react';
import { Header, Btn, ProgressBar } from '../ui/UIComponents.jsx';
import { calcularResumen, calcularPorTema } from '../../engine/scoring.js';
import { guardarSesion } from '../../storage/persistence.js';

export default function Resultado({ resultados, materia, parcial, modoBanco, duracion, onNueva, onRepaso, onInicio }) {
  const guardadoRef = useRef(false);
  const resumen  = calcularResumen(resultados);
  const porTema  = calcularPorTema(resultados);
  const falladas = resultados.filter(r => !r.correcto).length;

  useEffect(() => {
    if (!guardadoRef.current && resultados.length > 0) {
      guardadoRef.current = true;
      guardarSesion({
        materia,
        parcial:   parcial || 'todos',
        modoBanco: modoBanco || 'full',
        total:     resumen.total,
        correctas: resumen.correctas,
        temas:     porTema.map(t => t.tema),
        duracion,
      });
    }
  }, []);

  return (
    <div className="screen">
      <Header titulo="RESULTADO" subtitulo={`${materia} · ${parcial || 'todos'}${modoBanco==='demo' ? ' · DEMO' : ''}`} />
      <div className="container">

        <div className="card" style={{ textAlign:'center', borderColor: resumen.nivel.color }}>
          <div style={{ fontSize:72, fontWeight:700, color:resumen.nivel.color, fontFamily:'var(--font-mono)', lineHeight:1 }}>
            {resumen.pct}%
          </div>
          <div style={{ color:resumen.nivel.color, letterSpacing:3, fontSize:14, fontFamily:'var(--font-mono)', marginTop:4 }}>
            {resumen.nivel.label}
          </div>
          <div style={{ color:'#475569', fontSize:13, marginTop:6 }}>
            {resumen.correctas} de {resumen.total} correctas
            {duracion ? ` · ${Math.floor(duracion/60)}m ${duracion%60}s` : ''}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginTop:16 }}>
            {[[resumen.correctas,'CORRECTAS','#34d399'],
              [resumen.total-resumen.correctas,'INCORRECTAS','#f87171'],
              [`${resumen.pct}%`,'PUNTUACIÓN',resumen.nivel.color]
            ].map(([n,label,color]) => (
              <div key={label} style={{ background:'#0a1929', border:'1px solid #1e3a5f', borderRadius:6, padding:12 }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:26, fontWeight:700, color }}>{n}</div>
                <div style={{ fontSize:10, color:'#475569', letterSpacing:1 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Desglose por tema */}
        {porTema.length > 0 && (
          <div className="card">
            <div style={{ color:'#64748b', fontSize:11, letterSpacing:1, marginBottom:12, fontFamily:'var(--font-mono)' }}>
              RENDIMIENTO POR TEMA
            </div>
            {porTema.map(t => (
              <div key={t.tema} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4 }}>
                  <span style={{ color:'#94a3b8' }}>{t.tema}</span>
                  <span style={{ fontFamily:'var(--font-mono)', color: t.pct<60?'#f87171':t.pct<80?'#fbbf24':'#34d399' }}>
                    {t.pct}% ({t.correcto}/{t.total})
                  </span>
                </div>
                <ProgressBar pct={t.pct} />
              </div>
            ))}
          </div>
        )}

        {/* Preguntas falladas */}
        {falladas > 0 && (
          <div className="card" style={{ borderColor:'#7f1d1d' }}>
            <div style={{ color:'#fca5a5', fontSize:12, marginBottom:12, fontFamily:'var(--font-mono)' }}>
              ✗ {falladas} PREGUNTA{falladas>1?'S':''} INCORRECTA{falladas>1?'S':''}
            </div>
            {resultados.filter(r => !r.correcto).map(r => (
              <div key={r.pregunta.id} style={{ background:'#0a1929', border:'1px solid #1e3a5f', borderRadius:6, padding:'10px 12px', marginBottom:8, fontSize:12 }}>
                <div style={{ color:'#64748b', fontFamily:'var(--font-mono)', fontSize:11, marginBottom:4 }}>
                  #{r.pregunta.id} · {r.pregunta.tema} · {r.pregunta.parcial}
                </div>
                <div style={{ color:'#94a3b8', lineHeight:1.5 }}>
                  {r.pregunta.pregunta?.substring(0,120)}…
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <Btn onClick={onNueva} style={{ flex:1 }}>▶ NUEVA EVALUACIÓN</Btn>
          {falladas > 0 && <Btn variante="warn" onClick={onRepaso}>⟳ REPASAR ERRORES</Btn>}
          <Btn variante="ghost" onClick={onInicio}>◈ INICIO</Btn>
        </div>

      </div>
    </div>
  );
}
