/**
 * APP.JSX — MOTOR MAESTRO OVA · LEXUM
 *
 * Responsabilidades únicas:
 *   - materia activa
 *   - pantalla activa
 *   - modoBancoActivo (full | demo)
 *   - banco cargado
 *   - sesión en curso
 *   - resultados
 *   - navegación global
 *   - cambio de materia con confirmación durante quiz
 *
 * Para agregar una materia:
 *   1. Coloca los JSON en /public/bancos/
 *   2. Agrega la entrada en MATERIAS_DISPONIBLES
 */

import { useState, useEffect } from 'react';
import { initAuth, cerrarSesion, usuarioActual } from './auth.js';
import Login from './components/screens/Login.jsx';
import './styles/theme.css';

import Inicio       from './components/screens/Inicio.jsx';
import Config       from './components/screens/Config.jsx';
import Quiz         from './components/screens/Quiz.jsx';
import Resultado    from './components/screens/Resultado.jsx';
import Historial    from './components/screens/Historial.jsx';
import ConfirmModal from './components/ui/ConfirmModal.jsx';

import { seleccionarPreguntas } from './engine/questionSelector.js';
import { obtenerIdsConError }   from './storage/persistence.js';

// ── MATERIAS ─────────────────────────────────────────────────
const MATERIAS_DISPONIBLES = [
  {
    id: 'criminalistica',
    nombre: 'Criminalística I',
    semestre: 'I Semestre',
    docente: 'Carlos Augusto Jaramillo G.',
    bancos: {
      full: [
        '/bancos/criminalistica-banco-unificado.json',
      ],
      demo: [
        '/bancos/criminalistica-p1.demo.json',
      ],
    },
  },
];

// ── HOOK useBanco ─────────────────────────────────────────────
// Carga todos los JSON del modo elegido para la materia.
// No filtra por parcial — eso lo hace seleccionarPreguntas.
// Escala a P3/P4 sin tocar el hook.
function useBanco(materia, modoBanco) {
  const [banco,    setBanco]    = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    if (!materia) return;
    const urls = materia.bancos?.[modoBanco] || [];
    if (urls.length === 0) {
      setError(`No hay bancos "${modoBanco}" para esta materia.`);
      setBanco([]);
      return;
    }
    setCargando(true);
    setError(null);
    setBanco([]);

    Promise.all(
      urls.map(url =>
        fetch(url)
          .then(r => { if (!r.ok) throw new Error(`No encontrado: ${url}`); return r.json(); })
          .then(d => d.preguntas || [])
      )
    )
      .then(arr => setBanco(arr.flat()))
      .catch(e  => setError(e.message))
      .finally(() => setCargando(false));

  }, [materia?.id, modoBanco]);

  return { banco, cargando, error };
}

// ── SESIÓN VACÍA ──────────────────────────────────────────────
// ── AUTH ─────────────────────────────────────────────────────
function useAuth() {
  const [usuario, setUsuario] = useState(() => usuarioActual());
  useEffect(() => {
    initAuth({
      onLogin:  user => setUsuario(user),
      onLogout: ()   => setUsuario(null),
    });
  }, []);
  return { usuario };
}

