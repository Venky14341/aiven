import { FormEvent, useState } from 'react';

interface SearchBarProps {
  onSubmit: (companyName: string) => void;
  loading: boolean;
}

export const SearchBar = ({ onSubmit, loading }: SearchBarProps) => {
  const [value, setValue] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (value.trim()) onSubmit(value.trim());
  };

  const suggestions = ['Tesla', 'Apple', 'NVIDIA', 'Microsoft', 'Infosys'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <form id="research-form" onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'stretch' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{
            position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
            fontSize: '1.1rem', pointerEvents: 'none', zIndex: 1
          }}>🔍</span>
          <input
            id="company-search-input"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Search any company — Tesla, Apple, Infosys..."
            className="input-field"
            style={{ paddingLeft: '44px', paddingRight: '16px', borderRadius: '12px' }}
            disabled={loading}
          />
        </div>
        <button
          id="research-submit-btn"
          type="submit"
          disabled={loading || !value.trim()}
          className="btn-primary"
          style={{ whiteSpace: 'nowrap', borderRadius: '12px' }}
        >
          {loading ? (
            <>
              <span style={{
                width: '14px', height: '14px',
                border: '2px solid rgba(0,0,0,0.3)',
                borderTopColor: '#000',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'spin-slow 0.8s linear infinite'
              }} />
              Analyzing...
            </>
          ) : 'Analyze →'}
        </button>
      </form>

      {/* Quick suggestions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Try:</span>
        {suggestions.map(s => (
          <button
            key={s}
            type="button"
            onClick={() => { setValue(s); onSubmit(s); }}
            disabled={loading}
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '4px 12px',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,212,255,0.3)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--electric)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};
