import { FormEvent, useState, useEffect, useRef } from 'react';
import { authService } from '../services/authService';
import loginHero from '../assets/images/login_hero.png';

interface LoginPageProps {
  onLogin: (name: string) => void;
}

const features = [
  { icon: '⚡', label: 'Real-time AI Analysis',  desc: 'Gemini-powered deep research on any public company in seconds.', gradient: 'linear-gradient(135deg, #00d4ff, #0099cc)' },
  { icon: '📊', label: 'Financial Intelligence', desc: 'Revenue, margins, valuation, and growth metrics decoded.', gradient: 'linear-gradient(135deg, #34d399, #059669)' },
  { icon: '🎯', label: 'Decision Engine',        desc: 'Clear Buy / Hold / Sell with AI-confidence scoring.', gradient: 'linear-gradient(135deg, #f0b429, #d97706)' },
  { icon: '🛡️', label: 'Risk Radar',              desc: 'Multi-vector risk mapping and threat intelligence.', gradient: 'linear-gradient(135deg, #fb7185, #e11d48)' },
];

const socialProof = [
  { value: '50+', label: 'Data Points' },
  { value: '3',   label: 'AI Agents' },
  { value: '< 8s', label: 'Avg Response' },
  { value: '24/7', label: 'Availability' },
];

/* ── Typewriter hook ── */
function useTypewriter(texts: string[], speed = 80, pause = 2000) {
  const [display, setDisplay] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0, j = 0, deleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = texts[i];
      if (!deleting) {
        setDisplay(current.slice(0, j + 1));
        j++;
        if (j === current.length) {
          deleting = true;
          timeout = setTimeout(tick, pause);
          return;
        }
      } else {
        setDisplay(current.slice(0, j - 1));
        j--;
        if (j === 0) {
          deleting = false;
          i = (i + 1) % texts.length;
        }
      }
      timeout = setTimeout(tick, deleting ? 40 : speed);
    };

    timeout = setTimeout(tick, 600);
    const cursorInterval = setInterval(() => setShowCursor(v => !v), 530);
    return () => { clearTimeout(timeout); clearInterval(cursorInterval); };
  }, []);

  return { display, showCursor };
}

