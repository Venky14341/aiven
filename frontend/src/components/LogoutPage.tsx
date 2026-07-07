import { useState, useEffect } from 'react';

interface LogoutPageProps {
  onRedirect: () => void;
}

export const LogoutPage = ({ onRedirect }: LogoutPageProps) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onRedirect]);

  const investmentQuotes = [
    { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
    { text: "The stock market is filled with individuals who know the price of everything, but the value of nothing.", author: "Philip Fisher" },
    { text: "In investing, what is comfortable is rarely profitable.", author: "Robert Arnott" }
  ];

  // Pick a quote based on a fixed random or day
  const quote = investmentQuotes[0]; 

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--surface-0)'
    }}>
      {/* Glow backgrounds */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(251,113,133,0.04) 0%, transparent 70%)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)', pointerEvents: 'none'
      }} />

      <div className="glass animate-fade-up" style={{
        maxWidth: '520px', width: '100%', borderRadius: '24px', padding: '40px',
        textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '28px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid var(--border)'
      }}>
        
        {/* Success Icon */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', color: 'var(--emerald)', animation: 'pulse-glow 2s infinite'
          }}>
            ✓
          </div>
        </div>

        {/* Messaging */}
        <div>
          <div className="badge badge-rose" style={{ display: 'inline-flex', marginBottom: '12px' }}>Signed Out</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Safely Logged Out
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Thank you for using Aivenky Nova. Your research session has been secured.
          </p>
        </div>

        {/* Quote of the Day */}
        <div style={{
          background: 'var(--surface-1)', borderLeft: '3px solid var(--gold)',
          borderRadius: '8px', padding: '16px 20px', textAlign: 'left',
          fontStyle: 'italic'
        }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '6px' }}>
            "{quote.text}"
          </p>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            — {quote.author}
          </p>
        </div>

        {/* Mock Session Summary Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="section-label" style={{ textAlign: 'left', paddingLeft: '4px' }}>Session Performance Summary</div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px',
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '16px'
          }}>
            <div style={{ borderRight: '1px solid var(--border)', paddingRight: '8px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--electric)' }}>8</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>Reports Generated</div>
            </div>
            <div style={{ paddingLeft: '8px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--emerald)' }}>~7.2s</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>Avg Generation Speed</div>
            </div>
          </div>
        </div>

        {/* Redirect timer & manual Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Redirecting to login screen in <span style={{ color: 'var(--rose)', fontWeight: 700 }}>{countdown}</span> seconds...
          </p>
          <button
            type="button"
            onClick={onRedirect}
            className="btn-primary"
            style={{ width: '100%', padding: '13px', fontSize: '0.88rem' }}
          >
            Log In Again Now
          </button>
        </div>

      </div>
    </div>
  );
};
