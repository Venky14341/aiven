import { useRef, useState, useEffect } from 'react';
import { LoadingState } from './components/LoadingState';
import { ReportDashboard } from './components/ReportDashboard';
import { SearchBar } from './components/SearchBar';
import { LoginPage } from './components/LoginPage';
import { getReport, submitResearch } from './services/api';
import { ResearchReport } from './types';
import { HomeTab } from './components/HomeTab';
import { LogoutPage } from './components/LogoutPage';
import { MarketDetailsModal } from './components/MarketDetailsModal';
import { authService } from './services/authService';
import { EducationTab } from './components/EducationTab';
import marketTrends from './assets/images/market_trends.png';

const sectionItems = [
  { id: 'overview',       label: 'Overview',       emoji: '🏢' },
  { id: 'financials',     label: 'Financials',     emoji: '📊' },
  { id: 'sentiment',      label: 'Sentiment',      emoji: '🧠' },
  { id: 'risks',          label: 'Risks',          emoji: '⚡' },
  { id: 'recommendation', label: 'Recommendation', emoji: '🎯' },
] as const;

type SectionId = (typeof sectionItems)[number]['id'];
type NavTab = 'home' | 'research' | 'portfolio' | 'markets' | 'insights' | 'academy' | 'profile' | 'settings' | 'privacy' | 'terms' | 'disclaimer' | 'contact';

interface Toast { id: number; message: string; type: 'info' | 'success' | 'warn' }

const stats = [
  { label: 'AI Model',      value: 'Gemini',  icon: '🤖' },
  { label: 'Avg Response',  value: '~8s',     icon: '⚡' },
  { label: 'Data Points',   value: '50+',     icon: '📊' },
  { label: 'Decisions',     value: '5 types', icon: '🎯' },
];

const featureCards = [
  { icon: '📈', title: 'Financial Analysis', desc: 'Revenue, margins, business model & scalability.', color: 'var(--emerald)', demo: 'Apple'   },
  { icon: '🧠', title: 'Market Sentiment',   desc: 'News, trends, investor pulse & signals.',         color: 'var(--violet)',  demo: 'NVIDIA'  },
  { icon: '⚡', title: 'Risk Signals',       desc: 'Regulatory, market & operational risk mapping.',  color: 'var(--rose)',    demo: 'Tesla'   },
  { icon: '🎯', title: 'Clear Decision',     desc: 'Buy / Hold / Sell with full confidence score.',   color: 'var(--gold)',    demo: 'Infosys' },
];

const portfolioCompanies = ['Apple', 'Microsoft', 'NVIDIA', 'Tesla', 'Infosys'];

const sectorPerformance = [
  { sector: 'Technology', change: '+2.84%', up: true, score: 92, cap: '$14.2T' },
  { sector: 'Financials', change: '+1.12%', up: true, score: 75, cap: '$8.6T' },
  { sector: 'Healthcare', change: '-0.45%', up: false, score: 62, cap: '$7.8T' },
  { sector: 'Energy', change: '+1.85%', up: true, score: 80, cap: '$4.1T' },
  { sector: 'Consumer Cyclical', change: '-1.15%', up: false, score: 55, cap: '$6.5T' },
  { sector: 'Industrials', change: '+0.34%', up: true, score: 68, cap: '$5.2T' },
  { sector: 'Real Estate', change: '-2.10%', up: false, score: 40, cap: '$2.9T' },
  { sector: 'Crypto Assets', change: '+4.25%', up: true, score: 88, cap: '$2.4T' },
  { sector: 'Forex Majors', change: '+0.12%', up: true, score: 70, cap: 'N/A' },
];

export interface MarketAsset {
  name: string;
  value: string;
  change: string;
  up: boolean;
  ticker: string;
  category: 'Indices' | 'Stocks' | 'Crypto' | 'Forex' | 'Commodities';
  exchange: 'NYSE' | 'LSE' | 'TSE' | 'NSE' | '24/7' | '24/5';
  sparkline?: number[];
}

