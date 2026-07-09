import { useState, useEffect, useRef } from 'react';
import homeHero from '../assets/images/home_hero.png';
import aiAnalysis from '../assets/images/ai_analysis.png';

interface HomeTabProps {
  userName: string;
  onResearch: (company: string) => void;
}

interface MarketClock {
  name: string;
  city: string;
  timezone: string;
  utcOffset: number;
  openHour: number;
  openMinute: number;
  closeHour: number;
  closeMinute: number;
}

const MARKET_CLOCKS: MarketClock[] = [
  { name: 'NYSE',   city: 'New York', timezone: 'EDT', utcOffset: -4,   openHour: 9, openMinute: 30, closeHour: 16, closeMinute: 0 },
  { name: 'LSE',    city: 'London',   timezone: 'BST', utcOffset: 1,    openHour: 8, openMinute: 0,  closeHour: 16, closeMinute: 30 },
  { name: 'TSE',    city: 'Tokyo',    timezone: 'JST', utcOffset: 9,    openHour: 9, openMinute: 0,  closeHour: 15, closeMinute: 0 },
  { name: 'NSE',    city: 'Mumbai',   timezone: 'IST', utcOffset: 5.5,  openHour: 9, openMinute: 15, closeHour: 15, closeMinute: 30 },
];

const TICKER_ITEMS = [
  { symbol: 'AAPL', price: '$189.84', change: '+1.45%', up: true },
  { symbol: 'MSFT', price: '$415.50', change: '+0.88%', up: true },
  { symbol: 'NVDA', price: '$905.12', change: '+4.12%', up: true },
  { symbol: 'TSLA', price: '$175.34', change: '-1.20%', up: false },
  { symbol: 'AMZN', price: '$178.15', change: '+2.10%', up: true },
  { symbol: 'META', price: '$502.30', change: '-0.45%', up: false },
  { symbol: 'GOOGL', price: '$151.60', change: '+1.15%', up: true },
  { symbol: 'INFY', price: '$18.45', change: '-0.30%', up: false },
];

