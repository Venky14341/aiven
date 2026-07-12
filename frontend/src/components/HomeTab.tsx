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

/* ── Strategy Data ── */
interface Allocation {
  name: string;
  pct: number;
  color: string;
}

interface StrategyConfig {
  label: string;
  desc: string;
  allocations: Allocation[];
  estReturn: string;
  riskRating: string;
  recommended: string[];
}

const STRATEGIES: Record<'defensive' | 'balanced' | 'moonshot', StrategyConfig> = {
  defensive: {
    label: 'Defensive Anchor',
    desc: 'Capital preservation focused. Maximizes exposure to gold-chip treasuries and value cash cows.',
    allocations: [
      { name: 'US Treasuries', pct: 40, color: 'var(--gold)' },
      { name: 'Mega Cap Tech', pct: 30, color: 'var(--electric)' },
      { name: 'Dividend Value', pct: 20, color: 'var(--emerald)' },
      { name: 'Hedging Cash', pct: 10, color: 'var(--text-muted)' },
    ],
    estReturn: '4.8% - 6.2%',
    riskRating: 'Low Risk',
    recommended: ['MSFT', 'AAPL', 'JNJ', 'PG'],
  },
  balanced: {
    label: 'AI-Enhanced Growth',
    desc: 'Balanced risk-adjusted returns. Blends growth equities with robust machine-learning signals.',
    allocations: [
      { name: 'AI Growth Stocks', pct: 45, color: 'var(--electric)' },
      { name: 'Global Equities', pct: 25, color: 'var(--emerald)' },
      { name: 'Government Bonds', pct: 20, color: 'var(--gold)' },
      { name: 'Commodities/Gold', pct: 10, color: 'var(--violet)' },
    ],
    estReturn: '9.5% - 12.8%',
    riskRating: 'Medium Risk',
    recommended: ['NVDA', 'AAPL', 'AMZN', 'GOOGL'],
  },
  moonshot: {
    label: 'Alpha Moonshot',
    desc: 'Aggressive portfolio geared towards disruptive AI protocols and early secular transformations.',
    allocations: [
      { name: 'Disruptive Tech', pct: 55, color: 'var(--rose)' },
      { name: 'Web3 / Digital Assets', pct: 25, color: 'var(--violet)' },
      { name: 'AI Scaleups', pct: 15, color: 'var(--electric)' },
      { name: 'Option Collars', pct: 5, color: 'var(--gold)' },
    ],
    estReturn: '18.0% - 24.5%',
    riskRating: 'High Risk',
    recommended: ['NVDA', 'TSLA', 'PLTR', 'COIN'],
  },
};

/* ── Matchup Data ── */
interface VsMetric {
  name: string;
  leftVal: number; // out of 100
  rightVal: number; // out of 100
}

interface MatchupConfig {
  leftName: string;
  rightName: string;
  leftTicker: string;
  rightTicker: string;
  metrics: VsMetric[];
  consensus: string;
}

const MATCHUPS: Record<'nvda_amd' | 'aapl_msft' | 'tsla_byd', MatchupConfig> = {
  nvda_amd: {
    leftName: 'NVIDIA', leftTicker: 'NVDA',
    rightName: 'AMD', rightTicker: 'AMD',
    consensus: 'NVIDIA leads in core datacenter architecture; AMD is catching up via competitive pricing.',
    metrics: [
      { name: 'AI Hardware Moat', leftVal: 96, rightVal: 72 },
      { name: 'Valuation Premium', leftVal: 45, rightVal: 60 },
      { name: 'AI Sentiment Index', leftVal: 92, rightVal: 84 },
      { name: 'Revenue Growth YoY', leftVal: 98, rightVal: 68 },
    ],
  },
  aapl_msft: {
    leftName: 'Apple', leftTicker: 'AAPL',
    rightName: 'Microsoft', rightTicker: 'MSFT',
    consensus: 'Microsoft holds enterprise software AI leads; Apple has edge in edge-AI hardware integration.',
    metrics: [
      { name: 'Enterprise Moat', leftVal: 75, rightVal: 94 },
      { name: 'Cash Reserves Score', leftVal: 95, rightVal: 90 },
      { name: 'AI Growth Trajectory', leftVal: 70, rightVal: 92 },
      { name: 'Consumer Loyalty', leftVal: 98, rightVal: 80 },
    ],
  },
  tsla_byd: {
    leftName: 'Tesla', leftTicker: 'TSLA',
    rightName: 'BYD Co', rightTicker: 'BYD',
    consensus: 'Tesla dominates autonomous network FSD models; BYD excels in high-volume, low-margin battery scale.',
    metrics: [
      { name: 'FSD Autonomy Tech', leftVal: 94, rightVal: 55 },
      { name: 'Production Efficiency', leftVal: 82, rightVal: 90 },
      { name: 'Brand Leverage', leftVal: 95, rightVal: 74 },
      { name: 'Margin Resiliency', leftVal: 65, rightVal: 82 },
    ],
  },
};