const initialMarketAssets: MarketAsset[] = [
  // Indices (11 symbols)
  { name: 'S&P 500', value: '5,432.61', change: '+0.87%', up: true, ticker: 'SPX', category: 'Indices', exchange: 'NYSE', sparkline: [45, 48, 52, 50, 55, 58, 56, 62, 65, 70] },
  { name: 'NASDAQ', value: '17,891.43', change: '+1.24%', up: true, ticker: 'IXIC', category: 'Indices', exchange: 'NYSE', sparkline: [40, 45, 42, 50, 55, 52, 58, 62, 65, 72] },
  { name: 'DOW', value: '38,748.90', change: '+0.51%', up: true, ticker: 'DJI', category: 'Indices', exchange: 'NYSE', sparkline: [50, 52, 51, 54, 56, 55, 58, 60, 59, 63] },
  { name: 'NIFTY 50', value: '24,523.15', change: '-0.32%', up: false, ticker: 'NSEI', category: 'Indices', exchange: 'NSE', sparkline: [60, 58, 55, 57, 52, 54, 48, 45, 46, 42] },
  { name: 'FTSE 100', value: '8,142.50', change: '+0.45%', up: true, ticker: 'FTSE', category: 'Indices', exchange: 'LSE', sparkline: [48, 50, 49, 52, 51, 53, 52, 55, 56, 58] },
  { name: 'Nikkei 225', value: '38,210.00', change: '-0.78%', up: false, ticker: 'N225', category: 'Indices', exchange: 'TSE', sparkline: [55, 52, 54, 48, 46, 49, 44, 42, 45, 38] },
  { name: 'DAX 40', value: '18,120.40', change: '+0.62%', up: true, ticker: 'GDAXI', category: 'Indices', exchange: 'LSE', sparkline: [52, 54, 53, 56, 58, 55, 57, 59, 60, 62] },
  { name: 'CAC 40', value: '7,624.50', change: '+0.58%', up: true, ticker: 'FCHI', category: 'Indices', exchange: 'LSE', sparkline: [50, 52, 51, 54, 55, 53, 56, 58, 57, 60] },
  { name: 'Hang Seng', value: '17,820.30', change: '-1.12%', up: false, ticker: 'HSI', category: 'Indices', exchange: 'TSE', sparkline: [48, 45, 46, 42, 38, 40, 35, 32, 34, 30] },
  { name: 'ASX 200', value: '7,812.90', change: '+0.34%', up: true, ticker: 'AXJO', category: 'Indices', exchange: 'TSE', sparkline: [42, 45, 43, 46, 48, 45, 47, 49, 48, 52] },
  { name: 'Euro Stoxx 50', value: '4,952.10', change: '+0.40%', up: true, ticker: 'STOXX50E', category: 'Indices', exchange: 'LSE', sparkline: [46, 48, 47, 50, 52, 49, 51, 53, 52, 55] },

  // Stocks (17 symbols)
  { name: 'NVIDIA', value: '128.20', change: '+3.85%', up: true, ticker: 'NVDA', category: 'Stocks', exchange: 'NYSE', sparkline: [35, 42, 38, 48, 45, 55, 52, 62, 60, 72] },
  { name: 'Apple', value: '210.62', change: '+1.42%', up: true, ticker: 'AAPL', category: 'Stocks', exchange: 'NYSE', sparkline: [45, 48, 47, 52, 50, 54, 53, 58, 57, 62] },
  { name: 'Microsoft', value: '415.80', change: '+0.65%', up: true, ticker: 'MSFT', category: 'Stocks', exchange: 'NYSE', sparkline: [50, 52, 51, 54, 53, 56, 55, 58, 57, 60] },
  { name: 'Tesla', value: '187.35', change: '-1.15%', up: false, ticker: 'TSLA', category: 'Stocks', exchange: 'NYSE', sparkline: [55, 52, 50, 53, 48, 46, 49, 44, 42, 38] },
  { name: 'Infosys', value: '1,894.20', change: '+0.25%', up: true, ticker: 'INFY', category: 'Stocks', exchange: 'NSE', sparkline: [48, 49, 47, 51, 50, 52, 51, 53, 52, 54] },
  { name: 'Amazon', value: '189.08', change: '-0.45%', up: false, ticker: 'AMZN', category: 'Stocks', exchange: 'NYSE', sparkline: [52, 50, 48, 51, 47, 49, 45, 46, 48, 44] },
  { name: 'Alphabet', value: '178.50', change: '+1.10%', up: true, ticker: 'GOOGL', category: 'Stocks', exchange: 'NYSE', sparkline: [44, 46, 45, 48, 50, 48, 51, 53, 52, 56] },
  { name: 'Meta Platforms', value: '482.30', change: '+2.14%', up: true, ticker: 'META', category: 'Stocks', exchange: 'NYSE', sparkline: [40, 44, 42, 48, 52, 50, 54, 58, 56, 62] },
  { name: 'Eli Lilly', value: '892.40', change: '-0.75%', up: false, ticker: 'LLY', category: 'Stocks', exchange: 'NYSE', sparkline: [54, 52, 53, 49, 47, 50, 46, 45, 47, 42] },
  { name: 'TSMC', value: '172.90', change: '+2.85%', up: true, ticker: 'TSM', category: 'Stocks', exchange: 'NYSE', sparkline: [38, 42, 40, 46, 48, 45, 50, 54, 52, 58] },
  { name: 'ASML Holding', value: '984.20', change: '+1.45%', up: true, ticker: 'ASML', category: 'Stocks', exchange: 'LSE', sparkline: [42, 45, 43, 48, 50, 47, 52, 55, 53, 58] },
  { name: 'Reliance Industries', value: '3,110.50', change: '+1.20%', up: true, ticker: 'RELIANCE', category: 'Stocks', exchange: 'NSE', sparkline: [45, 47, 46, 49, 51, 49, 52, 54, 53, 56] },
  { name: 'Tata Motors', value: '982.40', change: '-1.45%', up: false, ticker: 'TATAMOTORS', category: 'Stocks', exchange: 'NSE', sparkline: [52, 50, 48, 51, 46, 48, 43, 41, 44, 38] },
  { name: 'Toyota Motor', value: '3,120.00', change: '-0.85%', up: false, ticker: '7203', category: 'Stocks', exchange: 'TSE', sparkline: [50, 48, 49, 46, 43, 45, 41, 40, 42, 38] },
  { name: 'Sony Group', value: '12,450.00', change: '+1.15%', up: true, ticker: '6758', category: 'Stocks', exchange: 'TSE', sparkline: [44, 46, 45, 48, 49, 47, 50, 52, 51, 54] },
  { name: 'AstraZeneca', value: '12,140.00', change: '-0.30%', up: false, ticker: 'AZN', category: 'Stocks', exchange: 'LSE', sparkline: [48, 47, 49, 46, 44, 47, 45, 43, 45, 42] },
  { name: 'BP plc', value: '482.50', change: '+0.80%', up: true, ticker: 'BP', category: 'Stocks', exchange: 'LSE', sparkline: [46, 48, 47, 50, 49, 51, 50, 53, 52, 55] },
  { name: 'HDFC Bank', value: '1,682.30', change: '+0.45%', up: true, ticker: 'HDFCBANK', category: 'Stocks', exchange: 'NSE', sparkline: [48, 50, 49, 51, 52, 50, 53, 55, 54, 56] },

  // Crypto (9 symbols)
  { name: 'BTC/USD', value: '67,412.00', change: '+2.15%', up: true, ticker: 'BTC', category: 'Crypto', exchange: '24/7', sparkline: [35, 40, 38, 45, 48, 44, 52, 56, 53, 62] },
  { name: 'ETH/USD', value: '3,485.50', change: '+1.82%', up: true, ticker: 'ETH', category: 'Crypto', exchange: '24/7', sparkline: [38, 42, 40, 46, 48, 45, 50, 53, 51, 58] },
  { name: 'SOL/USD', value: '142.80', change: '-2.35%', up: false, ticker: 'SOL', category: 'Crypto', exchange: '24/7', sparkline: [55, 52, 50, 48, 45, 47, 42, 38, 40, 35] },
  { name: 'BNB/USD', value: '582.40', change: '+0.95%', up: true, ticker: 'BNB', category: 'Crypto', exchange: '24/7', sparkline: [46, 48, 47, 50, 49, 51, 50, 52, 51, 54] },
  { name: 'XRP/USD', value: '0.4850', change: '-1.20%', up: false, ticker: 'XRP', category: 'Crypto', exchange: '24/7', sparkline: [50, 48, 49, 46, 44, 47, 43, 41, 44, 38] },
  { name: 'ADA/USD', value: '0.3840', change: '+0.50%', up: true, ticker: 'ADA', category: 'Crypto', exchange: '24/7', sparkline: [48, 50, 49, 51, 50, 52, 51, 53, 52, 55] },
  { name: 'DOGE/USD', value: '0.1240', change: '+4.12%', up: true, ticker: 'DOGE', category: 'Crypto', exchange: '24/7', sparkline: [30, 38, 34, 45, 40, 52, 48, 60, 55, 72] },
  { name: 'AVAX/USD', value: '28.60', change: '-2.15%', up: false, ticker: 'AVAX', category: 'Crypto', exchange: '24/7', sparkline: [52, 50, 48, 46, 43, 45, 41, 38, 40, 35] },
  { name: 'LINK/USD', value: '14.25', change: '+1.75%', up: true, ticker: 'LINK', category: 'Crypto', exchange: '24/7', sparkline: [44, 46, 45, 48, 49, 47, 50, 52, 51, 55] },

  // Forex (8 symbols)
  { name: 'EUR/USD', value: '1.0824', change: '+0.08%', up: true, ticker: 'EURUSD', category: 'Forex', exchange: '24/5', sparkline: [48, 49, 48, 50, 49, 51, 50, 52, 51, 53] },
  { name: 'GBP/USD', value: '1.2745', change: '-0.12%', up: false, ticker: 'GBPUSD', category: 'Forex', exchange: '24/5', sparkline: [52, 51, 50, 49, 48, 49, 47, 46, 48, 45] },
  { name: 'USD/JPY', value: '158.42', change: '+0.32%', up: true, ticker: 'USDJPY', category: 'Forex', exchange: '24/5', sparkline: [46, 47, 48, 47, 49, 50, 49, 51, 50, 52] },
  { name: 'AUD/USD', value: '0.6654', change: '-0.24%', up: false, ticker: 'AUDUSD', category: 'Forex', exchange: '24/5', sparkline: [51, 50, 49, 48, 47, 48, 46, 45, 47, 44] },
  { name: 'USD/CAD', value: '1.3685', change: '+0.15%', up: true, ticker: 'USDCAD', category: 'Forex', exchange: '24/5', sparkline: [48, 49, 48, 50, 51, 50, 52, 53, 52, 54] },
  { name: 'USD/CHF', value: '0.8845', change: '-0.10%', up: false, ticker: 'USDCHF', category: 'Forex', exchange: '24/5', sparkline: [50, 49, 48, 47, 46, 48, 46, 45, 47, 44] },
  { name: 'EUR/GBP', value: '0.8492', change: '+0.18%', up: true, ticker: 'EURGBP', category: 'Forex', exchange: '24/5', sparkline: [47, 48, 47, 49, 50, 49, 51, 52, 51, 53] },
  { name: 'USD/INR', value: '83.4250', change: '+0.05%', up: true, ticker: 'USDINR', category: 'Forex', exchange: '24/5', sparkline: [49, 50, 49, 51, 50, 52, 51, 53, 52, 54] },

  // Commodities (8 symbols)
  { name: 'GOLD', value: '2,341.80', change: '-0.18%', up: false, ticker: 'GC', category: 'Commodities', exchange: '24/5', sparkline: [50, 49, 48, 47, 46, 48, 45, 43, 46, 42] },
  { name: 'SILVER', value: '29.42', change: '+0.75%', up: true, ticker: 'SI', category: 'Commodities', exchange: '24/5', sparkline: [44, 46, 45, 48, 49, 47, 50, 52, 51, 55] },
  { name: 'CRUDE OIL', value: '81.25', change: '-1.05%', up: false, ticker: 'CL', category: 'Commodities', exchange: '24/5', sparkline: [54, 52, 50, 53, 48, 46, 49, 44, 42, 38] },
  { name: 'BRENT CRUDE', value: '85.40', change: '-0.85%', up: false, ticker: 'BZ', category: 'Commodities', exchange: '24/5', sparkline: [52, 50, 49, 51, 47, 45, 48, 43, 41, 38] },
  { name: 'NATURAL GAS', value: '2.742', change: '+3.15%', up: true, ticker: 'NG', category: 'Commodities', exchange: '24/5', sparkline: [40, 44, 42, 48, 46, 52, 49, 58, 54, 65] },
  { name: 'COPPER', value: '4.4850', change: '+1.12%', up: true, ticker: 'HG', category: 'Commodities', exchange: '24/5', sparkline: [45, 47, 46, 49, 50, 48, 51, 53, 52, 55] },
  { name: 'PLATINUM', value: '992.50', change: '-0.45%', up: false, ticker: 'PL', category: 'Commodities', exchange: '24/5', sparkline: [50, 48, 49, 46, 44, 47, 43, 41, 44, 38] },
  { name: 'PALLADIUM', value: '954.00', change: '+1.80%', up: true, ticker: 'PA', category: 'Commodities', exchange: '24/5', sparkline: [42, 45, 43, 48, 50, 47, 52, 54, 53, 57] }
];

