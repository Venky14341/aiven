import { useState, useEffect } from 'react';

const STAGES = [
  { id: 1, icon: '🔍', label: 'Company Profile',    desc: 'Resolving ticker, sector & corporate structure...',   duration: 4  },
  { id: 2, icon: '📊', label: 'Financial Analysis', desc: 'Scanning revenue, margins & valuation multiples...',   duration: 8  },
  { id: 3, icon: '🧠', label: 'Market Sentiment',   desc: 'Processing analyst consensus & news signals...',       duration: 7  },
  { id: 4, icon: '⚡', label: 'Risk Mapping',       desc: 'Evaluating macro, regulatory & competitive risks...',  duration: 7  },
  { id: 5, icon: '🎯', label: 'AI Decision Engine', desc: 'Computing Buy / Hold / Sell with confidence score...', duration: 99 },
];

export const LoadingState = ({ companyName }: { companyName?: string }) => {
  const [elapsed, setElapsed] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  // Elapsed timer
  useEffect(() => {
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Auto-advance stages
  useEffect(() => {
    let acc = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    STAGES.forEach((stage, i) => {
      if (i < STAGES.length - 1) {
        acc += stage.duration;
        timers.push(setTimeout(() => setCurrentStage(i + 1), acc * 1000));
      }
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const isSlow = elapsed > 30;

  return (
    <div className="animate-fade-in" style={{
      display: 'flex', flexDirection: 'column', gap: '28px',
      padding: '40px 36px',
      background: 'var(--surface-1)',
      border: '1px solid var(--border)',
      borderRadius: '28px',
      maxWidth: '680px', margin: '0 auto', width: '100%',
      boxShadow: '0 24px 60px rgba(0,0,0,0.4)'
    }}>

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <div>
          <div className="badge badge-electric" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: 'var(--emerald)', display: 'inline-block',
              animation: 'pulse-glow 1.4s ease-in-out infinite'
            }} />
            AI Agents Active
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            Analysing{companyName ? ` "${companyName}"` : ' Company'}...
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
            Multi-agent AI pipeline running. This takes 20–60 seconds.
          </p>
        </div>

        {/* Elapsed timer */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '12px 16px', flexShrink: 0, minWidth: '72px'
        }}>
          <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 900, color: isSlow ? 'var(--gold)' : 'var(--electric)', letterSpacing: '0.04em' }}>
            {formatTime(elapsed)}
          </div>
          <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>
            Elapsed
          </div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Pipeline Progress
          </span>
          <span className="font-mono" style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--electric)' }}>
            Stage {Math.min(currentStage + 1, STAGES.length)} / {STAGES.length}
          </span>
        </div>
        <div style={{ height: '6px', background: 'var(--surface-3)', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${((currentStage) / (STAGES.length - 1)) * 100}%`,
            background: 'linear-gradient(90deg, var(--electric), var(--violet))',
            borderRadius: '99px',
            transition: 'width 1.2s cubic-bezier(0.25, 1, 0.5, 1)',
            boxShadow: '0 0 12px rgba(0,212,255,0.4)'
          }} />
        </div>
      </div>

      {/* Stage cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {STAGES.map((stage, i) => {
          const isDone    = i < currentStage;
          const isActive  = i === currentStage;
          const isPending = i > currentStage;

          return (
            <div
              key={stage.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 16px', borderRadius: '14px',
                background: isActive  ? 'rgba(0,212,255,0.05)' :
                            isDone    ? 'rgba(52,211,153,0.04)' :
                                        'var(--surface-2)',
                border: `1px solid ${isActive  ? 'rgba(0,212,255,0.2)' :
                                     isDone    ? 'rgba(52,211,153,0.15)' :
                                                 'var(--border)'}`,
                transition: 'all 0.5s ease',
                opacity: isPending ? 0.45 : 1,
              }}
            >
              {/* Status icon / spinner */}
              <div style={{
                width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isActive ? 'rgba(0,212,255,0.1)' : isDone ? 'rgba(52,211,153,0.1)' : 'var(--surface-3)',
                border: `1px solid ${isActive ? 'rgba(0,212,255,0.25)' : isDone ? 'rgba(52,211,153,0.2)' : 'transparent'}`,
              }}>
                {isDone ? (
                  <span style={{ fontSize: '1rem', color: 'var(--emerald)' }}>✓</span>
                ) : isActive ? (
                  <div style={{
                    width: '16px', height: '16px', borderRadius: '50%',
                    border: '2px solid var(--electric)', borderTopColor: 'transparent',
                    animation: 'spin-slow 0.7s linear infinite'
                  }} />
                ) : (
                  <span style={{ fontSize: '1rem', opacity: 0.5 }}>{stage.icon}</span>
                )}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.86rem', fontWeight: 700,
                  color: isDone ? 'var(--emerald)' : isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  marginBottom: '2px'
                }}>
                  {stage.label}
                  {isDone && <span style={{ fontSize: '0.68rem', marginLeft: '8px', color: 'var(--emerald)', fontWeight: 600 }}>Complete</span>}
                </div>
                {(isActive || isDone) && (
                  <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {stage.desc}
                  </div>
                )}
              </div>

              {/* Stage emoji (visible when idle/done) */}
              {!isActive && (
                <span style={{ fontSize: '1.1rem', opacity: isDone ? 1 : 0.3 }}>{stage.icon}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Patience message for slow API */}
      {isSlow && (
        <div className="animate-fade-in" style={{
          background: 'rgba(240,180,41,0.06)', border: '1px solid rgba(240,180,41,0.2)',
          borderRadius: '14px', padding: '14px 18px',
          display: 'flex', gap: '12px', alignItems: 'flex-start'
        }}>
          <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>⏳</span>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '3px' }}>
              Deep Analysis in Progress
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Gemini AI is synthesising a comprehensive investment report. Complex companies (e.g. NVIDIA, Apple) may take up to 90 seconds. Please do not navigate away.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
