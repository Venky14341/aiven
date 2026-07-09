import { useEffect, useState } from 'react';

interface MarketItem {
  name: string;
  value: string;
  change: string;
  up: boolean;
  ticker?: string;
  category?: string;
  status?: 'open' | 'closed';
}

interface MarketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  market: MarketItem | null;
  onAnalyze: (company: string) => void;
}

export const MarketDetailsModal = ({ isOpen, onClose, market, onAnalyze }: MarketDetailsModalProps) => {
  const [chartData, setChartData] = useState<number[]>([]);
  const [tickerPrice, setTickerPrice] = useState<string>('');
  const [tickerChange, setTickerChange] = useState<string>('');
  const [isUpState, setIsUpState] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'technicals' | 'trade'>('technicals');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeAmount, setTradeAmount] = useState<string>('1');
  const [tradeSuccess, setTradeSuccess] = useState<boolean>(false);

  // Generate mock historical chart data when modal opens
  useEffect(() => {
    if (!market) return;

    // Set initial values
    setTickerPrice(market.value);
    setTickerChange(market.change);
    setIsUpState(market.up);

    // Generate 15 data points for standard SVG line chart
    const initialPoints = Array.from({ length: 15 }, () => 30 + Math.random() * 40);
    // Ensure the last point matches current price trend roughly
    setChartData(initialPoints);
  }, [market]);

  // Simulate tick updates to the chart and price while modal is open
  useEffect(() => {
    if (!market || !isOpen) return;

    const timer = setInterval(() => {
      // Parse numeric price
      const cleanVal = tickerPrice.replace(/,/g, '');
      const currentNum = parseFloat(cleanVal);
      if (isNaN(currentNum)) return;

      // Small tick fluctuation
      const changePct = (Math.random() - 0.49) * 0.002; // bias slightly upward
      const nextNum = currentNum * (1 + changePct);
      
      // Format back to locale string
      const parts = cleanVal.split('.');
      const decimals = parts[1] ? parts[1].length : 0;
      const formattedPrice = nextNum.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });

      // Update change percent
      const cleanChange = tickerChange.replace(/[%+]/g, '');
      const currentChangeNum = parseFloat(cleanChange);
      const nextChangeNum = currentChangeNum + changePct * 100;
      const formattedChange = `${nextChangeNum >= 0 ? '+' : ''}${nextChangeNum.toFixed(2)}%`;

      setTickerPrice(formattedPrice);
      setTickerChange(formattedChange);
      setIsUpState(nextChangeNum >= 0);

      // Append new point to chartData
      setChartData(prev => {
        const nextPoints = [...prev.slice(1)];
        // Generate new point based on trend
        const lastVal = prev[prev.length - 1];
        const nextVal = Math.max(10, Math.min(90, lastVal + (changePct * 200)));
        nextPoints.push(nextVal);
        return nextPoints;
      });

    }, 3000);

    return () => clearInterval(timer);
  }, [market, isOpen, tickerPrice, tickerChange]);

  if (!isOpen || !market) return null;

  // Map indices or tickers to research-friendly names
  const handleResearchClick = () => {
    let name = market.name;
    // Map specific cryptos or indices to standard company/asset searches
    if (name === 'BTC/USD') name = 'Bitcoin';
    else if (name === 'ETH/USD') name = 'Ethereum';
    else if (name === 'SOL/USD') name = 'Solana';
    else if (name === 'S&P 500') name = 'S&P 500 ETF';
    else if (name === 'NASDAQ') name = 'Nasdaq 100 Index';
    else if (name === 'NIFTY 50') name = 'Nifty 50 Index';
    else if (name === 'DOW') name = 'Dow Jones Industrial';
    else if (name === 'GOLD') name = 'Gold Bullion';
    else if (name === 'SILVER') name = 'Silver Commodity';
    else if (name === 'CRUDE OIL') name = 'Crude Oil';
    else if (name === 'EUR/USD') name = 'Euro';
    else if (name === 'GBP/USD') name = 'British Pound';
    else if (name === 'USD/JPY') name = 'Japanese Yen';

    onAnalyze(name);
    onClose();
  };

  // Convert chart points (0 to 100) to SVG coordinates (width 400, height 120)
  // High value = low Y coordinate in SVG (starts from top)
  const svgWidth = 400;
  const svgHeight = 120;
  const pointsString = chartData
    .map((val, idx) => {
      const x = (idx / (chartData.length - 1)) * svgWidth;
      const y = svgHeight - (val / 100) * svgHeight;
      return `${x},${y}`;
    })
    .join(' ');

  // Simulated metrics
  const cleanVal = tickerPrice.replace(/,/g, '');
  const basePrice = parseFloat(cleanVal) || 100;
  const openPrice = (basePrice * 0.998).toLocaleString(undefined, { maximumFractionDigits: 2 });
  const highPrice = (basePrice * 1.004).toLocaleString(undefined, { maximumFractionDigits: 2 });
  const lowPrice = (basePrice * 0.995).toLocaleString(undefined, { maximumFractionDigits: 2 });
  const volume = market.category === 'Crypto' ? '2.4B USD' : market.category === 'Forex' ? '5.1B USD' : '42.1M';
  const mcap = market.category === 'Stocks' ? '$2.8T' : market.category === 'Crypto' ? '$1.3T' : 'N/A';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', background: 'rgba(2,3,15,0.72)', backdropFilter: 'blur(16px)'
    }}>
      
      {/* Modal Card */}
      <div className="glass animate-fade-up" style={{
        maxWidth: '540px', width: '100%', borderRadius: '24px', overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)', border: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '24px 24px 16px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', borderBottom: '1px solid var(--border)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className={`badge ${market.category === 'Indices' ? 'badge-electric' : market.category === 'Crypto' ? 'badge-violet' : market.category === 'Stocks' ? 'badge-emerald' : 'badge-gold'}`}>
                {market.category || 'Asset'}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{market.ticker || market.name}</span>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{market.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'var(--surface-3)', border: '1px solid var(--border)',
              width: '32px', height: '32px', borderRadius: '50%', color: 'var(--text-muted)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', transition: 'color 0.2s, border-color 0.2s', outline: 'none'
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--rose)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(251,113,133,0.3)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}
          >✕</button>
        </div>

        {/* Live Price display */}
        <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
              {tickerPrice}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: isUpState ? 'var(--emerald)' : 'var(--rose)' }}>
                {tickerChange}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: market.status === 'open' ? 'var(--emerald)' : 'var(--rose)',
                  boxShadow: `0 0 6px ${market.status === 'open' ? 'var(--emerald)' : 'var(--rose)'}`
                }} />
                {market.status === 'open' ? 'Live Tick' : 'Exchange Closed'}
              </span>
            </div>
          </div>

          <div className="badge badge-electric" style={{ alignSelf: 'center' }}>
            ✦ AI Monitored
          </div>
        </div>

        {/* Live SVG Sparkline Chart */}
        <div style={{
          padding: '10px 24px 24px', position: 'relative',
          background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.02) 0%, transparent 80%)'
        }}>
          {chartData.length > 0 ? (
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: '120px', display: 'block', overflow: 'visible' }}>
              <defs>
                <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isUpState ? 'var(--emerald)' : 'var(--rose)'} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={isUpState ? 'var(--emerald)' : 'var(--rose)'} stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="0" y1={svgHeight * 0.25} x2={svgWidth} y2={svgHeight * 0.25} stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1={svgHeight * 0.5} x2={svgWidth} y2={svgHeight * 0.5} stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1={svgHeight * 0.75} x2={svgWidth} y2={svgHeight * 0.75} stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />

              {/* Area path */}
              <path
                d={`M 0,${svgHeight} L ${pointsString} L ${svgWidth},${svgHeight} Z`}
                fill="url(#chart-gradient)"
              />

              {/* Line path */}
              <polyline
                fill="none"
                stroke={isUpState ? 'var(--emerald)' : 'var(--rose)'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsString}
              />

              {/* Pulse point at the end */}
              {chartData.length > 0 && (
                <circle
                  cx={svgWidth}
                  cy={svgHeight - (chartData[chartData.length - 1] / 100) * svgHeight}
                  r="4"
                  fill={isUpState ? 'var(--emerald)' : 'var(--rose)'}
                  style={{ animation: 'pulse-glow 1s infinite' }}
                />
              )}
            </svg>
          ) : (
            <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Loading Price History...
            </div>
          )}
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', borderTop: '1px solid var(--border)', background: 'var(--surface-1)' }}>
          <button
            type="button"
            onClick={() => { setActiveTab('technicals'); setTradeSuccess(false); }}
            style={{
              flex: 1, padding: '12px', fontSize: '0.8rem', fontWeight: 600,
              color: activeTab === 'technicals' ? 'var(--electric)' : 'var(--text-secondary)',
              background: activeTab === 'technicals' ? 'rgba(0,212,255,0.05)' : 'transparent',
              border: 'none', borderBottom: `2px solid ${activeTab === 'technicals' ? 'var(--electric)' : 'transparent'}`,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', outline: 'none'
            }}
          >📊 Overview & Stats</button>
          <button
            type="button"
            onClick={() => setActiveTab('trade')}
            style={{
              flex: 1, padding: '12px', fontSize: '0.8rem', fontWeight: 600,
              color: activeTab === 'trade' ? 'var(--violet)' : 'var(--text-secondary)',
              background: activeTab === 'trade' ? 'rgba(167,139,250,0.05)' : 'transparent',
              border: 'none', borderBottom: `2px solid ${activeTab === 'trade' ? 'var(--violet)' : 'transparent'}`,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', outline: 'none'
            }}
          >⚡ Trade Simulator</button>
        </div>

        {activeTab === 'technicals' ? (
          <>
            {/* Technical Stats Grid */}
            <div style={{
              padding: '24px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)',
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px'
            }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Prev Open</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '4px' }}>{openPrice}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Daily High</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>{highPrice}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Daily Low</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>{lowPrice}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Vol (24h)</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '4px' }}>{volume}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Market Cap</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '4px' }}>{mcap}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>AI Confidence</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold)', marginTop: '4px' }}>94%</div>
              </div>
            </div>

            {/* Footer Actions */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                type="button"
                onClick={handleResearchClick}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                🤖 Generate AI Research Report
              </button>
              
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                Interactive charts represent simulated market movement. Click above to trigger deep fundamental analysis and trading insights powered by Gemini.
              </p>
            </div>
          </>
        ) : (
          /* Simulated Trading Panel */
          <div style={{ padding: '24px', background: 'var(--surface-2)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {tradeSuccess ? (
              <div className="animate-fade-in" style={{
                textAlign: 'center', padding: '20px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '10px', background: 'rgba(52,211,153,0.06)',
                border: '1px solid rgba(52,211,153,0.2)', borderRadius: '14px'
              }}>
                <span style={{ fontSize: '2.5rem' }}>✅</span>
                <h4 style={{ color: 'var(--emerald)', fontWeight: 800 }}>Order Executed Successfully</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Simulated order to {tradeType.toUpperCase()} {tradeAmount} {market.ticker || market.name} filled at market price.
                </p>
                <button
                  type="button"
                  onClick={() => setTradeSuccess(false)}
                  style={{
                    marginTop: '8px', padding: '6px 14px', background: 'var(--surface-3)',
                    border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer',
                    fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)'
                  }}
                >New Trade</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setTradeType('buy')}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid ' + (tradeType === 'buy' ? 'var(--emerald)' : 'var(--border)'),
                      background: tradeType === 'buy' ? 'rgba(52,211,153,0.1)' : 'transparent',
                      color: tradeType === 'buy' ? 'var(--emerald)' : 'var(--text-muted)',
                      fontWeight: 700, cursor: 'pointer', outline: 'none'
                    }}
                  >BUY</button>
                  <button
                    type="button"
                    onClick={() => setTradeType('sell')}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid ' + (tradeType === 'sell' ? 'var(--rose)' : 'var(--border)'),
                      background: tradeType === 'sell' ? 'rgba(251,113,133,0.1)' : 'transparent',
                      color: tradeType === 'sell' ? 'var(--rose)' : 'var(--text-muted)',
                      fontWeight: 700, cursor: 'pointer', outline: 'none'
                    }}
                  >SELL</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Quantity</label>
                  <input
                    type="number"
                    min="0.0001"
                    value={tradeAmount}
                    onChange={e => setTradeAmount(e.target.value)}
                    style={{
                      background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '8px',
                      padding: '10px 12px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <span>Est. Market Price:</span>
                  <span className="font-mono" style={{ fontWeight: 700 }}>{tickerPrice}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <span>Est. Total Cost:</span>
                  <span className="font-mono" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {((parseFloat(tradeAmount) || 0) * (parseFloat(tickerPrice.replace(/,/g, '')) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setTradeSuccess(true)}
                  style={{
                    marginTop: '8px', padding: '12px', background: tradeType === 'buy' ? 'var(--emerald)' : 'var(--rose)',
                    color: '#000', fontWeight: 800, border: 'none', borderRadius: '8px', cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Confirm simulated {tradeType.toUpperCase()}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
