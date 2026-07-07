import { ResearchReport } from '../types';

interface CompanyCardProps {
  report: ResearchReport;
}

const IMAGES = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1400&q=85',
];

const getImage = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return IMAGES[Math.abs(hash) % IMAGES.length];
};

const decisionColor = (d: string) => {
  const v = d.toLowerCase();
  if (v.includes('buy') || v.includes('accumulate')) return { bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.25)', color: '#34d399' };
  if (v.includes('sell') || v.includes('reduce')) return { bg: 'rgba(251,113,133,0.12)', border: 'rgba(251,113,133,0.25)', color: '#fb7185' };
  return { bg: 'rgba(240,180,41,0.12)', border: 'rgba(240,180,41,0.25)', color: '#f0b429' };
};

export const CompanyCard = ({ report }: CompanyCardProps) => {
  const imgUrl = getImage(report.companyName);
  const dc = decisionColor(report.investmentDecision);
  const initials = report.companyName.slice(0, 2).toUpperCase();

  return (
    <div className="animate-fade-up glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
      {/* Hero image */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img
          src={imgUrl}
          alt={`${report.companyName} office`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
          onMouseEnter={e => ((e.target as HTMLImageElement).style.transform = 'scale(1.04)')}
          onMouseLeave={e => ((e.target as HTMLImageElement).style.transform = 'scale(1)')}
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(2,3,15,0.96) 0%, rgba(2,3,15,0.4) 50%, rgba(2,3,15,0.1) 100%)'
        }} />

        {/* Floating industry badge */}
        <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
          <span className="badge badge-gold" style={{ backdropFilter: 'blur(12px)', background: 'rgba(240,180,41,0.15)' }}>
            {report.industry || 'Technology'}
          </span>
        </div>

        {/* Company name overlay */}
        <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px', display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
          {/* Avatar */}
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--electric), var(--violet))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', fontWeight: 800, color: '#fff',
            border: '2px solid rgba(255,255,255,0.15)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
          }}>
            {initials}
          </div>
          <div>
            <h2 className="font-display" style={{ fontSize: '1.8rem', color: '#fff', lineHeight: 1.1, textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
              {report.companyName.toUpperCase()}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>AI Investment Report</p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
        {/* Decision */}
        <div className="stat-card" style={{ background: dc.bg, borderColor: dc.border }}>
          <div className="section-label" style={{ marginBottom: '8px' }}>Decision</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: dc.color }}>{report.investmentDecision}</div>
        </div>

        {/* Confidence */}
        <div className="stat-card">
          <div className="section-label" style={{ marginBottom: '8px' }}>Confidence</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--electric)' }}>{report.confidenceScore}%</span>
          </div>
          <div className="confidence-bar-track" style={{ marginTop: '8px' }}>
            <div className="confidence-bar-fill" style={{ width: `${report.confidenceScore}%` }} />
          </div>
        </div>

        {/* Strengths count */}
        <div className="stat-card">
          <div className="section-label" style={{ marginBottom: '8px' }}>Strengths</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--emerald)' }}>{report.strengths.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>identified</div>
        </div>

        {/* Risks count */}
        <div className="stat-card">
          <div className="section-label" style={{ marginBottom: '8px' }}>Risks</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--rose)' }}>{report.risks.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>flagged</div>
        </div>
      </div>

      {/* Overview */}
      <div style={{ padding: '0 24px 24px' }}>
        <div style={{
          background: 'var(--surface-1)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '16px 18px'
        }}>
          <div className="section-label" style={{ marginBottom: '8px' }}>Company Overview</div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            {report.overview}
          </p>
        </div>
      </div>
    </div>
  );
};