/* ── Sentiment Category Data ── */
interface CompassDetail {
  score: number;
  status: string;
  color: string;
  drivers: string[];
}

const COMPASS_SECTIONS: Record<'equities' | 'crypto' | 'macro', CompassDetail> = {
  equities: {
    score: 76,
    status: 'Greed',
    color: 'var(--emerald)',
    drivers: [
      'Strong forward semiconductor earnings',
      'Fed interest rate cut cycles expected',
      'Resilient labor market indices',
    ],
  },
  crypto: {
    score: 62,
    status: 'Mild Greed',
    color: 'var(--violet)',
    drivers: [
      'Stablecoin inflows reach multi-month highs',
      'Halving supply constraints beginning to squeeze',
      'Regulatory compliance policies clarifying',
    ],
  },
  macro: {
    score: 45,
    status: 'Fear',
    color: 'var(--rose)',
    drivers: [
      'Inflation stabilization headwinds',
      'Elevated regional commercial real estate exposure',
      'Global energy freight corridor bottlenecks',
    ],
  },
};

export const HomeTab = ({ userName, onResearch }: HomeTabProps) => {
  const [searchVal, setSearchVal] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Custom states for interactive panels
  const [strategy, setStrategy] = useState<'defensive' | 'balanced' | 'moonshot'>('balanced');
  const [matchup, setMatchup] = useState<'nvda_amd' | 'aapl_msft' | 'tsla_byd'>('nvda_amd');
  const [compassCat, setCompassCat] = useState<'equities' | 'crypto' | 'macro'>('equities');

  // Sector Heatmap selection state
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  // Growth calculator states
  const [calcPrincipal, setCalcPrincipal] = useState(10000);
  const [calcMonthly, setCalcMonthly] = useState(500);
  const [calcYears, setCalcYears] = useState(10);

  // News Verdict states
  const [activeNewsId, setActiveNewsId] = useState<number | null>(null);
  const [verdictLoading, setVerdictLoading] = useState(false);

  // News Items Data
  const NEWS_ITEMS = [
    {
      id: 1,
      time: '20 mins ago',
      source: 'Federal Reserve Board',
      headline: 'Fed Chair Signals Potential Policy Easing in Q4 Citing Balanced Inflation Vectors',
      category: 'Macro Policy',
      verdict: 'BULLISH',
      impactScore: 88,
      action: 'Increase Mega-cap Tech and high-growth allocation. Defensive yields will contract.',
      summary: 'The shift from inflation fears to labor market preservation indicates interest rates have peaked. High-growth sectors like AI infrastructure, software SaaS, and tech small-caps typically outperform during rate-cutting cycles as borrow costs fall.'
    },
    {
      id: 2,
      time: '1 hour ago',
      source: 'Semiconductor Research Group',
      headline: 'Blackwell GPU Chip Allocation Sold Out for Next 12 Months as Datacenter Demand Surges',
      category: 'Tech Hardware',
      verdict: 'STRONG BUY',
      impactScore: 94,
      action: 'Hold NVDA and accumulate key infrastructure suppliers (TSMC, ASML, Vertiv).',
      summary: 'Blackwell architecture orders indicate cloud providers (Microsoft, Google, Meta) are continuing aggressive AI capital expenditures. Capex shows no signs of fatigue, validating compute demand scaling.'
    },
    {
      id: 3,
      time: '3 hours ago',
      source: 'Automotive Intelligence Bureau',
      headline: 'European EV Registrations Contract by 14% YoY in Q2 as Subsidies Phase Out',
      category: 'Automotive',
      verdict: 'BEARISH',
      impactScore: 40,
      action: 'Reduce direct EV automakers; accumulate hybrid supply chains and energy grid shares.',
      summary: 'Consumer resistance remains high due to pricing barriers and grid density challenges. Automakers are cutting margins to defend volume share, impacting auto-industry profitability indices.'
    }
  ];

  // Sector Data
  const SECTOR_DATA = [
    { id: 'tech', name: 'Technology', change: '+2.84%', up: true, leader: 'NVIDIA (NVDA)', cap: '$14.2T', rating: 'Strong Buy', summary: 'AI infrastructure scale-up and semiconductor supply bottlenecks remain highly constructive for enterprise hardware providers.' },
    { id: 'finance', name: 'Financials', change: '+1.12%', up: true, leader: 'JPMorgan (JPM)', cap: '$8.6T', rating: 'Accumulate', summary: 'Expectations of federal rate cuts boost banking loan demand projections and trigger active capital market listings.' },
    { id: 'health', name: 'Healthcare', change: '-0.45%', up: false, leader: 'Eli Lilly (LLY)', cap: '$7.8T', rating: 'Hold', summary: 'Clinical pipeline valuations consolidate, but strong defensive dividends and GLP-1 volume offsets offer balanced equity shelter.' },
    { id: 'energy', name: 'Energy', change: '+1.85%', up: true, leader: 'Exxon Mobil (XOM)', cap: '$4.1T', rating: 'Accumulate', summary: 'Logistics constraints and global supply curbs keep barrel prices stable, returning significant cash to equity holders.' },
    { id: 'consumer', name: 'Consumer Cyclical', change: '-1.15%', up: false, leader: 'Tesla (TSLA)', cap: '$6.5T', rating: 'Underperform', summary: 'Tight macroeconomic credit channels apply compression to consumer automotive sales and luxury retail margins.' },
    { id: 'crypto', name: 'Crypto Assets', change: '+4.25%', up: true, leader: 'Bitcoin (BTC)', cap: '$2.4T', rating: 'Strong Buy', summary: 'Sustained institutional spot demand and regulated product structures channel capital directly into primary digital chains.' }
  ];

  // Compound Interest Calculation
  const calculateGrowth = () => {
    let rate = 0.055;
    if (strategy === 'balanced') rate = 0.1115;
    else if (strategy === 'moonshot') rate = 0.2125;

    const r = rate / 12; // monthly rate
    const n = calcYears * 12; // total months
    
    // P * (1 + r)^n
    const fvPrincipal = calcPrincipal * Math.pow(1 + r, n);
    
    // PMT * [((1 + r)^n - 1) / r] * (1 + r)
    const fvContributions = calcMonthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    
    const totalValue = fvPrincipal + fvContributions;
    const totalInvested = calcPrincipal + (calcMonthly * n);
    const totalReturns = Math.max(0, totalValue - totalInvested);

    return {
      invested: Math.round(totalInvested),
      returns: Math.round(totalReturns),
      total: Math.round(totalValue)
    };
  };

  const calcResults = calculateGrowth();

  const handleVerdictTrigger = (id: number) => {
    setVerdictLoading(true);
    setActiveNewsId(id);
    setTimeout(() => {
      setVerdictLoading(false);
    }, 750);
  };

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

  const curStrat = STRATEGIES[strategy];
  const curMatch = MATCHUPS[matchup];
  const curCompass = COMPASS_SECTIONS[compassCat];

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
              Welcome back, <strong style={{ color: 'var(--text-primary)' }}>{userName}</strong>. InvestIQ integrates real-time equity valuation, analyst consensus, and risk assessment via a collaborative, multi-agent framework powered by Gemini AI.
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
                  onClick={() => onResearch(stock.ticker)}
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

      {/* ═══ INTERACTIVE PORTFOLIO STRATEGY SIMULATOR & COMPASS GAUGE ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', zIndex: 1 }} className="home-hero-grid">
        
        {/* Module A: Strategy Simulator */}
        <section className="glass border-animated" style={{ borderRadius: '24px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div>
            <div className="section-label" style={{ marginBottom: '4px' }}>ALLOCATION ENGINE</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Portfolio Strategy Allocator</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '3px' }}>Simulate asset strategies mapped to target metrics and recommended symbols.</p>
          </div>

          {/* Strategy Tabs */}
          <div style={{ display: 'flex', background: 'rgba(8,12,26,0.6)', borderRadius: '12px', padding: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
            {(['defensive', 'balanced', 'moonshot'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setStrategy(tab)}
                style={{
                  flex: 1, padding: '10px 8px', borderRadius: '8px', border: 'none',
                  fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.25s',
                  background: strategy === tab ? 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(167,139,250,0.1))' : 'transparent',
                  color: strategy === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                }}
              >
                {tab === 'defensive' ? '🛡️ Defensive' : tab === 'balanced' ? '⚖️ Balanced' : '🚀 Moonshot'}
              </button>
            ))}
          </div>

          {/* Active Strategy Output */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>{curStrat.label}</span>
                <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>{curStrat.riskRating}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {curStrat.desc}
              </p>
            </div>

            {/* Segmented allocation bar visual */}
            <div style={{ display: 'flex', height: '14px', borderRadius: '99px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
              {curStrat.allocations.map(al => (
                <div
                  key={al.name}
                  style={{ width: `${al.pct}%`, background: al.color, height: '100%' }}
                  title={`${al.name}: ${al.pct}%`}
                />
              ))}
            </div>

            {/* Legend grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
              {curStrat.allocations.map(al => (
                <div key={al.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: al.color }} />
                  <span style={{ flex: 1 }}>{al.name}</span>
                  <span className="font-mono" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{al.pct}%</span>
                </div>
              ))}
            </div>

            {/* Simulated returns / actions */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)',
              borderRadius: '12px', marginTop: 'auto'
            }}>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>ESTIMATED TARGET RETURNS</div>
                <div className="font-mono text-gradient-electric" style={{ fontSize: '1.15rem', fontWeight: 900, marginTop: '2px' }}>{curStrat.estReturn}</div>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {curStrat.recommended.map(rec => (
                  <button
                    key={rec}
                    onClick={() => onResearch(rec)}
                    style={{
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '6px', padding: '6px 10px', fontSize: '0.7rem', color: 'var(--text-primary)',
                      fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--electric)'; (e.currentTarget as HTMLElement).style.background = 'rgba(0,212,255,0.05)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                  >
                    🔍 {rec}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Module B: Stock Vs Battle Station */}
        <section className="glass border-animated" style={{ borderRadius: '24px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="section-label" style={{ marginBottom: '4px' }}>AI STOCK COMPARE</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>AI Stock Comparison Station</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '3px' }}>Compare key metrics, AI sentiments, and moats side-by-side.</p>
            </div>
          </div>

          {/* Matchup Tabs */}
          <div style={{ display: 'flex', background: 'rgba(8,12,26,0.6)', borderRadius: '12px', padding: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
            {(['nvda_amd', 'aapl_msft', 'tsla_byd'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setMatchup(tab)}
                style={{
                  flex: 1, padding: '10px 6px', borderRadius: '8px', border: 'none',
                  fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.25s',
                  background: matchup === tab ? 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(167,139,250,0.1))' : 'transparent',
                  color: matchup === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                }}
              >
                {tab === 'nvda_amd' ? 'NVDA vs AMD' : tab === 'aapl_msft' ? 'AAPL vs MSFT' : 'TSLA vs BYD'}
              </button>
            ))}
          </div>

          {/* Matchup metrics side by side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
            
            {/* Headers */}
            <div style={{ display: 'flex', justifyItems: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '8px' }}>
              <button onClick={() => onResearch(curMatch.leftTicker)} style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <span className="text-gradient-electric" style={{ fontSize: '1rem', fontWeight: 800 }}>{curMatch.leftName}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '6px' }}>({curMatch.leftTicker})</span>
              </button>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 800, padding: '0 10px' }}>VS</span>
              <button onClick={() => onResearch(curMatch.rightTicker)} style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'right' }}>
                <span className="text-gradient-gold" style={{ fontSize: '1rem', fontWeight: 800 }}>{curMatch.rightName}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '6px' }}>({curMatch.rightTicker})</span>
              </button>
            </div>

            {/* Metrics List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {curMatch.metrics.map(m => (
                <div key={m.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: 600 }}>
                    <span style={{ color: 'var(--emerald)', fontFamily: 'JetBrains Mono, monospace' }}>{m.leftVal}%</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{m.name}</span>
                    <span style={{ color: 'var(--gold)', fontFamily: 'JetBrains Mono, monospace' }}>{m.rightVal}%</span>
                  </div>
                  
                  {/* Segmented slider gauge */}
                  <div style={{ display: 'flex', gap: '4px', height: '6px' }}>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '4px', overflow: 'hidden', display: 'flex', justifyContent: 'flex-end' }}>
                      <div style={{ width: `${m.leftVal}%`, background: 'linear-gradient(90deg, transparent, var(--electric))', height: '100%', borderRadius: '4px' }} />
                    </div>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${m.rightVal}%`, background: 'linear-gradient(90deg, var(--gold), transparent)', height: '100%', borderRadius: '4px' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI consensus */}
            <div style={{
              background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '12px 14px', fontSize: '0.74rem', color: 'var(--text-secondary)',
              lineHeight: 1.5, marginTop: 'auto'
            }}>
              💡 <strong style={{ color: 'var(--text-primary)' }}>AI Analyst Consensus:</strong> {curMatch.consensus}
            </div>

          </div>
        </section>

      </div>

      {/* ═══ AI MARKET SENTIMENT HUB & COMPASS ═══ */}
      <section className="glass animate-card-entrance" style={{ borderRadius: '24px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px', zIndex: 1 }}>
        
        {/* Header with Compass tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '16px' }}>
          <div>
            <div className="section-label" style={{ marginBottom: '4px' }}>SENTIMENT ENGINE</div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Global AI Sentiment Compass</h3>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(8,12,26,0.6)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
            {(['equities', 'crypto', 'macro'] as const).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCompassCat(cat)}
                style={{
                  padding: '6px 12px', borderRadius: '8px', border: 'none',
                  fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                  background: compassCat === cat ? 'rgba(255,255,255,0.04)' : 'transparent',
                  color: compassCat === cat ? 'var(--text-primary)' : 'var(--text-muted)'
                }}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Compass main display grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '30px', alignItems: 'center' }} className="home-hero-grid">
          
          {/* Left panel: Compass dial */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '10px' }}>
            
            {/* Round dial SVG gauge */}
            <svg width="220" height="220" viewBox="0 0 200 200">
              {/* Dial Arc Background */}
              <path
                d="M 40,160 A 75,75 0 1,1 160,160"
                fill="none"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* Dial Active Arc */}
              <path
                d="M 40,160 A 75,75 0 1,1 160,160"
                fill="none"
                stroke={curCompass.color}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="360"
                strokeDashoffset={360 - (360 * curCompass.score) / 100}
                style={{ transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s' }}
              />
              
              {/* Center pointer needle pin */}
              <circle cx="100" cy="100" r="8" fill="var(--text-primary)" />
              {/* Pointer needle line */}
              <line
                x1="100" y1="100"
                x2="100" y2="40"
                stroke="var(--text-primary)"
                strokeWidth="3"
                strokeLinecap="round"
                transform={`rotate(${(curCompass.score / 100) * 240 - 120} 100 100)`}
                style={{ transformOrigin: '100px 100px', transition: 'transform 1s cubic-bezier(0.25, 1, 0.5, 1)' }}
              />
            </svg>

            {/* Text Overlay in Dial Center */}
            <div style={{ position: 'absolute', bottom: '26px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>{curCompass.score}</span>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: curCompass.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>
                {curCompass.status}
              </span>
            </div>
          </div>

          {/* Right panel: Sentiment details and positive/negative cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)' }}>Key Market Drivers</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                InvestIQ sentiment classifiers derived these key drivers within the last 2 hours.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {curCompass.drivers.map((drv) => (
                <div key={drv} style={{
                  display: 'flex', gap: '10px', alignItems: 'center', padding: '12px 16px',
                  background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)',
                  borderRadius: '12px', fontSize: '0.78rem', color: 'var(--text-secondary)'
                }}>
                  <span style={{ color: curCompass.color }}>✔</span>
                  <span>{drv}</span>
                </div>
              ))}
            </div>

            {/* Sentiment Headline Highlights slider */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginTop: '6px' }}>
              {sentimentHighlights.slice(0, 2).map((item, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)',
                  borderRadius: '14px', padding: '14px', display: 'flex', gap: '10px'
                }}>
                  <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                  <div>
                    <h5 style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.4 }}>{item.title}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
            
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>InvestIQ Multi-Agent Pipeline</h3>
            <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              InvestIQ distributes search prompts to three autonomous expert sub-agents. These agents gather disparate intelligence streams and compile a unified investment report:
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