const isExchangeOpen = (exchange: string, time: Date): boolean => {
  if (exchange === '24/7') return true;
  const day = time.getDay();
  if (day === 0 || day === 6) return false;
  const utcMilli = time.getTime() + time.getTimezoneOffset() * 60000;
  
  let offset = 0;
  let startHour = 9;
  let startMin = 30;
  let endHour = 16;
  let endMin = 0;
  
  if (exchange === 'NYSE') {
    offset = -4; // EDT
    startHour = 9; startMin = 30; endHour = 16; endMin = 0;
  } else if (exchange === 'LSE') {
    offset = 1; // BST
    startHour = 8; startMin = 0; endHour = 16; endMin = 30;
  } else if (exchange === 'TSE') {
    offset = 9; // JST
    startHour = 9; startMin = 0; endHour = 15; endMin = 0;
  } else if (exchange === 'NSE') {
    offset = 5.5; // IST
    startHour = 9; startMin = 15; endHour = 15; endMin = 30;
  } else if (exchange === '24/5') {
    return true;
  } else {
    return true;
  }
  
  const exchTime = new Date(utcMilli + 3600000 * offset);
  const hour = exchTime.getHours();
  const minute = exchTime.getMinutes();
  
  const currentInMins = hour * 60 + minute;
  const startInMins = startHour * 60 + startMin;
  const endInMins = endHour * 60 + endMin;
  
  return currentInMins >= startInMins && currentInMins < endInMins;
};
const insightItems = [
  { icon: '🔥', title: 'AI Chips Boom',        desc: 'Semiconductor demand surges as AI workloads scale globally. NVIDIA leads.',   tag: 'Trending'  },
  { icon: '🏦', title: 'Rate Cut Expectations', desc: 'Fed signals possible Q4 cuts — growth stocks may re-rate upward.',            tag: 'Macro'     },
  { icon: '🌏', title: 'India IT Resilience',   desc: 'Indian IT sector shows defensive strength amid global macro uncertainty.',    tag: 'Sector'    },
  { icon: '⚡', title: 'EV Market Cooling',     desc: 'EV demand growth slows in US & Europe — watch margins at Tesla & Rivian.',   tag: 'Risk'      },
];