/* ── Animated Counter ── */
function AnimCounter({ target, suffix = '' }: { target: string; suffix?: string }) {
  const [val, setVal] = useState(0);
  const numericPart = parseInt(target.replace(/\D/g, ''), 10);
  const isNumeric = !isNaN(numericPart) && numericPart > 0;

  useEffect(() => {
    if (!isNumeric) return;
    let frame: number;
    const duration = 1200;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setVal(Math.round(eased * numericPart));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [numericPart]);

  if (!isNumeric) return <>{target}</>;
  return <>{val}{suffix}</>;
}

/* ── Floating Particles Component ── */
function Particles({ count = 20 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 3,
    dx: (Math.random() - 0.5) * 120,
    dy: (Math.random() - 0.5) * 120,
    color: ['var(--electric)', 'var(--violet)', 'var(--gold)', 'var(--emerald)'][Math.floor(Math.random() * 4)],
  }));

  return (
    <>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left, top: p.top,
            width: `${p.size}px`, height: `${p.size}px`,
            borderRadius: '50%',
            background: p.color,
            opacity: 0,
            pointerEvents: 'none',
            animation: `particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            ['--dx' as any]: `${p.dx}px`,
            ['--dy' as any]: `${p.dy}px`,
          }}
        />
      ))}
    </>
  );
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { display, showCursor } = useTypewriter([
    'the modern investor.',
    'smarter decisions.',
    'real-time intelligence.',
    'portfolio confidence.',
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* 3D tilt on mouse move */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(1200px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  };
  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(1200px) rotateY(0) rotateX(0)';
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError('');
    setName(''); setEmail(''); setPassword(''); setConfirmPassword('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) { setError('Please fill in all required fields.'); return; }
    if (mode === 'register') {
      if (!name.trim()) { setError('Please enter your name.'); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
      if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    }
    setIsLoading(true);
    try {
      const user = mode === 'register'
        ? await authService.register(name.trim(), email.trim(), password)
        : await authService.login(email.trim(), password);
      onLogin(user.name);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Something went wrong.');
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
      setError(err?.response?.data?.message || 'Demo login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    background: 'rgba(8, 12, 26, 0.7)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    fontSize: '0.88rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    transition: 'border-color 0.3s, box-shadow 0.3s, background 0.3s',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.72rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    marginBottom: '8px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden', background: 'var(--surface-0)'
    }}>

      {/* ── Animated Background Layer ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {/* Morphing blobs */}
        <div className="morph-blob" style={{ width: '600px', height: '600px', top: '-15%', left: '-10%', background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="morph-blob" style={{ width: '500px', height: '500px', bottom: '-10%', right: '-10%', background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)', filter: 'blur(60px)', animationDelay: '-3s' }} />
        <div className="morph-blob" style={{ width: '300px', height: '300px', top: '40%', left: '50%', background: 'radial-gradient(circle, rgba(240,180,41,0.05) 0%, transparent 70%)', filter: 'blur(40px)', animationDelay: '-5s' }} />

        {/* Aurora band */}
        <div className="aurora-band" style={{ top: '20%', left: '-50%' }} />

        {/* Particles */}
        <Particles count={25} />

        {/* Decorative orbit rings */}
        <div className="orbit-ring" style={{ position: 'absolute', width: '400px', height: '400px', top: '5%', right: '-5%', opacity: 0.5 }} />
        <div className="orbit-ring-2" style={{ position: 'absolute', width: '500px', height: '500px', bottom: '-10%', left: '-8%', opacity: 0.3 }} />

        {/* Grid pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          opacity: 0.4,
        }} />
      </div>

      {/* ── Main Content Grid ── */}
      <div className="login-grid" style={{
        width: '100%', maxWidth: '1200px', display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr', gap: '60px',
        alignItems: 'center', zIndex: 1,
        opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease',
      }}>

        {/* ═══ LEFT — Brand + Hero ═══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
          {/* Logo */}
          <div className="animate-hero-slide" style={{ display: 'flex', alignItems: 'center', gap: '16px', opacity: 0 }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--gold-light), var(--gold))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '26px', fontWeight: 900, color: '#000',
              boxShadow: '0 0 40px -10px rgba(240,180,41,0.5)',
            }}>I</div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>InvestIQ</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Investment Intelligence</div>
            </div>
          </div>

          {/* Hero heading with typewriter */}
          <div className="animate-hero-slide stagger-2" style={{ opacity: 0 }}>
            <h1 className="font-display" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 3.6rem)', lineHeight: 1.08, marginBottom: '20px' }}>
              <span className="text-gradient-electric">Next-gen</span>
              <br />
              <span style={{ color: 'var(--text-primary)' }}>research for</span>
              <br />
              <span className="text-gradient-gold" style={{ fontStyle: 'italic' }}>
                {display}
                <span style={{ color: 'var(--electric)', opacity: showCursor ? 1 : 0, transition: 'opacity 0.1s', fontStyle: 'normal' }}>|</span>
              </span>
            </h1>
            <p style={{ fontSize: '1.02rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '480px' }}>
              Harness the power of multi-agent AI to decode market signals, financial fundamentals, and risk vectors — all in real time.
            </p>
          </div>

          {/* Animated Stats Row */}
          <div className="stats-row animate-hero-slide stagger-3" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px',
            maxWidth: '520px', opacity: 0,
          }}>
            {socialProof.map((s, i) => (
              <div key={s.label} className="animate-count-reveal" style={{
                padding: '14px 10px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                textAlign: 'center', animationDelay: `${0.5 + i * 0.15}s`, opacity: 0,
                backdropFilter: 'blur(10px)',
              }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {s.value.match(/^\d+$/) ? <AnimCounter target={s.value} suffix="+" /> : s.value}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Feature cards with gradient icons */}
          <div className="animate-hero-slide stagger-4" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px',
            maxWidth: '520px', opacity: 0,
          }}>
            {features.map((f, i) => (
              <div key={f.label} className="animate-card-entrance" style={{
                borderRadius: '16px', padding: '18px', border: '1px solid var(--border)',
                background: 'rgba(13,18,37,0.5)', backdropFilter: 'blur(12px)',
                transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                cursor: 'default', animationDelay: `${0.7 + i * 0.12}s`, opacity: 0,
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px) scale(1.02)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.2)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: f.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', marginBottom: '12px',
                  boxShadow: `0 4px 16px -4px ${f.gradient.includes('00d4ff') ? 'rgba(0,212,255,0.3)' : f.gradient.includes('34d399') ? 'rgba(52,211,153,0.3)' : f.gradient.includes('f0b429') ? 'rgba(240,180,41,0.3)' : 'rgba(251,113,133,0.3)'}`,
                }}>{f.icon}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{f.label}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Hero image */}
          <div className="animate-hero-slide stagger-5" style={{ opacity: 0, maxWidth: '520px' }}>
            <div style={{
              borderRadius: '18px', overflow: 'hidden',
              boxShadow: '0 20px 60px -15px rgba(0,0,0,0.7), 0 0 30px -10px rgba(0,212,255,0.1)',
              border: '1px solid rgba(255,255,255,0.06)',
              transition: 'transform 0.4s, box-shadow 0.4s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.01) translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 25px 70px -15px rgba(0,0,0,0.8), 0 0 40px -10px rgba(0,212,255,0.15)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1) translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 60px -15px rgba(0,0,0,0.7), 0 0 30px -10px rgba(0,212,255,0.1)'; }}
            >
              <img src={loginHero} alt="AI Financial Intelligence" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </div>

        {/* ═══ RIGHT — Auth Card with 3D tilt ═══ */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="animate-card-entrance"
            style={{
              borderRadius: '28px', padding: '40px', maxWidth: '440px', width: '100%',
              position: 'relative', overflow: 'hidden',
              background: 'rgba(13,18,37,0.65)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 25px 60px -12px rgba(0,0,0,0.7), 0 0 60px -20px rgba(0,212,255,0.08)',
              transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease',
              willChange: 'transform',
              animationDelay: '0.3s', opacity: 0,
            }}
          >
            {/* Animated top gradient bar */}
            <div className="gradient-mesh-bg" style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
              background: 'linear-gradient(90deg, var(--electric), var(--violet), var(--gold), var(--emerald), var(--electric))',
              backgroundSize: '400% 100%',
            }} />

            {/* Subtle inner glow */}
            <div style={{ position: 'absolute', top: '-50%', right: '-30%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 60%)', pointerEvents: 'none' }} />

            {/* Mode toggle */}
            <div style={{ display: 'flex', background: 'rgba(8,12,26,0.6)', borderRadius: '14px', padding: '4px', marginBottom: '28px', border: '1px solid rgba(255,255,255,0.05)' }}>
              {(['login', 'register'] as const).map(tab => (
                <button
                  key={tab} type="button" id={`auth-tab-${tab}`}
                  onClick={() => switchMode(tab)}
                  style={{
                    flex: 1, padding: '11px', borderRadius: '10px', border: 'none',
                    fontFamily: 'Inter, sans-serif', fontSize: '0.84rem', fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                    background: mode === tab ? 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(167,139,250,0.1))' : 'transparent',
                    color: mode === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                    boxShadow: mode === tab ? '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)' : 'none',
                  }}
                >
                  {tab === 'login' ? '🔐 Sign In' : '✨ Join Now'}
                </button>
              ))}
            </div>

            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                {mode === 'login' ? 'Access your intelligence dashboard securely.' : 'Start your AI-powered investment journey.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mode === 'register' && (
                <div className="animate-fade-in">
                  <label style={labelStyle}>Full Name</label>
                  <input id="register-name" type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="e.g. John Doe" style={inputStyle} autoComplete="name"
                    onFocus={e => { e.target.style.borderColor = 'rgba(0,212,255,0.4)'; e.target.style.boxShadow = '0 0 0 4px rgba(0,212,255,0.06)'; e.target.style.background = 'rgba(8,12,26,0.9)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(8,12,26,0.7)'; }}
                  />
                </div>
              )}

              <div>
                <label style={labelStyle}>Email Address</label>
                <input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com" style={inputStyle} autoComplete="email"
                  onFocus={e => { e.target.style.borderColor = 'rgba(0,212,255,0.4)'; e.target.style.boxShadow = '0 0 0 4px rgba(0,212,255,0.06)'; e.target.style.background = 'rgba(8,12,26,0.9)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(8,12,26,0.7)'; }}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <label style={labelStyle}>Password</label>
                <input id="login-password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters" style={inputStyle}
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  onFocus={e => { e.target.style.borderColor = 'rgba(0,212,255,0.4)'; e.target.style.boxShadow = '0 0 0 4px rgba(0,212,255,0.06)'; e.target.style.background = 'rgba(8,12,26,0.9)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(8,12,26,0.7)'; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', bottom: '10px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem', padding: '4px', transition: 'color 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
                >{showPassword ? '👁️' : '🙈'}</button>
              </div>

              {mode === 'register' && (
                <div className="animate-fade-in">
                  <label style={labelStyle}>Confirm Password</label>
                  <input id="register-confirm-password" type={showPassword ? 'text' : 'password'} value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password" style={inputStyle} autoComplete="new-password"
                    onFocus={e => { e.target.style.borderColor = 'rgba(0,212,255,0.4)'; e.target.style.boxShadow = '0 0 0 4px rgba(0,212,255,0.06)'; e.target.style.background = 'rgba(8,12,26,0.9)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(8,12,26,0.7)'; }}
                  />
                </div>
              )}

              {error && (
                <div className="animate-fade-in" style={{
                  background: 'rgba(251,113,133,0.06)', border: '1px solid rgba(251,113,133,0.2)',
                  borderRadius: '12px', padding: '12px 16px', fontSize: '0.83rem', color: 'var(--rose)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  backdropFilter: 'blur(8px)',
                }}>
                  <span>⚠️</span> {error}
                </div>
              )}

              <button id="login-submit" type="submit" disabled={isLoading} className="btn-primary" style={{
                marginTop: '6px', width: '100%', padding: '15px', borderRadius: '14px',
                position: 'relative', overflow: 'hidden',
              }}>
                {isLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '18px', height: '18px', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000', borderRadius: '50%', display: 'inline-block', animation: 'spin-slow 0.8s linear infinite' }} />
                    {mode === 'register' ? 'Creating account...' : 'Signing in...'}
                  </div>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {mode === 'register' ? 'Create Account' : 'Continue to Dashboard'} <span style={{ fontSize: '1.1rem', transition: 'transform 0.2s' }}>→</span>
                  </span>
                )}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
            </div>

            <button id="demo-login" type="button" onClick={handleDemoLogin} disabled={isLoading} style={{
              width: '100%', padding: '14px', borderRadius: '14px', fontWeight: 700,
              fontSize: '0.88rem', fontFamily: 'Inter, sans-serif', cursor: 'pointer',
              color: 'var(--electric)', background: 'rgba(0,212,255,0.05)',
              border: '1px solid rgba(0,212,255,0.15)',
              transition: 'all 0.3s', outline: 'none',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,212,255,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.35)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,212,255,0.05)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.15)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              🚀 Instant Demo Access
            </button>

            <p style={{ marginTop: '20px', fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
              By continuing, you agree to our <span style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>Terms</span> and <span style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
