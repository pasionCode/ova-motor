/**
 * CONFIRMMODAL.JSX — OVA LEXUM
 *
 * Solo aparece cuando el usuario intenta cambiar de materia
 * durante un quiz activo (pantalla === 'quiz').
 *
 * Props:
 *   open             boolean
 *   materiaActual    string
 *   materiaPendiente string
 *   onConfirmar      () => void
 *   onCancelar       () => void
 */

import { Btn } from './UIComponents.jsx';

export default function ConfirmModal({ open, materiaActual, materiaPendiente, onConfirmar, onCancelar }) {
  if (!open) return null;

  // Detectar si es salida simple (sin cambio de materia)
  const esSalida = !materiaPendiente || materiaPendiente === '(salir)';

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:100,
      background:'rgba(5,10,20,0.88)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:20,
      backdropFilter:'blur(3px)',
    }}>
      <div style={{
        background:'#0f1e3d',
        border:'1px solid #dc2626',
        borderRadius:10,
        padding:28,
        maxWidth:420, width:'100%',
        boxShadow:'0 0 40px rgba(220,38,38,0.15)',
      }}>
        <div style={{ fontSize:32, marginBottom:12, color:'#fbbf24' }}>⚠</div>

        <div style={{ color:'#e2e8f0', fontSize:15, lineHeight:1.7, marginBottom:6, fontFamily:'var(--font-mono)', fontWeight:700 }}>
          {esSalida ? 'SALIR DEL QUIZ' : 'CAMBIAR DE MATERIA'}
        </div>

        <div style={{ color:'#94a3b8', fontSize:13, lineHeight:1.6, marginBottom:24 }}>
          {esSalida
            ? `Vas a salir del quiz de "${materiaActual}". El intento en curso no se guardará en el historial. ¿Deseas continuar?`
            : `Vas a salir del quiz de "${materiaActual}" y cambiar a "${materiaPendiente}". El intento en curso no se guardará. ¿Deseas continuar?`
          }
        </div>

        <div style={{ display:'flex', gap:10 }}>
          <Btn variante="ghost" onClick={onCancelar} style={{ flex:1 }}>
            CANCELAR
          </Btn>
          <Btn variante="danger" onClick={onConfirmar} style={{ flex:1 }}>
            {esSalida ? 'SALIR' : 'CAMBIAR MATERIA'}
          </Btn>
        </div>
      </div>
    </div>
  );
}