function App() {
  const [loading, setLoading]             = useState(false);
  const [report, setReport]               = useState<ResearchReport | null>(null);
  const [error, setError]                 = useState('');
  const [researchingCompany, setResearchingCompany] = useState('');
  const [userName, setUserName]           = useState<string | null>(null);
  const [theme, setTheme]                 = useState<'midnight' | 'neon' | 'emerald' | 'light'>(() => {
    return (localStorage.getItem('investiq_theme') as any) || 'midnight';
  });
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [activeNav, setActiveNav]         = useState<NavTab>('home');
  const [showUserMenu, setShowUserMenu]   = useState(false);
  const [toasts, setToasts]               = useState<Toast[]>([]);
  const [toastId, setToastId]             = useState(0);

  const [marketsList, setMarketsList] = useState<MarketAsset[]>(initialMarketAssets);
  const [marketFilter, setMarketFilter] = useState<'All' | 'Indices' | 'Stocks' | 'Crypto' | 'Commodities' | 'Forex'>('All');
  const [marketStatusFilter, setMarketStatusFilter] = useState<'All' | 'Open'>('All');
  const [selectedMarket, setSelectedMarket] = useState<MarketAsset | null>(null);
  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);

  // Auto-login check removed to force login page on startup / refresh
  useEffect(() => {
    authService.logout();
    setUserName(null);
  }, []);

  // Update theme variable globally
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('investiq_theme', theme);
  }, [theme]);


  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setMarketsList(prev => prev.map(asset => {
        const isOpen = isExchangeOpen(asset.exchange, now);
        if (!isOpen) return asset;
        
        const rawVal = asset.value.replace(/,/g, '');
        const currentVal = parseFloat(rawVal);
        if (isNaN(currentVal)) return asset;
        
        const tickChange = (Math.random() - 0.48) * 0.0012; 
        const nextVal = currentVal * (1 + tickChange);
        
        const parts = rawVal.split('.');
        const decimals = parts[1] ? parts[1].length : 0;
        const formattedValue = nextVal.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        });
        
        const rawChange = asset.change.replace(/[%+]/g, '');
        const currentChange = parseFloat(rawChange) || 0;
        const nextChange = currentChange + tickChange * 100;
        const formattedChange = `${nextChange >= 0 ? '+' : ''}${nextChange.toFixed(2)}%`;
        
        // Update sparkline points
        const currentSparkline = asset.sparkline || [30, 40, 35, 45, 40, 50, 48, 55, 52, 60];
        const lastVal = currentSparkline[currentSparkline.length - 1];
        const nextPoint = Math.max(10, Math.min(90, lastVal + (tickChange * 250)));
        const nextSparkline = [...currentSparkline.slice(1), nextPoint];

        return {
          ...asset,
          value: formattedValue,
          change: formattedChange,
          up: nextChange >= 0,
          sparkline: nextSparkline
        };
      }));
    }, 3000);
    
    return () => clearInterval(timer);
  }, []);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setShowThemeMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = toastId + 1;
    setToastId(id);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const handleResearch = async (companyName: string) => {
    setActiveNav('research');
    setLoading(true);
    setError('');
    setReport(null);
    setResearchingCompany(companyName);
    setActiveSection('overview');
    try {
      const generated = await submitResearch(companyName);
      setReport(generated);
      await getReport(companyName).catch(() => {});
      addToast(`✅ Report ready for ${companyName}`, 'success');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Research request failed.';
      setError(msg);
      addToast('Research failed — check your API key', 'warn');
    } finally {
      setLoading(false);
    }
  };

  const handleNavClick = (nav: string) => {
    const key = nav.toLowerCase() as NavTab;
    setActiveNav(key);
    if (key === 'research') {
      setReport(null);
      setError('');
      setTimeout(() => searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    setReport(null);
    setError('');
    authService.logout();
    setUserName('logged-out');
    setActiveNav('home');
  };

  const handleClearReport = () => {
    setReport(null);
    setError('');
    setActiveNav('home');
    addToast('Report cleared — ready for new search', 'info');
  };

  if (userName === 'logged-out') {
    return <LogoutPage onRedirect={() => setUserName(null)} />;
  }

  if (!userName) return <LoginPage onLogin={setUserName} />;

  const navItems: { key: NavTab; label: string }[] = [
    { key: 'home',      label: 'Home'      },
    { key: 'research',  label: 'Research'  },
    { key: 'portfolio', label: 'Portfolio' },
    { key: 'markets',   label: 'Markets'   },
    { key: 'insights',  label: 'Insights'  },
    { key: 'academy',   label: 'Academy'   },
  ];

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── Toast Stack ── */}
      <div style={{ position: 'fixed', top: '72px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'none' }}>
        {toasts.map(t => (
          <div key={t.id} className="animate-fade-up" style={{
            background: t.type === 'success' ? 'rgba(52,211,153,0.12)' : t.type === 'warn' ? 'rgba(251,113,133,0.12)' : 'rgba(0,212,255,0.1)',
            border: `1px solid ${t.type === 'success' ? 'rgba(52,211,153,0.3)' : t.type === 'warn' ? 'rgba(251,113,133,0.3)' : 'rgba(0,212,255,0.25)'}`,
            borderRadius: '12px', padding: '12px 18px',
            fontSize: '0.83rem', fontWeight: 500,
            color: t.type === 'success' ? 'var(--emerald)' : t.type === 'warn' ? 'var(--rose)' : 'var(--electric)',
            backdropFilter: 'blur(20px)', maxWidth: '300px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
          }}>{t.message}</div>
        ))}
      </div>

      {/* ── Top Navigation Bar ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(2,3,15,0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>

          {/* Logo — click goes home */}
          <button
            id="logo-home-btn"
            type="button"
            onClick={handleClearReport}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--gold-light), var(--gold))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: 900, color: '#000',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(240,180,41,0.5)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
            >I</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>InvestIQ</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500 }}>Investment Intelligence</div>
            </div>
          </button>

          {/* Center nav */}
          <nav style={{ display: 'flex', gap: '4px' }}>
            {navItems.map(item => {
              const isActive = activeNav === item.key;
              return (
                <button
                  key={item.key}
                  id={`nav-${item.key}`}
                  type="button"
                  onClick={() => handleNavClick(item.label)}
                  style={{
                    background: isActive ? 'var(--surface-2)' : 'none',
                    border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                    padding: '6px 14px', borderRadius: '8px',
                    fontSize: '0.82rem', fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-2)'; }}}
                  onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}}
                >
                  {item.label}
                  {isActive && <span style={{ position: 'absolute', bottom: '-1px', left: '50%', transform: 'translateX(-50%)', width: '20px', height: '2px', background: 'var(--electric)', borderRadius: '99px' }} />}
                </button>
              );
            })}
          </nav>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="badge badge-electric" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--emerald)', display: 'inline-block', animation: 'pulse-glow 2s infinite' }} />
              Live
            </div>

            {/* Theme Switcher Dropdown */}
            <div ref={themeMenuRef} style={{ position: 'relative' }}>
              <button
                id="theme-select-btn"
                type="button"
                onClick={() => setShowThemeMenu(v => !v)}
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  transition: 'all 0.2s',
                  outline: 'none',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-3)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-2)'; }}
              >
                <span style={{ fontSize: '0.9rem' }}>
                  {theme === 'midnight' ? '🌙' : theme === 'neon' ? '🔮' : theme === 'emerald' ? '🌲' : '☀️'}
                </span>
                <span style={{ textTransform: 'capitalize' }}>{theme}</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>▼</span>
              </button>

              {showThemeMenu && (
                <div className="animate-fade-up glass" style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  width: '180px', borderRadius: '12px', padding: '6px',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.4)', zIndex: 200
                }}>
                  {[
                    { id: 'midnight', label: 'Midnight Gold', icon: '🌙' },
                    { id: 'neon', label: 'Cyber Neon', icon: '🔮' },
                    { id: 'emerald', label: 'Emerald Forest', icon: '🌲' },
                    { id: 'light', label: 'Alabaster Light', icon: '☀️' },
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => { setTheme(t.id as any); setShowThemeMenu(false); }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 12px', borderRadius: '8px', border: 'none',
                        background: theme === t.id ? 'var(--surface-3)' : 'transparent',
                        color: theme === t.id ? 'var(--electric)' : 'var(--text-secondary)',
                        fontWeight: theme === t.id ? 600 : 500,
                        fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.15s', textAlign: 'left'
                      }}
                      onMouseEnter={e => { if (theme !== t.id) { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-2)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; } }}
                      onMouseLeave={e => { if (theme !== t.id) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; } }}
                    >
                      <span style={{ fontSize: '0.95rem' }}>{t.icon}</span> {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User avatar with dropdown */}
            <div ref={userMenuRef} style={{ position: 'relative' }}>
              <button
                id="user-avatar-btn"
                type="button"
                onClick={() => setShowUserMenu(v => !v)}
                style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--electric), var(--violet))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, color: '#fff', cursor: 'pointer',
                  border: showUserMenu ? '2px solid var(--electric)' : '2px solid rgba(255,255,255,0.1)',
                  flexShrink: 0, transition: 'border-color 0.2s', outline: 'none',
                  boxShadow: showUserMenu ? '0 0 16px rgba(0,212,255,0.4)' : 'none'
                }}
              >
                {userName.slice(0, 2).toUpperCase()}
              </button>

              {/* Dropdown */}
              {showUserMenu && (
                <div className="animate-fade-up glass" style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  width: '220px', borderRadius: '16px', padding: '8px',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.5)', zIndex: 200
                }}>
                  {/* User info */}
                  <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid var(--border)', marginBottom: '6px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{userName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Investor Plan · Free Tier</div>
                  </div>

                  {[
                    { icon: '👤', label: 'Profile', action: () => { setShowUserMenu(false); setActiveNav('profile'); } },
                    { icon: '⚙️', label: 'Settings', action: () => { setShowUserMenu(false); setActiveNav('settings'); } },
                    { icon: '📊', label: 'My Reports', action: () => { setShowUserMenu(false); handleNavClick('Portfolio'); } },
                    { icon: '🔑', label: 'API Key', action: () => { setShowUserMenu(false); addToast('Add your Gemini API key in backend/.env', 'warn'); } },
                  ].map(item => (
                    <button key={item.label} type="button" onClick={item.action} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '9px 14px', borderRadius: '10px', border: 'none', background: 'transparent',
                      color: 'var(--text-secondary)', fontSize: '0.83rem', cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif', transition: 'background 0.15s, color 0.15s', textAlign: 'left'
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-3)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
                    >
                      <span style={{ fontSize: '0.9rem' }}>{item.icon}</span> {item.label}
                    </button>
                  ))}

                  <div style={{ borderTop: '1px solid var(--border)', marginTop: '6px', paddingTop: '6px' }}>
                    <button id="logout-btn" type="button" onClick={handleLogout} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '9px 14px', borderRadius: '10px', border: 'none', background: 'transparent',
                      color: 'var(--rose)', fontSize: '0.83rem', cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif', transition: 'background 0.15s'
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(251,113,133,0.08)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                    >
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Page Body ── */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* ══════════════ HOME TAB ══════════════ */}
        {activeNav === 'home' && (
          <HomeTab userName={userName} onResearch={handleResearch} />
        )}

        {/* ══════════════ RESEARCH TAB ══════════════ */}
        {activeNav === 'research' && (
          <>
            {/* Hero (no report yet) */}
            {!loading && !report && (
              <section className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div style={{ textAlign: 'center', paddingTop: '24px' }}>
                  <div className="badge badge-gold" style={{ display: 'inline-flex', marginBottom: '20px' }}>✦ Powered by Gemini AI</div>
                  <h1 className="font-display" style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', lineHeight: 1.1, marginBottom: '16px' }}>
                    <span className="text-gradient-electric">Research any company.</span><br />
                    <span style={{ color: 'var(--text-primary)' }}>Get </span>
                    <span className="text-gradient-gold" style={{ fontStyle: 'italic' }}>investment-grade</span>
                    <span style={{ color: 'var(--text-primary)' }}> insights.</span>
                  </h1>
                  <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '540px', margin: '0 auto' }}>
                    Type any publicly known company and receive a full AI-generated investment report — financials, sentiment, risks, and a clear recommendation.
                  </p>
                </div>

                {/* Search box */}
                <div ref={searchRef} className="glass" style={{ borderRadius: '20px', padding: '24px', maxWidth: '680px', margin: '0 auto', width: '100%' }}>
                  <SearchBar onSubmit={handleResearch} loading={loading} />
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', maxWidth: '680px', margin: '0 auto', width: '100%' }}>
                  {stats.map(s => (
                    <div key={s.label} className="stat-card" style={{ textAlign: 'center', padding: '16px', cursor: 'default' }}>
                      <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>{s.icon}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px' }}>{s.value}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Feature cards — clickable */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                  {featureCards.map((f, i) => (
                    <button
                      key={f.title}
                      id={`feature-${f.title.replace(/\s+/g, '-').toLowerCase()}`}
                      type="button"
                      onClick={() => handleResearch(f.demo)}
                      className="glass border-animated"
                      style={{
                        borderRadius: '16px', padding: '20px', textAlign: 'left',
                        cursor: 'pointer', border: 'none', outline: 'none',
                        animation: `fade-up 0.4s ease ${i * 0.08}s both`,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        fontFamily: 'Inter, sans-serif'
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${f.color}22`; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                    >
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${f.color}15`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', marginBottom: '12px' }}>{f.icon}</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{f.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '10px' }}>{f.desc}</div>
                      <div style={{ fontSize: '0.72rem', color: f.color, fontWeight: 600 }}>Try with {f.demo} →</div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Search bar (report exists) */}
            {(loading || report) && (
              <div className="animate-fade-in glass" style={{ borderRadius: '18px', padding: '18px 24px', display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <SearchBar onSubmit={handleResearch} loading={loading} />
                </div>
                {report && !loading && (
                  <button
                    id="clear-report-btn"
                    type="button"
                    onClick={handleClearReport}
                    style={{
                      background: 'var(--surface-3)', border: '1px solid var(--border)',
                      borderRadius: '12px', padding: '13px 18px',
                      fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)',
                      cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.2s', whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--rose)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(251,113,133,0.3)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}
                  >✕ Clear Report</button>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="animate-fade-in" style={{ background: 'rgba(251,113,133,0.07)', border: '1px solid rgba(251,113,133,0.2)', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>⚠️</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--rose)', marginBottom: '4px' }}>Research Failed</div>
                  <div style={{ fontSize: '0.82rem', color: 'rgba(251,113,133,0.8)', lineHeight: 1.6 }}>{error}</div>
                </div>
                <button type="button" onClick={() => setError('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', flexShrink: 0, padding: '0 4px' }}>✕</button>
              </div>
            )}

            {loading && <LoadingState companyName={researchingCompany} />}

            {!loading && report && (
              <ReportDashboard
                report={report}
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                sectionItems={sectionItems}
              />
            )}
          </>
        )}

        {/* ══════════════ PORTFOLIO TAB ══════════════ */}
        {activeNav === 'portfolio' && (
          <section className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div className="badge badge-violet" style={{ marginBottom: '12px' }}>📁 My Portfolio</div>
              <h2 className="font-display" style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Watchlist & Research</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Click any company below to generate a live AI research report.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
              {portfolioCompanies.map((company, i) => (
                <button
                  key={company}
                  id={`portfolio-${company.toLowerCase()}`}
                  type="button"
                  onClick={() => { handleNavClick('research'); setTimeout(() => handleResearch(company), 50); }}
                  className="glass border-animated"
                  style={{
                    borderRadius: '16px', padding: '20px', textAlign: 'left',
                    cursor: 'pointer', border: '1px solid var(--border)', outline: 'none',
                    fontFamily: 'Inter, sans-serif', animation: `fade-up 0.3s ease ${i * 0.07}s both`,
                    transition: 'transform 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(167,139,250,0.4)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--electric), var(--violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
                    {company.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{company}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click to research →</div>
                </button>
              ))}
              {/* Add more */}
              <button
                id="portfolio-add-btn"
                type="button"
                onClick={() => { handleNavClick('research'); }}
                style={{
                  borderRadius: '16px', padding: '20px', textAlign: 'center',
                  cursor: 'pointer', border: '2px dashed rgba(255,255,255,0.1)',
                  background: 'transparent', fontFamily: 'Inter, sans-serif',
                  color: 'var(--text-muted)', fontSize: '0.85rem', transition: 'border-color 0.2s, color 0.2s',
                  outline: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', minHeight: '120px'
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,212,255,0.4)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--electric)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
              >
                <span style={{ fontSize: '1.5rem' }}>＋</span>
                <span>Add Company</span>
              </button>
            </div>
          </section>
        )}

        {/* ══════════════ MARKETS TAB ══════════════ */}
        {activeNav === 'markets' && (
          <section className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Markets Hero Banner */}
            <div className="glass" style={{
              borderRadius: '24px', padding: '32px', position: 'relative', overflow: 'hidden',
              border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center'
            }}>
              <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 1 }}>
                <div className="badge badge-emerald">📈 Live Terminal</div>
                <h1 className="font-display" style={{ fontSize: '2.2rem', color: 'var(--text-primary)' }}>Nova Market Center</h1>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Track global asset tickers across exchanges in real-time. Use the interactive Trade Simulator inside details modal or trigger deep AI assessments instantly.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  width: '100%', maxWidth: '380px', borderRadius: '16px', overflow: 'hidden',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)',
                  background: 'var(--surface-3)'
                }}>
                  <img
                    src={marketTrends}
                    alt="Nova Global Ticker Terminal"
                    style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>

            {/* Category and Status Filters */}
            <div style={{
              display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '12px 20px'
            }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {(['All', 'Indices', 'Stocks', 'Crypto', 'Commodities', 'Forex'] as const).map(cat => {
                  const isActive = marketFilter === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setMarketFilter(cat)}
                      style={{
                        background: isActive ? 'var(--surface-3)' : 'transparent',
                        border: '1px solid ' + (isActive ? 'var(--electric)' : 'var(--border)'),
                        borderRadius: '8px', padding: '6px 14px', fontSize: '0.78rem', fontWeight: 600,
                        color: isActive ? 'var(--electric)' : 'var(--text-secondary)', cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif', transition: 'all 0.15s', outline: 'none'
                      }}
                    >{cat}</button>
                  );
                })}
              </div>
              
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['All', 'Open'] as const).map(status => {
                  const isActive = (status === 'All' && marketStatusFilter === 'All') || (status === 'Open' && marketStatusFilter === 'Open');
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setMarketStatusFilter(status === 'Open' ? 'Open' : 'All')}
                      style={{
                        background: isActive ? 'var(--surface-3)' : 'transparent',
                        border: '1px solid ' + (isActive ? 'var(--emerald)' : 'var(--border)'),
                        borderRadius: '8px', padding: '6px 12px', fontSize: '0.78rem', fontWeight: 600,
                        color: isActive ? 'var(--emerald)' : 'var(--text-secondary)', cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif', transition: 'all 0.15s', outline: 'none'
                      }}
                    >{status === 'Open' ? '🟢 Live/Open' : '🌐 All Status'}</button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
              {marketsList
                .filter(item => {
                  const matchesCat = marketFilter === 'All' || item.category === marketFilter;
                  const isOpen = isExchangeOpen(item.exchange, new Date());
                  const matchesStatus = marketStatusFilter === 'All' || isOpen;
                  return matchesCat && matchesStatus;
                })
                .map((idx, i) => {
                  const isOpen = isExchangeOpen(idx.exchange, new Date());
                  return (
                    <button
                      key={idx.name}
                      id={`market-${idx.name.replace(/[\/\s]+/g, '-').toLowerCase()}`}
                      type="button"
                      onClick={() => {
                        const completeMarketItem = { ...idx, status: (isOpen ? 'open' : 'closed') as 'open' | 'closed' };
                        setSelectedMarket(completeMarketItem);
                        setIsMarketModalOpen(true);
                      }}
                      className="stat-card"
                      style={{
                        cursor: 'pointer',
                        border: `1px solid ${isOpen ? (idx.up ? 'rgba(52,211,153,0.18)' : 'rgba(251,113,133,0.18)') : 'var(--border)'}`,
                        background: isOpen ? (idx.up ? 'rgba(52,211,153,0.04)' : 'rgba(251,113,133,0.04)') : 'rgba(255,255,255,0.01)',
                        animation: `fade-up 0.3s ease ${Math.min(i * 0.05, 0.5)}s both`, outline: 'none',
                        fontFamily: 'Inter, sans-serif', transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                        textAlign: 'left',
                        boxShadow: isOpen ? `0 4px 20px ${idx.up ? 'rgba(52,211,153,0.03)' : 'rgba(251,113,133,0.03)'}` : 'none'
                      }}
                      onMouseEnter={e => { 
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                        if (isOpen) {
                          (e.currentTarget as HTMLElement).style.borderColor = idx.up ? 'rgba(52,211,153,0.4)' : 'rgba(251,113,133,0.4)';
                        } else {
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
                        }
                      }}
                      onMouseLeave={e => { 
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                        (e.currentTarget as HTMLElement).style.borderColor = isOpen ? (idx.up ? 'rgba(52,211,153,0.18)' : 'rgba(251,113,133,0.18)') : 'var(--border)';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <span className="section-label" style={{ fontSize: '0.62rem', letterSpacing: '0.04em' }}>{idx.ticker}</span>
                          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{idx.name}</h4>
                        </div>
                        <span style={{
                          fontSize: '0.62rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
                          background: isOpen ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.05)',
                          color: isOpen ? 'var(--emerald)' : 'var(--text-muted)',
                          border: `1px solid ${isOpen ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.06)'}`
                        }}>{isOpen ? 'LIVE' : 'CLOSED'}</span>
                      </div>

                      {/* Mini SVG Sparkline */}
                      {idx.sparkline && idx.sparkline.length > 0 && (
                        <div style={{ height: '30px', margin: '10px 0', width: '100%' }}>
                          <svg viewBox="0 0 100 30" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                            <polyline
                              fill="none"
                              stroke={idx.up ? 'var(--emerald)' : 'var(--rose)'}
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={idx.sparkline.map((val, key) => `${(key / (idx.sparkline!.length - 1)) * 100},${30 - (val / 100) * 30}`).join(' ')}
                            />
                          </svg>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '12px' }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>{idx.value}</div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: idx.up ? 'var(--emerald)' : 'var(--rose)' }}>{idx.change}</div>
                      </div>
                    </button>
                  );
                })}
            </div>

            {/* Sector Performance Heatmap */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              <div>
                <div className="badge badge-gold" style={{ marginBottom: '8px' }}>🔥 Strength Analysis</div>
                <h3 className="font-display" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Sector Performance Heatmap</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Real-time strength heatmap of major global sectors based on volume and AI sentiment score.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {sectorPerformance.map((sec, i) => (
                  <div
                    key={sec.sector}
                    className={`heatmap-card ${sec.up ? 'heatmap-bullish' : 'heatmap-bearish'}`}
                    style={{ animation: `fade-up 0.3s ease ${Math.min(i * 0.05, 0.4)}s both` }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>{sec.sector}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: sec.up ? 'var(--emerald)' : 'var(--rose)' }}>{sec.change}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>Market Cap: <strong style={{ color: 'var(--text-secondary)' }}>{sec.cap}</strong></span>
                      <span>AI Score: <strong style={{ color: 'var(--gold)' }}>{sec.score}/100</strong></span>
                    </div>

                    {/* Progress indicator bar */}
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', marginTop: '12px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${sec.score}%`,
                        background: sec.up ? 'var(--emerald)' : 'var(--rose)',
                        borderRadius: '4px',
                        opacity: 0.8
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass" style={{ borderRadius: '18px', padding: '20px 24px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>⚠ Disclaimer</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Live stream tick data fluctuations are simulated. Use the Research tab or click "Generate AI Research Report" for actual AI fundamental assessments.</p>
            </div>
          </section>
        )}

        {/* ══════════════ INSIGHTS TAB ══════════════ */}
        {activeNav === 'insights' && (
          <section className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div className="badge badge-gold" style={{ marginBottom: '12px' }}>💡 Market Insights</div>
              <h2 className="font-display" style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Trending Themes</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>AI-curated market themes — click to research related companies.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {insightItems.map((item, i) => (
                <button
                  key={item.title}
                  id={`insight-${item.title.replace(/\s+/g, '-').toLowerCase()}`}
                  type="button"
                  onClick={() => { handleNavClick('research'); setTimeout(() => handleResearch(item.title), 50); }}
                  className="glass border-animated"
                  style={{
                    borderRadius: '16px', padding: '20px 24px', textAlign: 'left',
                    cursor: 'pointer', border: '1px solid var(--border)', outline: 'none',
                    fontFamily: 'Inter, sans-serif', animation: `fade-up 0.35s ease ${i * 0.08}s both`,
                    transition: 'transform 0.2s', display: 'flex', alignItems: 'center', gap: '18px'
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(6px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(0)'; }}
                >
                  <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</span>
                      <span className={`badge ${item.tag === 'Risk' ? 'badge-rose' : item.tag === 'Macro' ? 'badge-violet' : item.tag === 'Sector' ? 'badge-emerald' : 'badge-gold'}`}>{item.tag}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem', flexShrink: 0 }}>→</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ══════════════ ACADEMY TAB ══════════════ */}
        {activeNav === 'academy' && (
          <EducationTab />
        )}

        {/* ══════════════ EXTRA PAGES ══════════════ */}
        {activeNav === 'profile' && (
          <section className="animate-fade-up">
            <div className="badge badge-electric" style={{ marginBottom: '12px' }}>👤 User Profile</div>
            <h2 className="font-display" style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Profile</h2>
            <div className="glass" style={{ padding: '24px', borderRadius: '16px', marginTop: '16px', maxWidth: '600px' }}>
               <p style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '1.1rem' }}><strong>Name:</strong> {userName}</p>
               <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}><strong>Plan:</strong> Investor Plan · Free Tier</p>
            </div>
          </section>
        )}
        {activeNav === 'settings' && (
          <section className="animate-fade-up">
            <div className="badge badge-violet" style={{ marginBottom: '12px' }}>⚙️ Configuration</div>
            <h2 className="font-display" style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Settings</h2>
            <div className="glass" style={{ padding: '24px', borderRadius: '16px', marginTop: '16px', maxWidth: '600px' }}>
               <p style={{ color: 'var(--text-muted)' }}>Preferences and application settings will be available here soon.</p>
            </div>
          </section>
        )}
        {activeNav === 'privacy' && (
          <section className="animate-fade-up">
            <h2 className="font-display" style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Privacy Policy</h2>
            <div className="glass" style={{ padding: '32px', borderRadius: '16px', marginTop: '16px', lineHeight: '1.8' }}>
               <p style={{ color: 'var(--text-secondary)' }}>Your privacy is important to us. This application does not store sensitive personal information without your consent. All AI research queries are processed securely. We do not sell your data to third parties.</p>
            </div>
          </section>
        )}
        {activeNav === 'terms' && (
          <section className="animate-fade-up">
            <h2 className="font-display" style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Terms of Use</h2>
            <div className="glass" style={{ padding: '32px', borderRadius: '16px', marginTop: '16px', lineHeight: '1.8' }}>
               <p style={{ color: 'var(--text-secondary)' }}>By using this application, you agree to our terms. The information provided is generated by AI and is for educational and informational purposes only. You agree not to misuse the service or use it for illegal activities.</p>
            </div>
          </section>
        )}
        {activeNav === 'disclaimer' && (
          <section className="animate-fade-up">
            <h2 className="font-display" style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Disclaimer</h2>
            <div className="glass" style={{ padding: '32px', borderRadius: '16px', marginTop: '16px', lineHeight: '1.8' }}>
               <p style={{ color: 'var(--text-secondary)' }}>This tool provides AI-generated research for informational purposes only. It is <strong>not financial advice</strong>. Always conduct your own due diligence or consult a licensed financial advisor before making investment decisions.</p>
            </div>
          </section>
        )}
        {activeNav === 'contact' && (
          <section className="animate-fade-up">
            <div className="badge badge-emerald" style={{ marginBottom: '12px' }}>📞 Get in Touch</div>
            <h2 className="font-display" style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Contact Us</h2>
            <div className="glass" style={{ padding: '32px', borderRadius: '16px', marginTop: '16px', maxWidth: '600px' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                   <strong style={{ display: 'inline-block', width: '70px', color: 'var(--text-muted)' }}>Phone:</strong> 
                   <a href="tel:7416211707" style={{ color: 'var(--electric)', textDecoration: 'none', fontWeight: 600 }}>7416211707</a>
                 </p>
                 <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                   <strong style={{ display: 'inline-block', width: '70px', color: 'var(--text-muted)' }}>Email:</strong> 
                   <a href="mailto:beeramvenkateswarareddybeeram@gmail.com" style={{ color: 'var(--electric)', textDecoration: 'none', fontWeight: 600 }}>beeramvenkateswarareddybeeram@gmail.com</a>
                 </p>
               </div>
            </div>
          </section>
        )}

      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '20px 24px', textAlign: 'center', marginTop: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {[
            { label: 'Privacy Policy', key: 'privacy' },
            { label: 'Terms of Use', key: 'terms' },
            { label: 'Disclaimer', key: 'disclaimer' },
            { label: 'Contact', key: 'contact' }
          ].map(link => (
            <button key={link.key} type="button"
              onClick={() => { setActiveNav(link.key as NavTab); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'color 0.2s', padding: '0 4px' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
            >{link.label}</button>
          ))}
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '10px' }}>
          © 2025 InvestIQ · AI-generated research for informational purposes only · Not financial advice
        </p>
      </footer>

      <MarketDetailsModal
        isOpen={isMarketModalOpen}
        onClose={() => setIsMarketModalOpen(false)}
        market={selectedMarket}
        onAnalyze={handleResearch}
      />

    </div>
  );
}

export default App;
