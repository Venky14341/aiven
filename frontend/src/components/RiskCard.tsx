interface RiskCardProps {
  title: string;
  items: string[];
}

export const RiskCard = ({ title, items }: RiskCardProps) => (
  <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px',
        background: 'rgba(251,113,133,0.12)', border: '1px solid rgba(251,113,133,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.1rem'
      }}>⚡</div>
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{items.length} risk signals identified</p>
      </div>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {items.map((item, i) => (
        <div key={item} className="animate-fade-up" style={{
          display: 'flex', alignItems: 'flex-start', gap: '14px',
          background: 'rgba(251,113,133,0.05)', border: '1px solid rgba(251,113,133,0.12)',
          borderRadius: '12px', padding: '14px 16px',
          animation: `fade-up 0.35s ease ${i * 0.06}s both`
        }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '6px', flexShrink: 0,
            background: 'rgba(251,113,133,0.15)', border: '1px solid rgba(251,113,133,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', fontWeight: 700, color: 'var(--rose)'
          }}>
            {String(i + 1).padStart(2, '0')}
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{item}</p>
        </div>
      ))}
    </div>
  </div>
);
