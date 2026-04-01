/**
 * COMPONENTES UI REUTILIZABLES — OVA LEXUM
 * Badge, ProgressBar, Header
 */

// ── Badge ────────────────────────────────────────────────────

const TIPO_COLORES = {
  MC: { bg: '#1e3a5f', col: '#93c5fd' },
  TF: { bg: '#14532d', col: '#86efac' },
  CC: { bg: '#431407', col: '#fdba74' },
  CD: { bg: '#2e1065', col: '#c4b5fd' },
};

const TIPO_LABEL = {
  MC: 'SELECCIÓN MÚLTIPLE',
  TF: 'FALSO / VERDADERO',
  CC: 'CASO CLÍNICO',
  CD: 'COMPLETAR DEFINICIÓN',
};

export function Badge({ tipo, children }) {
  const colores = TIPO_COLORES[tipo] || { bg: '#1e293b', col: '#94a3b8' };
  return (
    <span style={{
      display: 'inline-block',
      background: colores.bg,
      color: colores.col,
      padding: '2px 10px',
      borderRadius: 4,
      fontSize: 11,
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.5px',
    }}>
      {children || TIPO_LABEL[tipo] || tipo}
    </span>
  );
}

// ── ProgressBar ───────────────────────────────────────────────

export function ProgressBar({ pct, color, height = 5 }) {
  const bg = color || (
    pct >= 80 ? '#059669' :
    pct >= 60 ? '#d97706' : '#dc2626'
  );
  return (
    <div style={{ background: '#1e293b', borderRadius: 4, height, overflow: 'hidden' }}>
      <div style={{
        background: bg, height, borderRadius: 4,
        width: `${Math.min(pct, 100)}%`,
        transition: 'width 0.4s ease',
      }} />
    </div>
  );
}

// ── Header ────────────────────────────────────────────────────

export function Header({ titulo, subtitulo, onVolver, children }) {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #0f1e3d 0%, #1a2f5a 60%, #0a1929 100%)',
      borderBottom: '1px solid #1e40af',
      padding: '14px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      {onVolver && (
        <button
          onClick={onVolver}
          style={{ background: 'none', color: '#60a5fa', fontSize: 18, border: 'none', padding: '0 8px 0 0' }}
          title="Volver"
        >
          ←
        </button>
      )}
      <div style={{ flex: 1 }}>
        {titulo && (
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: 17,
            color: '#60a5fa',
            letterSpacing: '1.5px',
          }}>
            ◈ {titulo}
          </div>
        )}
        {subtitulo && (
          <div style={{ color: '#cbd5e1', fontSize: 11, letterSpacing: '1px', marginTop: 2 }}>
            {subtitulo}
          </div>
        )}
      </div>
      {children}
    </header>
  );
}

// ── StatusDot ─────────────────────────────────────────────────

export function StatusDot({ activo, label }) {
  return (
    <span style={{
      background: activo ? '#064e3b' : '#1e293b',
      color: activo ? '#6ee7b7' : '#94a3b8',
      border: `1px solid ${activo ? '#059669' : '#94a3b8'}`,
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: 11,
      fontFamily: 'var(--font-mono)',
    }}>
      {activo ? '●' : '○'} {label}
    </span>
  );
}

// ── Btn ───────────────────────────────────────────────────────

const BTN_VARIANTES = {
  primary: { background: '#1e40af', color: '#e2e8f0' },
  success: { background: '#065f46', color: '#6ee7b7', border: '1px solid #059669' },
  danger:  { background: '#7f1d1d', color: '#fca5a5', border: '1px solid #dc2626' },
  ghost:   { background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' },
  warn:    { background: '#451a03', color: '#fbbf24', border: '1px solid #d97706' },
};

export function Btn({ variante = 'primary', onClick, disabled, children, full, style = {} }) {
  const v = BTN_VARIANTES[variante] || BTN_VARIANTES.primary;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...v,
        padding: '10px 18px',
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        letterSpacing: '0.5px',
        width: full ? '100%' : undefined,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
