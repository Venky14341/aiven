import { ResearchReport } from '../types';
import { CompanyCard } from './CompanyCard';
import { Charts } from './Charts';
import { RecommendationCard } from './RecommendationCard';
import { RiskCard } from './RiskCard';

interface SectionItem {
  id: 'overview' | 'financials' | 'sentiment' | 'risks' | 'recommendation';
  label: string;
  emoji: string;
}

type SectionId = SectionItem['id'];

interface ReportDashboardProps {
  report: ResearchReport;
  activeSection: SectionId;
  sectionItems: readonly SectionItem[];
  onSectionChange: (section: SectionId) => void;
}

const sectionMeta: Record<string, { desc: string; color: string; badgeClass: string }> = {
  overview:       { desc: 'Company summary, strengths, weaknesses & competitive landscape.',      color: 'var(--electric)', badgeClass: 'badge-electric' },
  financials:     { desc: 'Revenue growth, profitability, business model & scalability signals.', color: 'var(--emerald)',  badgeClass: 'badge-emerald'  },
  sentiment:      { desc: 'Market emotion, news impact, trends & investor pulse.',                color: 'var(--violet)',   badgeClass: 'badge-violet'   },
  risks:          { desc: 'Key risk factors and emerging threats to the investment thesis.',       color: 'var(--rose)',     badgeClass: 'badge-rose'     },
  recommendation: { desc: 'Final decision, confidence score & investment reasoning.',             color: 'var(--gold)',     badgeClass: 'badge-gold'     },
};

const historySteps = (name: string) => [
  { icon: '🚀', title: 'Market Entry',       desc: `${name} establishes its core position with strong early momentum.` },
  { icon: '📈', title: 'Growth Phase',       desc: 'Competitive advantage and demand drive next-phase expansion.'      },
  { icon: '🔍', title: 'Strategic Depth',    desc: "Deep analysis reveals the company's differentiation and moat."     },
  { icon: '🌐', title: 'Market Influence',   desc: 'Sentiment and industry trends point to broader adoption.'          },
  { icon: '🏁', title: 'Investment Verdict', desc: 'A clear thesis emerges from the full research picture.'            },
];

