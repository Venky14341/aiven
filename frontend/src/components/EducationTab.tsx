import { useState } from 'react';

interface Concept {
  term: string;
  definition: string;
  example: string;
  category: 'Equity' | 'Risk' | 'Forex/Commodities' | 'Crypto';
  icon: string;
  color: string;
}

const CONCEPTS: Concept[] = [
  {
    term: 'P/E Ratio (Price-to-Earnings)',
    definition: 'A valuation ratio calculated by dividing a company’s share price by its annual earnings per share. It shows what investors are willing to pay for every dollar of earnings.',
    example: 'A P/E of 30x means you are paying $30 for every $1 of annual earnings. Higher P/E often indicates high growth expectations, while lower P/E indicates undervaluation or slow growth.',
    category: 'Equity',
    icon: '📊',
    color: 'var(--electric)'
  },
  {
    term: 'Market Capitalization',
    definition: 'The total market value of a company’s outstanding shares of stock. It classifies companies into Large-Cap, Mid-Cap, or Small-Cap categories.',
    example: 'If a company has 10 million shares outstanding priced at $100 each, its Market Cap is $1 Billion (Mid-Cap). Larger caps are generally more stable but offer slower growth.',
    category: 'Equity',
    icon: '🏢',
    color: 'var(--electric)'
  },
  {
    term: 'Beta (β)',
    definition: 'A measure of a stock’s volatility in relation to the overall market. The market has a Beta of 1.0. A stock with a higher beta is more volatile, and lower is less volatile.',
    example: 'A Beta of 1.35 means the stock is 35% more volatile than the market. If the S&P 500 rises 10%, this stock is expected to rise 13.5%. If the market falls 10%, this stock falls 13.5%.',
    category: 'Risk',
    icon: '⚡',
    color: 'var(--rose)'
  },
  {
    term: 'Debt-to-Equity (D/E) Ratio',
    definition: 'A leverage ratio calculated by dividing total liabilities by shareholder equity. It measures the degree to which a company is financing its operations through debt versus wholly-owned funds.',
    example: 'A D/E ratio of 1.5 indicates that a company uses $1.50 of debt for every $1.00 of equity. High D/E ratios indicate higher risk of default, particularly when interest rates rise.',
    category: 'Risk',
    icon: '⚖️',
    color: 'var(--rose)'
  },
  {
    term: 'Bid-Ask Spread',
    definition: 'The difference between the highest price a buyer is willing to pay (bid) and the lowest price a seller is willing to accept (ask). It reflects market liquidity.',
    example: 'In the Forex market, if EUR/USD has a Bid of 1.0822 and an Ask of 1.0824, the spread is 2 pips. Highly liquid assets have tight spreads, minimizing transaction costs.',
    category: 'Forex/Commodities',
    icon: '💱',
    color: 'var(--gold)'
  },
  {
    term: 'Commodity Futures & Margin',
    definition: 'Futures are financial contracts obligating the buyer to purchase an asset (like Gold or Crude Oil) at a predetermined future date and price. Margin is the collateral required to open a position.',
    example: 'Trading Gold with 1:10 leverage means you only deposit $100 (Margin) to control $1,000 worth of Gold futures. This amplifies both gains and losses.',
    category: 'Forex/Commodities',
    icon: '🛢️',
    color: 'var(--gold)'
  },
  {
    term: 'Gas Fees (Crypto)',
    definition: 'Payments made by users to compensate for the computing energy required to process and validate transactions on a blockchain network like Ethereum.',
    example: 'Sending 1 ETH during high network traffic might cost $15 in Gas fees (gwei), whereas sending it during low traffic hours might cost only $1.50.',
    category: 'Crypto',
    icon: '⛽',
    color: 'var(--violet)'
  },
  {
    term: 'Market Dominance',
    definition: 'The ratio of a single cryptocurrency’s market capitalization relative to the total cryptocurrency market cap. It gauges market sentiment and capital rotation.',
    example: 'If Bitcoin has a market cap of $1.2 Trillion and the total crypto market cap is $2.4 Trillion, BTC Dominance is 50%. Rising dominance indicates risk-off investor sentiment.',
    category: 'Crypto',
    icon: '👑',
    color: 'var(--violet)'
  }
];

export const EducationTab = () => {
  const [filter, setFilter] = useState<'All' | 'Equity' | 'Risk' | 'Forex/Commodities' | 'Crypto'>('All');

  const filteredConcepts = CONCEPTS.filter(c => filter === 'All' || c.category === filter);

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Academy Banner */}
      <section className="glass" style={{ borderRadius: '24px', padding: '32px', position: 'relative', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', zIndex: 1, maxWidth: '800px' }}>
          <div className="badge badge-violet">🎓 Nova Academy</div>
          <h1 className="font-display" style={{ fontSize: '2.4rem', color: 'var(--text-primary)' }}>
            Understand the Markets & Metrics
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Navigate global markets with confidence. Below is a curated dictionary of key indicators, asset definitions, and calculations designed to help you interpret AI-generated research and real-time market tickers.
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <div style={{
        display: 'flex', gap: '8px', flexWrap: 'wrap',
        background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '12px 20px'
      }}>
        {(['All', 'Equity', 'Risk', 'Forex/Commodities', 'Crypto'] as const).map(cat => {
          const isActive = filter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              style={{
                background: isActive ? 'var(--surface-3)' : 'transparent',
                border: '1px solid ' + (isActive ? 'var(--violet)' : 'var(--border)'),
                borderRadius: '8px', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 600,
                color: isActive ? 'var(--violet)' : 'var(--text-secondary)', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', transition: 'all 0.15s', outline: 'none'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid of Concept Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filteredConcepts.map((item, idx) => (
          <div key={item.term} className="academy-card animate-fade-up" style={{ animationDelay: `${idx * 50}ms` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: `${item.color}15`, border: `1px solid ${item.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
              }}>
                {item.icon}
              </div>
              <div className="section-label" style={{ color: item.color }}>{item.category}</div>
            </div>
            
            <h3 className="academy-term">{item.term}</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
              {item.definition}
            </p>
            
            <div className="divider" style={{ margin: '14px 0' }} />
            
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.05em' }}>Real-World Example</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, fontStyle: 'italic' }}>
                {item.example}
              </p>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};
