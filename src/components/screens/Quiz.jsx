/**
 * QUIZ.JSX — OVA LEXUM
 * Motor de evaluación. Maneja MC, TF, CD, CC.
 * Registra aciertos/errores en persistencia.
 */

import { useState, useEffect, useRef } from 'react';
import { Header, Badge, ProgressBar, Btn } from '../ui/UIComponents.jsx';
import { esCorrecta } from '../../engine/questionSelector.js';
import { registrarError, registrarAcierto, actualizarTemasDebiles } from '../../storage/persistence.js';

export default function Quiz({ preguntas, materia, parcial, modoBanco, onFinalizar }) {
  const [indice,        setIndice]        = useState(0);
  const [opcion,        setOpcion]        = useState(null);
  const [respuestaTexto,setTexto]         = useState('');
  const [mostrarRetro,  setMostrarRetro]  = useState(false);
  const [resultados,    setResultados]    = useState([]);
  const inicioRef   = useRef(Date.now());
  const textareaRef = useRef(null);

  const pregunta = preguntas[indice];
  const progresoPct = (indice / preguntas.length) * 100;

  useEffect(() => {
    if ((pregunta?.tipo === 'CC' || pregunta?.tipo === 'CD') && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [indice, pregunta?.tipo]);

  function verificar() {
    const respuesta = pregunta.tipo === 'MC' ? opcion : respuestaTexto;
    const correcto  = esCorrecta(pregunta, respuesta);

    if (correcto) registrarAcierto(pregunta, materia);
    else          registrarError(pregunta, materia);

    actualizarTemasDebiles({ materia, parcial, tema: pregunta.tema, correcto });
    setResultados(prev => [...prev, { pregunta, correcto, respuesta }]);
    setMostrarRetro(true);
  }

  function siguiente() {
    if (indice + 1 >= preguntas.length) {
      const duracion = Math.round((Date.now() - inicioRef.current) / 1000);
      onFinalizar(resultados, duracion);
    } else {
      setIndice(i => i + 1);
      setOpcion(null);
      setTexto('');
      setMostrarRetro(false);
    }
  }

  const correcto = resultados[resultados.length - 1]?.correcto;

  const sOp = (sel, i) => ({
    background: sel===i ? '#1e3a5f' : '#0a1929',
    border: `1px solid ${sel===i ? '#60a5fa' : '#1e3a5f'}`,
    color:'#e2e8f0', padding:'12px 16px', borderRadius:6, cursor:'pointer',
    marginBottom:8, width:'100%', textAlign:'left', fontSize:14,
    fontFamily:'var(--font-body)', lineHeight:1.5, transition:'all 0.15s',
  });
  const sOk  = { background:'#064e3b', border:'1px solid #059669', color:'#6ee7b7', padding:'12px 16px', borderRadius:6, marginBottom:8, width:'100%', textAlign:'left', fontSize:14 };
  const sErr = { background:'#450a0a', border:'1px solid #dc2626', color:'#fca5a5', padding:'12px 16px', borderRadius:6, marginBottom:8, width:'100%', textAlign:'left', fontSize:14 };

  if (!pregunta) return null;

  return (
    <div className="screen">
      <Header
        titulo={materia}
        subtitulo={`${parcial || ''} · ${modoBanco === 'demo' ? 'DEMO · ' : ''}Pregunta ${indice+1} de ${preguntas.length}`}
      >
        <span style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'#60a5fa' }}>
          {resultados.filter(r=>r.correcto).length} ✓
        </span>
      </Header>

      <div style={{ padding:'8px 20px', background:'#0a1929', borderBottom:'1px solid #1e293b' }}>
        <ProgressBar pct={progresoPct} color="#1e40af" height={4} />
      </div>

      <div className="container">
        <div className="card">
          {/* Número de control — sale del campo id del JSON, no del índice del arreglo */}
          <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'#94a3b8',
            letterSpacing:'1px', marginBottom:8 }}>
            #{pregunta.id}
          </div>

          <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:14, flexWrap:'wrap' }}>
            <Badge tipo={pregunta.tipo} />
            <span style={{ color:'#94a3b8', fontSize:11 }}>{pregunta.tema}</span>
          </div>

          <div style={{ fontSize:15, lineHeight:1.7, whiteSpace:'pre-line', marginBottom:20, color:'#e2e8f0' }}>
            {pregunta.pregunta}
          </div>

          {/* MC */}
          {pregunta.tipo==='MC' && !mostrarRetro && pregunta.opciones?.map((op,i) => (
            <button key={i} style={sOp(opcion,i)} onClick={() => setOpcion(i)}>
              <span style={{ color:'#94a3b8', marginRight:8 }}>{String.fromCharCode(65+i)})</span>{op}
            </button>
          ))}
          {pregunta.tipo==='MC' && mostrarRetro && pregunta.opciones?.map((op,i) => {
            const esC = i===pregunta.respuesta, esS = i===opcion;
            return <div key={i} style={esC ? sOk : (esS&&!esC) ? sErr : {...sOp(null,null),cursor:'default'}}>
              <span style={{marginRight:8}}>{esC?'✓':esS?'✗':`${String.fromCharCode(65+i)})`}</span>{op}
            </div>;
          })}

          {/* TF */}
          {pregunta.tipo==='TF' && !mostrarRetro && (
            <div style={{ display:'flex', gap:12 }}>
              {['VERDADERO','FALSO'].map(v => (
                <button key={v}
                  style={{ ...(respuestaTexto===v ? {background:'#1e40af',color:'#e2e8f0'} : {background:'#0a1929',color:'#94a3b8',border:'1px solid #1e3a5f'}), flex:1, padding:14, borderRadius:6, fontSize:14, fontFamily:'var(--font-mono)' }}
                  onClick={() => setTexto(v)}>
                  {v==='VERDADERO' ? '✓ VERDADERO' : '✗ FALSO'}
                </button>
              ))}
            </div>
          )}
          {pregunta.tipo==='TF' && mostrarRetro && (
            <div style={{ display:'flex', gap:12 }}>
              {['VERDADERO','FALSO'].map(v => {
                const esC = (v==='VERDADERO'&&pregunta.respuesta===true)||(v==='FALSO'&&pregunta.respuesta===false);
                const esS = respuestaTexto===v;
                return <div key={v} style={{ flex:1, padding:14, borderRadius:6, textAlign:'center', fontSize:14, fontFamily:'var(--font-mono)',
                  background: esC?'#064e3b':(esS&&!esC)?'#450a0a':'#0a1929',
                  border:`1px solid ${esC?'#059669':(esS&&!esC)?'#dc2626':'#1e3a5f'}`,
                  color: esC?'#6ee7b7':(esS&&!esC)?'#fca5a5':'#94a3b8' }}>{v}</div>;
              })}
            </div>
          )}

          {/* CC / CD */}
          {(pregunta.tipo==='CC'||pregunta.tipo==='CD') && !mostrarRetro && (
            <textarea ref={textareaRef} value={respuestaTexto}
              onChange={e => setTexto(e.target.value)}
              placeholder={pregunta.tipo==='CC' ? 'Desarrolle su respuesta…' : 'Complete aquí…'}
              style={{ height: pregunta.tipo==='CC' ? 110 : 60, resize:'vertical' }} />
          )}

          {/* Retroalimentación */}
          {mostrarRetro && (
            <div style={{ background: correcto?'#064e3b':'#450a0a', border:`1px solid ${correcto?'#059669':'#dc2626'}`, borderRadius:6, padding:16, marginTop:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <div style={{ fontWeight:700, color:correcto?'#6ee7b7':'#fca5a5', fontFamily:'var(--font-mono)' }}>
                  {correcto ? '✓ CORRECTO' : '✗ INCORRECTO'}
                </div>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'#94a3b8' }}>
                  #{pregunta.id}
                </span>
              </div>
              {!correcto && pregunta.tipo!=='MC' && pregunta.palabrasClave?.length > 0 && (
                <div style={{ color:'#94a3b8', fontSize:12, marginBottom:8 }}>
                  Palabras clave: <span style={{ color:'#fbbf24' }}>{pregunta.palabrasClave.join(' · ')}</span>
                </div>
              )}
              <div style={{ fontSize:13, lineHeight:1.6, color:'#cbd5e1' }}>{pregunta.explicacion}</div>
            </div>
          )}

          <div style={{ display:'flex', gap:12, marginTop:20 }}>
            {!mostrarRetro && (
              <Btn variante="success" onClick={verificar}
                disabled={
                  (pregunta.tipo==='MC' && opcion===null) ||
                  ((pregunta.tipo==='TF'||pregunta.tipo==='CD'||pregunta.tipo==='CC') && !respuestaTexto.trim())
                }>
                VERIFICAR
              </Btn>
            )}
            {mostrarRetro && (
              <Btn onClick={siguiente}>
                {indice+1 >= preguntas.length ? 'VER RESULTADOS →' : 'SIGUIENTE →'}
              </Btn>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
