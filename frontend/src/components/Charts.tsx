import { ResearchReport } from '../types';

interface ChartsProps {
  report: ResearchReport;
}

const financialKeys: { key: keyof ResearchReport['financialAnalysis']; label: string; icon: string; color: string }[] = [
  { key: 'revenueGrowth',  label: 'Revenue Growth',  icon: '📈', color: 'var(--electric)' },
  { key: 'profitability',  label: 'Profitability',   icon: '💰', color: 'var(--emerald)'  },
  { key: 'businessModel',  label: 'Business Model',  icon: '🏗️', color: 'var(--violet)'   },
  { key: 'marketPosition', label: 'Market Position', icon: '🎯', color: 'var(--gold)'     },
  { key: 'scalability',    label: 'Scalability',     icon: '🚀', color: '#f97316'         },
];

export const Charts = ({ report }: ChartsProps) => (
  <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
      <span style={{ fontSize: '1rem' }}>📊</span>
      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        Financial Breakdown
      </span>
    </div>

    {financialKeys.map(({ key, label, icon, color }, i) => {
      const value = report.financialAnalysis[key];
      return (
        <div key={key} style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '18px 20px',
          animation: `fade-up 0.4s ease ${i * 0.08}s both`,
          transition: 'border-color 0.2s, transform 0.2s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}33`; (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'translateX(0)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
              background: `${color}18`,
              border: `1px solid ${color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.9rem'
            }}>
              {icon}
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {label}
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginLeft: '42px' }}>
            {value || 'No data available for this metric.'}
          </p>
        </div>
      );
    })}
  </div>
);
