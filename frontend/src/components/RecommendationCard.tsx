import { ResearchReport } from '../types';

interface RecommendationCardProps {
  report: ResearchReport;
}

const getBuyStyle = (d: string) => {
  const v = d.toLowerCase();
  if (v.includes('buy') || v.includes('accumulate')) {
    return { emoji: '📈', label: 'BUY / ACCUMULATE', color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)', glowColor: 'rgba(52,211,153,0.3)' };
  }
  if (v.includes('sell') || v.includes('reduce')) {
    return { emoji: '📉', label: 'SELL / REDUCE', color: '#fb7185', bg: 'rgba(251,113,133,0.08)', border: 'rgba(251,113,133,0.2)', glowColor: 'rgba(251,113,133,0.3)' };
  }
  return { emoji: '⏸', label: 'HOLD', color: '#f0b429', bg: 'rgba(240,180,41,0.08)', border: 'rgba(240,180,41,0.2)', glowColor: 'rgba(240,180,41,0.3)' };
};

export const RecommendationCard = ({ report }: RecommendationCardProps) => {
  const style = getBuyStyle(report.investmentDecision);

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Decision hero */}
      <div style={{
        background: style.bg, border: `1px solid ${style.border}`,
        borderRadius: '20px', padding: '28px',
        boxShadow: `0 0 60px -20px ${style.glowColor}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: `${style.bg}`, border: `1px solid ${style.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem'
          }}>
            {style.emoji}
          </div>
          <div>
            <div className="section-label" style={{ marginBottom: '4px' }}>Final Investment Decision</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: style.color, letterSpacing: '-0.02em' }}>
              {report.investmentDecision}
            </div>
          </div>
        </div>

        {/* Confidence */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Confidence Score</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: style.color }}>{report.confidenceScore}%</span>
          </div>
          <div className="confidence-bar-track">
            <div className="confidence-bar-fill" style={{ width: `${report.confidenceScore}%`, background: `linear-gradient(90deg, ${style.color}, ${style.color}88)` }} />
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <span style={{ fontSize: '1rem' }}>🧠</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Investment Thesis</span>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          {report.reasoning}
        </p>
      </div>

      {/* Summary */}
      <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <span style={{ fontSize: '1rem' }}>📋</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Executive Summary</span>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          {report.summary}
        </p>
      </div>

      {/* Disclaimer */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '10px',
        background: 'rgba(240,180,41,0.05)', border: '1px solid rgba(240,180,41,0.12)',
        borderRadius: '12px', padding: '14px 16px'
      }}>
        <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>⚠️</span>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          This analysis is AI-generated for informational purposes only. It does not constitute financial advice. Always do your own due diligence before investing.
        </p>
      </div>
    </div>
  );
};
