import { FormEvent, useState } from 'react';
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
  const [showPassword, setShowPassword] = useState(false);

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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden', background: 'var(--surface-0)' }}>
      {/* Dynamic Background */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(60px)' }} />

      <div style={{ width: '100%', maxWidth: '1140px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '48px', alignItems: 'center', zIndex: 1 }}>

        {/* Left — Brand + Features */}
        <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="glow-gold" style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--gold-light), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 900, color: '#000' }}>A</div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Aivenky Nova</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Intelligence Engine</div>
            </div>
          </div>

          <div>
            <h1 className="font-display" style={{ fontSize: 'clamp(2.5rem, 6vw, 3.8rem)', lineHeight: 1.05, marginBottom: '20px' }}>
              <span className="text-gradient-electric">Next-gen</span>
              <br />
              <span style={{ color: 'var(--text-primary)' }}>research for the</span>
              <br />
              <span className="text-gradient-gold" style={{ fontStyle: 'italic' }}>modern investor.</span>
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '460px' }}>
              Harness the power of Gemini AI to decode market signals, financials, and risks instantly. Built for clarity, speed, and precision.
            </p>
          </div>

          {/* Feature highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '480px' }}>
            {features.map((f, i) => (
              <div key={f.label} className={`glass animate-fade-up delay-${(i + 1) * 100}`} style={{
                borderRadius: '16px', padding: '16px', border: '1px solid var(--border)',
                background: 'rgba(255,255,255,0.02)', transition: 'all 0.3s'
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.3)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{f.icon}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{f.label}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Auth Card */}
        <div className="glass animate-fade-up delay-200 glow-electric" style={{ borderRadius: '28px', padding: '40px', maxWidth: '440px', justifySelf: 'center', width: '100%', position: 'relative', overflow: 'hidden' }}>
          
          {/* Subtle gradient background for card */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--electric), var(--violet), var(--gold))' }} />

          {/* Mode toggle tabs */}
          <div style={{ display: 'flex', background: 'var(--surface-2)', borderRadius: '14px', padding: '5px', marginBottom: '32px', border: '1px solid var(--border)' }}>
            {(['login', 'register'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                id={`auth-tab-${tab}`}
                onClick={() => switchMode(tab)}
                style={{
                  flex: 1, padding: '12px', borderRadius: '10px', border: 'none',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: mode === tab ? 'var(--surface-4)' : 'transparent',
                  color: mode === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                  boxShadow: mode === tab ? '0 4px 12px rgba(0,0,0,0.4)' : 'none',
                }}
              >
                {tab === 'login' ? '🔐 Sign In' : '✨ Join Now'}
              </button>
            ))}
          </div>

          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {mode === 'login' ? 'Securely access your intelligence dashboard' : 'Start your journey with Aivenky Nova today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Name — only in register mode */}
            {mode === 'register' && (
              <div className="animate-fade-in">
                <label style={labelStyle}>Full Name</label>
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  style={inputStyle}
                  autoComplete="name"
                  onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--electric)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 4px rgba(0,212,255,0.08)'; }}
                  onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                />
              </div>
            )}

            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                style={inputStyle}
                autoComplete="email"
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--electric)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 4px rgba(0,212,255,0.08)'; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <label style={labelStyle}>Password</label>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                style={inputStyle}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--electric)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 4px rgba(0,212,255,0.08)'; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', bottom: '10px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem', padding: '4px' }}
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>

            {/* Confirm password — only in register mode */}
            {mode === 'register' && (
              <div className="animate-fade-in">
                <label style={labelStyle}>Confirm Password</label>
                <input
                  id="register-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  style={inputStyle}
                  autoComplete="new-password"
                  onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--electric)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 4px rgba(0,212,255,0.08)'; }}
                  onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                />
              </div>
            )}

            {error && (
              <div className="animate-fade-in" style={{ background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.2)', borderRadius: '12px', padding: '14px', fontSize: '0.85rem', color: 'var(--rose)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <button id="login-submit" type="submit" disabled={isLoading} className="btn-primary" style={{ marginTop: '8px', width: '100%', padding: '16px', borderRadius: '14px' }}>
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '18px', height: '18px', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000', borderRadius: '50%', display: 'inline-block', animation: 'spin-slow 0.8s linear infinite' }} />
                  {mode === 'register' ? 'Creating account...' : 'Signing in...'}
                </div>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {mode === 'register' ? 'Create Account' : 'Continue to Dashboard'} <span style={{ fontSize: '1.1rem' }}>→</span>
                </span>
              )}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
            <div className="divider" style={{ flex: 1 }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>or</span>
            <div className="divider" style={{ flex: 1 }} />
          </div>

          <button id="demo-login" type="button" onClick={handleDemoLogin} disabled={isLoading} className="btn-ghost" style={{ width: '100%', padding: '14px', borderRadius: '14px', fontWeight: 700 }}>
            🚀 Instant Demo Access
          </button>

          <p style={{ marginTop: '24px', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
            By signing up, you agree to our <span style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>Terms of Service</span> and <span style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>Privacy Policy</span>.
          </p>
        </div>
      </div>

      {/* Decorative Circles */}
      <div style={{ position: 'absolute', top: '10%', right: '5%', width: '300px', height: '300px', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '5%', left: '5%', width: '400px', height: '400px', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '50%', pointerEvents: 'none' }} />
    </div>
  );
};

