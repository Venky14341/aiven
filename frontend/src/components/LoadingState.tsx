export const LoadingState = () => (
  <div className="animate-fade-in" style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: '28px', padding: '64px 32px',
    background: 'var(--surface-1)', border: '1px solid var(--border)',
    borderRadius: '24px', textAlign: 'center'
  }}>
    {/* Orbital loader */}
    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
      {/* Outer ring */}
      <div className="orbit-ring" style={{
        position: 'absolute', inset: 0,
        borderTopColor: 'rgba(0, 212, 255, 0.5)',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        borderWidth: '2px',
        borderStyle: 'solid',
        animation: 'spin-slow 1.2s linear infinite'
      }} />
      {/* Inner ring */}
      <div className="orbit-ring-2" style={{
        position: 'absolute', inset: '12px',
        borderTopColor: 'transparent',
        borderRightColor: 'rgba(167, 139, 250, 0.6)',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        borderWidth: '2px',
        borderStyle: 'solid',
        animation: 'spin-slow 0.9s linear infinite reverse'
      }} />
      {/* Core dot */}
      <div style={{
        position: 'absolute', inset: '28px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--electric), var(--violet))',
        animation: 'pulse-glow 1.5s ease-in-out infinite'
      }} />
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        Researching company...
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '320px', lineHeight: 1.6 }}>
        Our AI agent is gathering financials, market sentiment, competitive analysis, and risk signals.
      </p>
    </div>

    {/* Steps */}
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
      {['Company Profile', 'Financials', 'Sentiment', 'Risk Analysis', 'Decision'].map((step, i) => (
        <div key={step} className={`badge badge-electric animate-fade-up delay-${(i + 1) * 100}`}
          style={{ animation: `fade-up 0.4s ease ${i * 0.15}s both` }}
        >
          <span style={{
            width: '5px', height: '5px', borderRadius: '50%',
            background: 'var(--electric)', display: 'inline-block',
            animation: `pulse-glow ${1 + i * 0.2}s ease-in-out infinite`
          }} />
          {step}
        </div>
      ))}
    </div>
  </div>
);