export const HomeTab = ({ userName, onResearch }: HomeTabProps) => {
  const [searchVal, setSearchVal] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [typingIndex, setTypingIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const heroCardRef = useRef<HTMLDivElement>(null);

  const searchPlaceholders = [
    'NVIDIA...',
    'Apple (AAPL)...',
    'Tesla Motors...',
    'Microsoft (MSFT)...',
    'Infosys (INFY)...',
  ];

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Typewriter effect for search label helper
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const currentFull = searchPlaceholders[typingIndex];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setTypedText(prev => prev.slice(0, -1));
        if (typedText === '') {
          setIsDeleting(false);
          setTypingIndex(prev => (prev + 1) % searchPlaceholders.length);
        }
      }, 50);
    } else {
      timer = setTimeout(() => {
        setTypedText(currentFull.slice(0, typedText.length + 1));
        if (typedText === currentFull) {
          timer = setTimeout(() => setIsDeleting(true), 2500);
        }
      }, 100);
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, typingIndex]);

  const getMarketTime = (offset: number) => {
    const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
    return new Date(utc + 3600000 * offset);
  };

  const checkMarketOpen = (market: MarketClock, time: Date) => {
    const day = time.getDay();
    if (day === 0 || day === 6) return false;

    const hours = time.getHours();
    const minutes = time.getMinutes();

    const currentInMins = hours * 60 + minutes;
    const openInMins = market.openHour * 60 + market.openMinute;
    const closeInMins = market.closeHour * 60 + market.closeMinute;

    return currentInMins >= openInMins && currentInMins < closeInMins;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim().length >= 2) {
      onResearch(searchVal.trim());
    }
  };

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroCardRef.current.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  };

  const handleHeroMouseLeave = () => {
    if (heroCardRef.current) {
      heroCardRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
    }
  };

  const quickWatchlist = [
    { name: 'NVIDIA Corp', ticker: 'NVDA', icon: '🧠', color: 'var(--emerald)', price: '$905.12', change: '+4.12%' },
    { name: 'Apple Inc.', ticker: 'AAPL', icon: '🍎', color: 'var(--electric)', price: '$189.84', change: '+1.45%' },
    { name: 'Tesla Inc.', ticker: 'TSLA', icon: '⚡', color: 'var(--rose)', price: '$175.34', change: '-1.20%' },
    { name: 'Microsoft', ticker: 'MSFT', icon: '💻', color: 'var(--violet)', price: '$415.50', change: '+0.88%' },
    { name: 'Infosys Ltd', ticker: 'INFY', icon: '🌏', color: 'var(--gold)', price: '$18.45', change: '-0.30%' },
  ];

  const sentimentHighlights = [
    { title: 'AI Infrastructure demand remains at an all-time high, led by Blackwell scale-ups.', type: 'bullish', icon: '🔥', detail: 'NVIDIA and tech supply chains see massive orders.' },
    { title: 'Treasury yields stabilize as inflation reports align with long-term forecasts.', type: 'neutral', icon: '📊', detail: 'Consensus builds around Fed easing rates late Q3.' },
    { title: 'Supply chain headwinds signal margin pressure for automotive and consumer electronics.', type: 'bearish', icon: '⚠️', detail: 'Higher container freight rates impacting input costs.' }
  ];

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '36px', position: 'relative' }}>
      
      {/* ── BACKGROUND GLOW DECORATIONS ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 75%)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '-5%', width: '450px', height: '450px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 75%)' }} />
      </div>

      {/* ═══ LIVE TICKER TAPE BANNER ═══ */}
      <section style={{
        margin: '0 -24px', background: 'rgba(2,3,15,0.8)', borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '10px 0', overflow: 'hidden',
        backdropFilter: 'blur(10px)', zIndex: 2, position: 'relative'
      }}>
        <div className="ticker-tape">
          {/* Double items for continuous infinite scrolling */}
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
            <div key={index} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '0 16px' }}>
              <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.82rem' }}>{item.symbol}</span>
              <span className="font-mono" style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{item.price}</span>
              <span className="badge" style={{
                background: item.up ? 'rgba(52,211,153,0.1)' : 'rgba(251,113,133,0.1)',
                color: item.up ? 'var(--emerald)' : 'var(--rose)',
                padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700
              }}>
                {item.up ? '▲' : '▼'} {item.change}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ WELCOME & AI SEARCH STATION ═══ */}
      <section className="glass animate-card-entrance" style={{
        borderRadius: '28px', padding: '40px', position: 'relative', overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 50px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
        zIndex: 1
      }}>
        {/* Animated gradient top edge */}
        <div className="gradient-mesh-bg" style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
          background: 'linear-gradient(90deg, var(--gold), var(--electric), var(--violet), var(--gold))',
          backgroundSize: '400% 100%'
        }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '40px', alignItems: 'center' }} className="home-hero-grid">
          
          {/* Left panel: Info & search */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div className="badge badge-gold" style={{ alignSelf: 'flex-start', padding: '6px 16px', letterSpacing: '0.12em' }}>
              ✦ ACTIVE INTELLIGENCE TERMINAL
            </div>
            
            <h1 className="font-display animate-hero-slide" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', lineHeight: 1.1, color: 'var(--text-primary)' }}>
              Decentralized Equity <br />
              <span className="text-gradient-electric">Research System</span>
            </h1>
            
            <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '560px' }}>
              Welcome back, <strong style={{ color: 'var(--text-primary)' }}>{userName}</strong>. Nova integrates real-time equity valuation, analyst consensus, and risk assessment via a collaborative, multi-agent framework powered by Gemini AI.
            </p>

            {/* Glowing Search Bar */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '520px', marginTop: '10px' }}>
              <form onSubmit={handleSearchSubmit} style={{
                display: 'flex', gap: '10px', background: 'rgba(8, 12, 26, 0.9)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '6px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(0,212,255,0.03)',
                transition: 'all 0.3s'
              }}
                onFocusCapture={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)'; e.currentTarget.style.boxShadow = '0 10px 35px rgba(0,212,255,0.08)'; }}
                onBlurCapture={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '14px', color: 'var(--text-muted)' }}>
                  🔍
                </div>
                <input
                  type="text"
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder={`Try searching `}
                  className="input-field"
                  style={{
                    flex: 1, border: 'none', background: 'transparent', padding: '12px 6px',
                    fontSize: '0.9rem', color: 'var(--text-primary)', outline: 'none', boxShadow: 'none'
                  }}
                />
                
                {/* Floating Typing Helper inside input */}
                {searchVal === '' && (
                  <span style={{
                    position: 'absolute', left: '138px', top: '19px',
                    fontSize: '0.9rem', color: 'var(--text-muted)', pointerEvents: 'none',
                    opacity: 0.65
                  }}>
                    {typedText}<span className="typing-cursor" />
                  </span>
                )}

                <button type="submit" className="btn-primary" style={{
                  padding: '0 24px', borderRadius: '14px', fontSize: '0.85rem',
                  fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 8px 20px rgba(0,212,255,0.2)'
                }} disabled={searchVal.trim().length < 2}>
                  Synthesize AI Report
                </button>
              </form>
            </div>

            {/* Quick tags below search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>POPULAR COMMANDS:</span>
              {['NVDA', 'AAPL', 'TSLA', 'MSFT'].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onResearch(tag)}
                  style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '8px', padding: '4px 10px', fontSize: '0.72rem', color: 'var(--text-secondary)',
                    fontWeight: 700, cursor: 'pointer', transition: 'all 0.25s'
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,212,255,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.25)'; (e.currentTarget as HTMLElement).style.color = 'var(--electric)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
                >
                  {tag}
                </button>
              ))}
            </div>

          </div>

          {/* Right panel: Futuristic perspective home hero image */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              ref={heroCardRef}
              onMouseMove={handleHeroMouseMove}
              onMouseLeave={handleHeroMouseLeave}
              style={{
                width: '100%', maxWidth: '420px', borderRadius: '22px', overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(0,212,255,0.1)',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'var(--surface-3)', transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                transformStyle: 'preserve-3d', willChange: 'transform'
              }}
            >
              <img
                src={homeHero}
                alt="Nova AI Intelligence Dashboard"
                style={{ width: '100%', height: 'auto', display: 'block', transform: 'translateZ(20px) scale(0.98)' }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* ═══ CLOCKS & WATCHLIST PANELS ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '30px', zIndex: 1 }}>
        
        {/* Global Market Status Clocks */}
        <section className="glass border-animated" style={{ borderRadius: '24px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="section-label" style={{ marginBottom: '4px' }}>EXCHANGE HUBS</div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Market Status Clocks</h3>
            </div>
            <div style={{
              fontSize: '0.65rem', background: 'rgba(0,212,255,0.05)', color: 'var(--electric)',
              border: '1px solid rgba(0,212,255,0.2)', padding: '4px 10px', borderRadius: '8px',
              fontWeight: 700, textTransform: 'uppercase'
            }}>
              ● Realtime Sync
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {MARKET_CLOCKS.map((market) => {
              const marketTime = getMarketTime(market.utcOffset);
              const isOpen = checkMarketOpen(market, marketTime);
              const formattedTime = marketTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
              
              return (
                <div key={market.name} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)',
                  borderRadius: '16px', transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                  position: 'relative', overflow: 'hidden'
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.01)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {/* Pulsing indicator */}
                    <div className="live-pulse" style={{
                      width: '10px', height: '10px', borderRadius: '50%',
                      background: isOpen ? 'var(--emerald)' : 'var(--rose)',
                      boxShadow: `0 0 12px ${isOpen ? 'var(--emerald)' : 'var(--rose)'}`
                    }} />
                    
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {market.name} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>({market.city})</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                        Hours: {market.openHour.toString().padStart(2, '0')}:{market.openMinute.toString().padStart(2, '0')} - {market.closeHour.toString().padStart(2, '0')}:{market.closeMinute.toString().padStart(2, '0')} {market.timezone}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
                      {formattedTime}
                    </div>
                    <div style={{
                      fontSize: '0.7rem', fontWeight: 700,
                      color: isOpen ? 'var(--emerald)' : 'var(--rose)',
                      textTransform: 'uppercase', marginTop: '3px', letterSpacing: '0.05em'
                    }}>
                      {isOpen ? 'Open' : 'Closed'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Watchlist Shortcuts Terminal */}
        <section className="glass border-animated" style={{ borderRadius: '24px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div className="section-label" style={{ marginBottom: '4px' }}>PORTFOLIO SIGNALS</div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Featured Watchlist</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {quickWatchlist.map((stock) => {
              const isUp = stock.change.startsWith('+');
              return (
                <button
                  key={stock.name}
                  type="button"
                  onClick={() => onResearch(stock.name)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                    padding: '14px 18px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)',
                    borderRadius: '16px', cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)', outline: 'none'
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateX(6px)';
                    (e.currentTarget as HTMLElement).style.borderColor = `${stock.color}45`;
                    (e.currentTarget as HTMLElement).style.background = `${stock.color}05`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.01)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px', background: `${stock.color}15`,
                      border: `1px solid ${stock.color}25`, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '1.1rem'
                    }}>{stock.icon}</div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stock.ticker}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{stock.name}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stock.price}</div>
                      <div className="font-mono" style={{ fontSize: '0.72rem', fontWeight: 700, color: isUp ? 'var(--emerald)' : 'var(--rose)' }}>{stock.change}</div>
                    </div>
                    <div style={{
                      fontSize: '0.95rem', color: stock.color, opacity: 0.7,
                      transition: 'transform 0.2s'
                    }} className="arrow-hover">→</div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

      </div>

      {/* ═══ AI MARKET SENTIMENT HUB ═══ */}
      <section className="glass animate-card-entrance" style={{ borderRadius: '24px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div className="section-label" style={{ marginBottom: '4px' }}>SENTIMENT ENGINE</div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Global AI Sentiment Digest</h3>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>OVERALL SCORE:</span>
            <span className="badge badge-emerald" style={{ padding: '6px 14px', letterSpacing: '0.05em' }}>🟢 76 - BULLISH</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {sentimentHighlights.map((item) => {
            const badgeColor = item.type === 'bullish' ? 'var(--emerald)' : item.type === 'bearish' ? 'var(--rose)' : 'var(--text-secondary)';
            return (
              <div key={item.title} className="heatmap-card" style={{
                background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)',
                borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column',
                gap: '12px', transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                position: 'relative'
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.borderColor = `${badgeColor}30`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 30px rgba(0,0,0,0.5), 0 0 25px ${badgeColor}05`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.6rem' }}>{item.icon}</span>
                  <span className="badge" style={{
                    background: `${badgeColor}15`, color: badgeColor,
                    border: `1px solid ${badgeColor}25`, fontSize: '0.68rem', letterSpacing: '0.08em'
                  }}>
                    {item.type}
                  </span>
                </div>
                
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {item.title}
                </h4>
                
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px' }}>
                  {item.detail}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ MULTI-AGENT NETWORK CONTROL ROOM ═══ */}
      <section className="glass animate-card-entrance" style={{
        borderRadius: '24px', padding: '36px', display: 'flex', flexDirection: 'column',
        gap: '24px', border: '1px solid var(--border)', zIndex: 1
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '40px', alignItems: 'center' }} className="home-hero-grid">
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="badge badge-violet" style={{ alignSelf: 'flex-start', padding: '6px 14px' }}>
              ⚙️ OPERATIONAL ARCHITECTURE
            </div>
            
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>Nova Multi-Agent Pipeline</h3>
            <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Aivenky Nova distributes search prompts to three autonomous expert sub-agents. These agents gather disparate intelligence streams and compile a unified investment report:
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  fontSize: '1.25rem', padding: '10px', borderRadius: '12px',
                  background: 'rgba(52,211,153,0.1)', color: 'var(--emerald)', border: '1px solid rgba(52,211,153,0.15)',
                  flexShrink: 0
                }}>📈</div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>Fundamental Analyzer Agent</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '2px' }}>
                    Extracts raw financials from filings, calculates gross margins, valuation multiples, and projects capital health.
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  fontSize: '1.25rem', padding: '10px', borderRadius: '12px',
                  background: 'rgba(167,139,250,0.1)', color: 'var(--violet)', border: '1px solid rgba(167,139,250,0.15)',
                  flexShrink: 0
                }}>💬</div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>Market Sentiment Agent</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '2px' }}>
                    Leverages LangChain to scrape analyst blogs, news portals, and index boards to output a real-time consensus gauge.
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  fontSize: '1.25rem', padding: '10px', borderRadius: '12px',
                  background: 'rgba(251,113,133,0.1)', color: 'var(--rose)', border: '1px solid rgba(251,113,133,0.15)',
                  flexShrink: 0
                }}>🛡️</div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>Risk Mitigation Agent</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '2px' }}>
                    Calculates macroeconomic headwinds, competitive barriers, regulatory bottlenecks, and assigns hazard indices.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Animated Analysis Image frame */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '100%', maxWidth: '440px', borderRadius: '20px', overflow: 'hidden',
              boxShadow: '0 20px 45px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.06)',
              background: 'var(--surface-3)', transition: 'all 0.35s'
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.02) translateY(-4px)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(167,139,250,0.3)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1) translateY(0)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}
            >
              <img
                src={aiAnalysis}
                alt="Nova AI Agent Analysis Pipeline flow"
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />
            </div>
          </div>
          
        </div>
      </section>

    </div>
  );
};