export const ReportDashboard = ({ report, activeSection, sectionItems, onSectionChange }: ReportDashboardProps) => {
  const meta = sectionMeta[activeSection] ?? sectionMeta.overview;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <CompanyCard report={report} />

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px', alignItems: 'start' }}>

        {/* ── Sidebar nav ── */}
        <aside className="glass" style={{ borderRadius: '20px', padding: '16px', position: 'sticky', top: '24px' }}>
          <div className="section-label" style={{ padding: '4px 8px', marginBottom: '12px' }}>Sections</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {sectionItems.map(item => {
              const m = sectionMeta[item.id];
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  type="button"
                  onClick={() => onSectionChange(item.id)}
                  className={`nav-pill${isActive ? ' active' : ''}`}
                  style={{ borderColor: isActive ? m.color + '40' : 'transparent' }}
                >
                  <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{item.emoji}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {isActive && (
                    <span style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: m.color, flexShrink: 0,
                      boxShadow: `0 0 8px ${m.color}`
                    }} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Competitors mini-card */}
          {report.competitors?.length > 0 && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <div className="section-label" style={{ padding: '4px 8px', marginBottom: '10px' }}>Competitors</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {report.competitors.slice(0, 4).map(c => (
                  <div key={c} style={{
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    borderRadius: '8px', padding: '7px 12px',
                    fontSize: '0.78rem', color: 'var(--text-muted)'
                  }}>
                    {c}
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* ── Main content ── */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>

          {/* Section header */}
          <div className="glass" style={{ borderRadius: '18px', padding: '20px 24px', borderColor: meta.color + '25' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div className="section-label" style={{ marginBottom: '6px' }}>Current Section</div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: meta.color, margin: 0 }}>
                  {sectionItems.find(s => s.id === activeSection)?.emoji}{' '}
                  {sectionItems.find(s => s.id === activeSection)?.label}
                </h2>
              </div>
              <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', maxWidth: '380px', lineHeight: 1.6 }}>
                {meta.desc}
              </p>
            </div>
          </div>

          {/* ── OVERVIEW ── */}
          {activeSection === 'overview' && (
            <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Strengths & Weaknesses */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {/* Strengths */}
                <div className="glass" style={{ borderRadius: '18px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '1.1rem' }}>💪</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--emerald)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Key Strengths</span>
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', listStyle: 'none' }}>
                    {report.strengths.map((item, i) => (
                      <li key={i} className="list-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <span style={{ color: 'var(--emerald)', fontWeight: 700, flexShrink: 0, fontSize: '0.75rem', marginTop: '2px' }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="glass" style={{ borderRadius: '18px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '1.1rem' }}>⚠️</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Key Weaknesses</span>
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', listStyle: 'none' }}>
                    {report.weaknesses.map((item, i) => (
                      <li key={i} className="list-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <span style={{ color: 'var(--gold)', fontWeight: 700, flexShrink: 0, fontSize: '0.75rem', marginTop: '2px' }}>△</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Company Journey */}
              <div className="glass" style={{ borderRadius: '18px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🗺️</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--electric)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Company Journey</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  {historySteps(report.companyName).map((step, i) => (
                    <div key={step.title} style={{
                      background: 'var(--surface-2)', border: '1px solid var(--border)',
                      borderRadius: '14px', padding: '16px',
                      animation: `fade-up 0.35s ease ${i * 0.07}s both`
                    }}>
                      <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{step.icon}</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>{step.title}</div>
                      <div style={{ fontSize: '0.77rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{step.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formatted Report */}
              {report.reportText && (
                <div className="glass" style={{ borderRadius: '18px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '1.1rem' }}>📄</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--violet)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Full Report</span>
                  </div>
                  <div style={{
                    background: 'var(--surface-1)', border: '1px solid var(--border)',
                    borderRadius: '12px', padding: '20px',
                    fontSize: '0.85rem', color: 'var(--text-secondary)',
                    lineHeight: 1.85, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    maxHeight: '400px', overflowY: 'auto',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {report.reportText}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── FINANCIALS ── */}
          {activeSection === 'financials' && (
            <div className="animate-fade-up">
              <Charts report={report} />
            </div>
          )}

          {/* ── SENTIMENT ── */}
          {activeSection === 'sentiment' && (
            <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Sentiment badge */}
              <div className="glass" style={{ borderRadius: '18px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.5rem' }}>🧠</span>
                  <div>
                    <div className="section-label" style={{ marginBottom: '4px' }}>Overall Sentiment</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--violet)' }}>
                      {report.marketSentiment.sentiment || 'Neutral'}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginLeft: '0' }}>
                  {report.marketSentiment.recentNews || 'No recent news data available.'}
                </p>
              </div>

              {/* Trends */}
              {(report.marketSentiment.trends?.length ?? 0) > 0 && (
                <div className="glass" style={{ borderRadius: '18px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '1.1rem' }}>📡</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--electric)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Market Trends</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {report.marketSentiment.trends?.map((trend, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'flex-start', gap: '12px',
                        background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)',
                        borderRadius: '10px', padding: '12px 14px',
                        animation: `fade-up 0.3s ease ${i * 0.06}s both`
                      }}>
                        <span style={{ color: 'var(--electric)', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0, marginTop: '2px' }}>{String(i + 1).padStart(2, '0')}</span>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{trend}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sentiment risks */}
              {(report.marketSentiment.risks?.length ?? 0) > 0 && (
                <div className="glass" style={{ borderRadius: '18px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '1.1rem' }}>🔔</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sentiment Risks</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {report.marketSentiment.risks?.map((risk, i) => (
                      <div key={i} className="list-item" style={{ display: 'flex', gap: '10px' }}>
                        <span style={{ color: 'var(--gold)', flexShrink: 0 }}>›</span>
                        {risk}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── RISKS ── */}
          {activeSection === 'risks' && (
            <div className="animate-fade-up glass" style={{ borderRadius: '18px', padding: '24px' }}>
              <RiskCard title="Top Risk Signals" items={report.risks} />
            </div>
          )}

          {/* ── RECOMMENDATION ── */}
          {activeSection === 'recommendation' && (
            <div className="animate-fade-up">
              <RecommendationCard report={report} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