const SESION_VACIA = {
  preguntas:   [],
  resultados:  [],
  duracion:    0,
  parcial:     null,
  modoBanco:   'full',
  modoRepaso:  false,
};

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────
export default function App() {
  const { usuario } = useAuth();
  if (!usuario) return <Login />;

  const [pantalla,        setPantalla]        = useState('inicio');
  const [materiaActiva,   setMateriaActiva]   = useState(MATERIAS_DISPONIBLES[0]);
  const [modoBancoActivo, setModoBancoActivo] = useState('full');
  const [sesion,          setSesion]          = useState(SESION_VACIA);

  // Modal cambio de materia durante quiz
  const [modalAbierto,    setModalAbierto]    = useState(false);
  const [materiaPendiente,setMateriaPendiente]= useState(null);

  const { banco, cargando, error } = useBanco(materiaActiva, modoBancoActivo);

  // ── Cambio de materia ───────────────────────────────────────
  function aplicarCambioMateria(nuevaMateria) {
    setMateriaActiva(nuevaMateria);
    setModoBancoActivo('full');
    setSesion(SESION_VACIA);
    setPantalla('inicio');
    setModalAbierto(false);
    setMateriaPendiente(null);
  }

  function solicitarCambioMateria(nuevaMateria) {
    if (nuevaMateria.id === materiaActiva?.id) return;
    if (pantalla === 'quiz') {
      setMateriaPendiente(nuevaMateria);
      setModalAbierto(true);
    } else {
      aplicarCambioMateria(nuevaMateria);
    }
  }

  function confirmarCambioMateria() {
    if (!materiaPendiente) return;
    if (materiaPendiente.id === '__exit__') {
      // Solo salir del quiz, sin cambiar materia
      setSesion(SESION_VACIA);
      setPantalla('inicio');
      setModalAbierto(false);
      setMateriaPendiente(null);
    } else {
      aplicarCambioMateria(materiaPendiente);
    }
  }

  function cancelarCambioMateria() {
    setModalAbierto(false);
    setMateriaPendiente(null);
  }

  // ── Cambio de modo banco (viene de Config) ──────────────────
  // Config llama esto cuando el usuario cambia el toggle demo/full.
  // App actualiza modoBancoActivo → useBanco recarga → Config espera.
  function cambiarModoBanco(modo) {
    setModoBancoActivo(modo);
  }

  // ── Navegación ──────────────────────────────────────────────
  function irAInicio() {
    setSesion(SESION_VACIA);
    setPantalla('inicio');
  }

  function irAConfig(modoRepaso = false) {
    setSesion({ ...SESION_VACIA, modoRepaso });
    setPantalla('config');
  }

  // iniciarQuiz usa el banco ya cargado en memoria.
  // El botón "Iniciar" en Config está bloqueado mientras cargando === true
  // o modoBancoActivo !== filtros.modoBanco, así que aquí el banco
  // siempre corresponde al modo elegido.
  function iniciarQuiz(filtros) {
    const idsRepaso = filtros.modoRepaso
      ? obtenerIdsConError(materiaActiva?.nombre)
      : null;

    const seleccionadas = seleccionarPreguntas(banco, {
      parcial:   filtros.parcial,
      temas:     filtros.temas,
      tipo:      filtros.tipo,
      cantidad:  filtros.cantidad,
      idsRepaso,
    });

    if (seleccionadas.length === 0) {
      alert('Sin preguntas con esos filtros. Ajusta la configuración.');
      return;
    }

    setSesion({
      preguntas:  seleccionadas,
      resultados: [],
      duracion:   0,
      parcial:    filtros.parcial,
      modoBanco:  filtros.modoBanco,
      modoRepaso: filtros.modoRepaso || false,
    });
    setPantalla('quiz');
  }

  function finalizarQuiz(resultados, duracion) {
    setSesion(prev => ({ ...prev, resultados, duracion }));
    setPantalla('resultado');
  }

  // ── Render carga/error ──────────────────────────────────────
  if (error && pantalla !== 'historial') return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      minHeight:'100vh', background:'#0a0e1a', color:'#f87171', fontFamily:'var(--font-mono)',
      fontSize:13, padding:24, textAlign:'center', gap:8 }}>
      <div style={{ fontSize:36 }}>⚠</div>
      <div>Error al cargar el banco</div>
      <div style={{ color:'#94a3b8' }}>{error}</div>
      <div style={{ color:'#94a3b8', fontSize:11, marginTop:8 }}>
        Verifica que los JSON estén en /public/bancos/
      </div>
    </div>
  );

  // ── Barra superior ──────────────────────────────────────────
  // Visible en todas las pantallas, incluido quiz (compacta).
  // En quiz muestra solo materia y botón salir, para que el
  // modal tenga sentido funcional.
  const esQuiz = pantalla === 'quiz';

  return (
    <>
      {/* Modal — solo durante quiz */}
      {modalAbierto && (
        <ConfirmModal
          open={modalAbierto}
          materiaActual={materiaActiva?.nombre}
          materiaPendiente={materiaPendiente?.nombre}
          onConfirmar={confirmarCambioMateria}
          onCancelar={cancelarCambioMateria}
        />
      )}

      {/* Barra de navegación */}
      <nav style={{
        background: '#050a14',
        borderBottom: '1px solid #1e293b',
        padding: esQuiz ? '6px 16px' : '8px 16px',
        display: 'flex',
        gap: 6,
        alignItems: 'center',
        overflowX: 'auto',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}>
        {esQuiz ? (
          // Barra compacta durante quiz
          <>
            <span style={{ color:'#94a3b8', fontSize:11, fontFamily:'var(--font-mono)' }}>
              QUIZ ACTIVO:
            </span>
            <span style={{ color:'#93c5fd', fontSize:12, fontFamily:'var(--font-mono)', fontWeight:700 }}>
              {materiaActiva?.nombre}
            </span>
            <div style={{ flex:1 }} />
            {/* Selector de materia compacto */}
            {MATERIAS_DISPONIBLES.length > 1 && MATERIAS_DISPONIBLES.map(m => (
              <button key={m.id}
                onClick={() => solicitarCambioMateria(m)}
                style={{
                  background: materiaActiva?.id===m.id ? '#1e3a5f':'transparent',
                  color: materiaActiva?.id===m.id ? '#93c5fd':'#94a3b8',
                  border:`1px solid ${materiaActiva?.id===m.id ? '#1e40af':'transparent'}`,
                  padding:'4px 10px', borderRadius:4, fontSize:11,
                  fontFamily:'var(--font-mono)', whiteSpace:'nowrap',
                }}>
                {m.nombre}
              </button>
            ))}
            {/* Botón salir del quiz */}
            <button
              onClick={() => { setMateriaPendiente({ id:'__exit__', nombre:'(salir)' }); setModalAbierto(true); }}
              style={{ background:'#450a0a', color:'#fca5a5', border:'1px solid #dc2626',
                padding:'4px 12px', borderRadius:4, fontSize:11, fontFamily:'var(--font-mono)',
                marginLeft:4, cursor:'pointer' }}>
              ✕ SALIR
            </button>
          </>
        ) : (
          // Barra completa fuera del quiz
          <>
            <span style={{ color:'#94a3b8', fontSize:11, fontFamily:'var(--font-mono)', marginRight:4, whiteSpace:'nowrap' }}>
              MATERIA:
            </span>
            {MATERIAS_DISPONIBLES.map(m => (
              <button key={m.id}
                onClick={() => solicitarCambioMateria(m)}
                style={{
                  background: materiaActiva?.id===m.id ? '#1e3a5f':'transparent',
                  color: materiaActiva?.id===m.id ? '#93c5fd':'#94a3b8',
                  border:`1px solid ${materiaActiva?.id===m.id ? '#1e40af':'transparent'}`,
                  padding:'5px 12px', borderRadius:4, fontSize:12,
                  whiteSpace:'nowrap', fontFamily:'var(--font-mono)',
                }}>
                {m.nombre}
              </button>
            ))}
            <div style={{ width:1, height:18, background:'#1e293b', margin:'0 6px', flexShrink:0 }} />
            <button
              onClick={() => setPantalla(p => p==='historial' ? 'inicio' : 'historial')}
              style={{
                background: pantalla==='historial' ? '#1e3a5f':'transparent',
                color: pantalla==='historial' ? '#93c5fd':'#94a3b8',
                border:`1px solid ${pantalla==='historial' ? '#1e40af':'transparent'}`,
                padding:'5px 12px', borderRadius:4, fontSize:12,
                fontFamily:'var(--font-mono)', marginLeft:'auto', flexShrink:0,
              }}>
              HISTORIAL
            </button>
          </>
        )}
      </nav>

      {/* ── Pantallas ──────────────────────────────────────── */}
      {pantalla === 'inicio' && (
        <Inicio
          materia={materiaActiva}
          banco={banco}
          cargando={cargando}
          onIniciar={() => irAConfig(false)}
          onRepaso={() => irAConfig(true)}
        />
      )}

      {pantalla === 'config' && (
        <Config
          materia={materiaActiva}
          banco={banco}
          modoBancoActivo={modoBancoActivo}
          cargandoBanco={cargando}
          modoRepaso={sesion.modoRepaso}
          idsRepaso={obtenerIdsConError(materiaActiva?.nombre)}
          onCambiarModoBanco={cambiarModoBanco}
          onIniciarQuiz={iniciarQuiz}
          onVolver={irAInicio}
        />
      )}

      {pantalla === 'quiz' && (
        <Quiz
          preguntas={sesion.preguntas}
          materia={materiaActiva?.nombre}
          parcial={sesion.parcial}
          modoBanco={sesion.modoBanco}
          onFinalizar={finalizarQuiz}
        />
      )}

      {pantalla === 'resultado' && (
        <Resultado
          resultados={sesion.resultados}
          materia={materiaActiva?.nombre}
          parcial={sesion.parcial}
          modoBanco={sesion.modoBanco}
          duracion={sesion.duracion}
          onNueva={() => irAConfig(false)}
          onRepaso={() => irAConfig(true)}
          onInicio={irAInicio}
        />
      )}

      {pantalla === 'historial' && (
        <Historial onVolver={irAInicio} />
      )}
    </>
  );
}
