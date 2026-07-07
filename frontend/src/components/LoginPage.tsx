import { FormEvent, useState } from 'react';
import dashboardPreview from '../assets/images/dashboard_preview.png';
import { authService } from '../services/authService';

interface LoginPageProps {
  onLogin: (name: string) => void;
}

const features = [
  { icon: '⚡', label: 'Real-time AI analysis', desc: 'Gemini-powered research on any public company instantly.' },
  { icon: '📊', label: 'Financial intelligence', desc: 'Revenue, profitability, scalability — all decoded.' },
  { icon: '🎯', label: 'Investment decisions', desc: 'Clear Buy / Hold / Sell with confidence scoring.' },
  { icon: '🛡️', label: 'Risk mapping', desc: 'Comprehensive risk signals and market sentiment.' },
];

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) { setError('Please enter your name.'); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
      if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    }

    setIsLoading(true);
    try {
      let user;
      if (mode === 'register') {
        user = await authService.register(name.trim(), email.trim(), password);
      } else {
        user = await authService.login(email.trim(), password);
      }
      onLogin(user.name);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const user = await authService.demoLogin();
      onLogin(user.name);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Demo login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    color: 'var(--text-primary)',
    fontSize: '0.88rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 600 as const,
    color: 'var(--text-muted)',
    marginBottom: '8px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      {/* Background decorations */}
      <div style={{ position: 'absolute', top: '-200px', left: '-200px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-200px', right: '-200px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '1080px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', alignItems: 'center' }}>

        {/* Left — Brand + Features */}
        <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--gold-light), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 900, color: '#000' }}>A</div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Aivenky Nova</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Investment Intelligence</div>
            </div>
          </div>

          <div>
            <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.15, marginBottom: '16px' }}>
              <span className="text-gradient-electric">AI-powered</span>
              <br />
              <span style={{ color: 'var(--text-primary)' }}>investment research</span>
              <br />
              <span className="text-gradient-gold" style={{ fontStyle: 'italic' }}>at your fingertips.</span>
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '420px' }}>
              Analyze any public company with deep AI research — financials, sentiment, risks, and actionable investment decisions in seconds.
            </p>
          </div>

          <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 12px 32px rgba(0,0,0,0.5)', background: 'var(--surface-3)', maxWidth: '420px', transition: 'transform 0.3s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
          >
            <img src={dashboardPreview} alt="Aivenky Nova Dashboard Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {features.map((f, i) => (
              <div key={f.label} className={`animate-fade-up delay-${(i + 1) * 100}`} style={{
                display: 'flex', alignItems: 'flex-start', gap: '14px',
                background: 'var(--surface-1)', border: '1px solid var(--border)',
                borderRadius: '14px', padding: '14px 16px',
                transition: 'border-color 0.2s, transform 0.2s', cursor: 'default'
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'translateX(0)'; }}
              >
                <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{f.icon}</span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{f.label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Auth Card */}
        <div className="glass animate-fade-up delay-200" style={{ borderRadius: '24px', padding: '36px', maxWidth: '420px', justifySelf: 'center', width: '100%' }}>

          {/* Mode toggle tabs */}
          <div style={{ display: 'flex', background: 'var(--surface-2)', borderRadius: '12px', padding: '4px', marginBottom: '28px', gap: '4px' }}>
            {(['login', 'register'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                id={`auth-tab-${tab}`}
                onClick={() => switchMode(tab)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '9px', border: 'none',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                  background: mode === tab ? 'var(--surface-3)' : 'transparent',
                  color: mode === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                  boxShadow: mode === tab ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                }}
              >
                {tab === 'login' ? '🔑 Sign In' : '✨ Register'}
              </button>
            ))}
          </div>

          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <div className="badge badge-electric" style={{ marginBottom: '12px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--electric)', display: 'inline-block', animation: 'pulse-glow 2s infinite' }} />
              {mode === 'login' ? 'Secure Access' : 'Create Account'}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {mode === 'login' ? 'Welcome back' : 'Join Aivenky Nova'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {mode === 'login' ? 'Access your investment research dashboard' : 'Create your free investor account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Name — only in register mode */}
            {mode === 'register' && (
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  style={inputStyle}
                  autoComplete="name"
                  onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--electric)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(0,212,255,0.1)'; }}
                  onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                />
              </div>
            )}

            <div>
              <label style={labelStyle}>Email address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={inputStyle}
                autoComplete="email"
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--electric)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(0,212,255,0.1)'; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                style={inputStyle}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--electric)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(0,212,255,0.1)'; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
              />
            </div>

            {/* Confirm password — only in register mode */}
            {mode === 'register' && (
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <input
                  id="register-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••"
                  style={inputStyle}
                  autoComplete="new-password"
                  onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--electric)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(0,212,255,0.1)'; }}
                  onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                />
              </div>
            )}

            {error && (
              <div style={{ background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.2)', borderRadius: '10px', padding: '12px 16px', fontSize: '0.83rem', color: 'var(--rose)' }}>
                ⚠ {error}
              </div>
            )}

            <button id="login-submit" type="submit" disabled={isLoading} className="btn-primary" style={{ marginTop: '4px', width: '100%', padding: '15px' }}>
              {isLoading ? (
                <><span style={{ width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', display: 'inline-block', animation: 'spin-slow 0.8s linear infinite' }} /> {mode === 'register' ? 'Creating account...' : 'Signing in...'}</>
              ) : mode === 'register' ? 'Create Account →' : 'Continue to Dashboard →'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div className="divider" style={{ flex: 1 }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>or</span>
            <div className="divider" style={{ flex: 1 }} />
          </div>

          <button id="demo-login" type="button" onClick={handleDemoLogin} disabled={isLoading} className="btn-ghost" style={{ width: '100%', padding: '13px' }}>
            🚀 Try Demo Access
          </button>

          <p style={{ marginTop: '20px', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
            By continuing, you agree to our terms. All research is AI-generated and for informational purposes only.
          </p>
        </div>
      </div>
    </div>
  );
};
