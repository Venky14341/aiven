import { useState, useEffect } from 'react';
import dashboardPreview from '../assets/images/dashboard_preview.png';
import aiAnalysis from '../assets/images/ai_analysis.png';

interface HomeTabProps {
  userName: string;
  onResearch: (company: string) => void;
}

interface MarketClock {
  name: string;
  city: string;
  timezone: string;
  utcOffset: number; // offset in hours relative to UTC
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

export const HomeTab = ({ userName, onResearch }: HomeTabProps) => {
  const [searchVal, setSearchVal] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const quickWatchlist = [
    { name: 'NVIDIA', ticker: 'NVDA', icon: '🧠', color: 'var(--emerald)' },
    { name: 'Apple', ticker: 'AAPL', icon: '🍎', color: 'var(--electric)' },
    { name: 'Tesla', ticker: 'TSLA', icon: '⚡', color: 'var(--rose)' },
    { name: 'Microsoft', ticker: 'MSFT', icon: '💻', color: 'var(--violet)' },
    { name: 'Infosys', ticker: 'INFY', icon: '🌏', color: 'var(--gold)' },
  ];

  const sentimentHighlights = [
    { title: 'AI Infrastructure demand remains at an all-time high, led by Blackwell scale-ups.', type: 'positive', icon: '🔥' },
    { title: 'Treasury yields stabilize as inflation reports align with long-term forecasts.', type: 'neutral', icon: '📊' },
    { title: 'Supply chain headwinds signal margin pressure for automotive and consumer electronics.', type: 'negative', icon: '⚠️' }
  ];

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Welcome Banner */}
      <section className="glass" style={{ borderRadius: '24px', padding: '32px', position: 'relative', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="badge badge-gold" style={{ alignSelf: 'flex-start' }}>✦ Welcome Back, {userName}</div>
            <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', lineHeight: 1.2, color: 'var(--text-primary)' }}>
              Explore the financial world with <span className="text-gradient-electric">Aivenky Nova</span>
            </h1>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Get instant, institutional-grade equity analysis reports. Search a company below to activate Gemini AI agents and analyze fundamentals, market sentiments, and risk vectors in seconds.
            </p>
            
            {/* Embedded Search Form */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', marginTop: '8px', maxWidth: '480px' }}>
              <input
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search ticker or company (e.g. NVIDIA)..."
                className="input-field"
                style={{ flex: 1, padding: '12px 16px', fontSize: '0.85rem' }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '12px 20px', fontSize: '0.85rem', whiteSpace: 'nowrap' }} disabled={searchVal.trim().length < 2}>
                Analyze Stock
              </button>
            </form>
          </div>
          
          {/* Beautiful generated mock dashboard image */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '100%', maxWidth: '380px', borderRadius: '16px', overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.08)',
              background: 'var(--surface-3)', transition: 'transform 0.3s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.02) translateY(-4px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1) translateY(0)'; }}
            >
              <img
                src={dashboardPreview}
                alt="Aivenky Nova Dashboard Preview"
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Clocks & Watchlist Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Global Market Status Clocks */}
        <section className="glass" style={{ borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div className="section-label" style={{ marginBottom: '4px' }}>Global Exchanges</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Market Status Clocks</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {MARKET_CLOCKS.map(market => {
              const marketTime = getMarketTime(market.utcOffset);
              const isOpen = checkMarketOpen(market, marketTime);
              const formattedTime = marketTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
              
              return (
                <div key={market.name} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', background: 'var(--surface-1)', border: '1px solid var(--border)',
                  borderRadius: '12px', transition: 'border-color 0.2s'
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isOpen ? 'var(--emerald)' : 'var(--rose)', boxShadow: `0 0 10px ${isOpen ? 'var(--emerald)' : 'var(--rose)'}` }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{market.name} <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>({market.city})</span></div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Hours: {market.openHour.toString().padStart(2, '0')}:{market.openMinute.toString().padStart(2, '0')} - {market.closeHour.toString().padStart(2, '0')}:{market.closeMinute.toString().padStart(2, '0')} {market.timezone}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>{formattedTime}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: isOpen ? 'var(--emerald)' : 'var(--rose)', textTransform: 'uppercase', marginTop: '2px' }}>{isOpen ? 'Open' : 'Closed'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Watchlist Shortcuts */}
        <section className="glass" style={{ borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div className="section-label" style={{ marginBottom: '4px' }}>Top Instruments</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Featured watchlist</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {quickWatchlist.map(stock => (
              <button
                key={stock.name}
                type="button"
                onClick={() => onResearch(stock.name)}
                className="glass border-animated"
                style={{
                  display: 'flex', alignItems: 'center', justifyItems: 'space-between', width: '100%',
                  padding: '12px 16px', background: 'var(--surface-1)', border: '1px solid var(--border)',
                  borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter, sans-serif',
                  transition: 'transform 0.2s, border-color 0.2s', outline: 'none'
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)'; (e.currentTarget as HTMLElement).style.borderColor = `${stock.color}40`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(0)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px', background: `${stock.color}15`,
                    border: `1px solid ${stock.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem'
                  }}>{stock.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stock.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Ticker: {stock.ticker}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: stock.color }}>Research →</div>
              </button>
            ))}
          </div>
        </section>

      </div>

      {/* Market Sentiment Digest */}
      <section className="glass" style={{ borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <div className="section-label" style={{ marginBottom: '4px' }}>AI Digest</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Market Sentiment Headlines</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {sentimentHighlights.map((item, idx) => {
            const badgeColor = item.type === 'positive' ? 'var(--emerald)' : item.type === 'negative' ? 'var(--rose)' : 'var(--text-secondary)';
            return (
              <div key={idx} style={{
                background: 'var(--surface-1)', border: '1px solid var(--border)',
                borderRadius: '14px', padding: '16px', display: 'flex', gap: '12px',
                transition: 'border-color 0.2s'
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
              >
                <div style={{ fontSize: '1.4rem', marginTop: '2px' }}>{item.icon}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ alignSelf: 'flex-start', fontSize: '0.62rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: `${badgeColor}15`, color: badgeColor, border: `1px solid ${badgeColor}30`, textTransform: 'uppercase' }}>
                    {item.type}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Nova Intelligence Grid (AI Agents flow) */}
      <section className="glass" style={{ borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="badge badge-electric">🧠 Multi-Agent Flow</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Nova AI Agent Network</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Aivenky Nova employs a synchronized network of three specialized AI agents to generate deep reports:
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.2rem', padding: '4px', borderRadius: '6px', background: 'rgba(52,211,153,0.1)', color: 'var(--emerald)', flexShrink: 0 }}>📈</span>
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700 }}>Fundamental Analysis Agent</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Scans balance sheets, income statements, margins, and valuation metrics.</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.2rem', padding: '4px', borderRadius: '6px', background: 'rgba(167,139,250,0.1)', color: 'var(--violet)', flexShrink: 0 }}>💬</span>
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700 }}>Market Sentiment Agent</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Gathers financial news, social momentum, and analyst consensus ratings.</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.2rem', padding: '4px', borderRadius: '6px', background: 'rgba(251,113,133,0.1)', color: 'var(--rose)', flexShrink: 0 }}>⚡</span>
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700 }}>Risk Evaluation Agent</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Identifies regulatory threats, market saturation, and operational hurdles.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '100%', maxWidth: '420px', borderRadius: '16px', overflow: 'hidden',
              boxShadow: '0 12px 32px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.06)',
              background: 'var(--surface-3)', transition: 'transform 0.3s'
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.01) translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1) translateY(0)'; }}
            >
              <img
                src={aiAnalysis}
                alt="Nova AI Agent Analysis flow diagram"
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />
            </div>
          </div>
          
        </div>
      </section>

    </div>
  );
};
