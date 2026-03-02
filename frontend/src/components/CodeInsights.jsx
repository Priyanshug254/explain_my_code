import React from 'react';

const CodeInsights = ({ code }) => {
  if (!code) return null;

  // Mock insights generation based on code characteristics
  const generateInsights = (code) => {
    const lines = code.split('\n').length;
    const chars = code.length;
    
    // Simplistic mock scoring logic
    const complexity = Math.min(95, Math.max(10, Math.floor(lines / 10) + (chars % 20)));
    const security = Math.min(100, Math.max(40, 100 - (code.includes('eval') || code.includes('innerHTML') ? 30 : 0)));
    const maintainability = Math.min(100, Math.max(30, 100 - Math.floor(lines / 5)));

    return [
      { label: 'Complexity', value: complexity, color: complexity > 70 ? '#ff4757' : complexity > 40 ? '#ffa502' : '#2ed573' },
      { label: 'Security', value: security, color: security < 60 ? '#ff4757' : '#2ed573' },
      { label: 'Maintainability', value: maintainability, color: maintainability < 50 ? '#ff4757' : '#2ed573' }
    ];
  };

  const insights = generateInsights(code);

  return (
    <div style={{
      padding: '12px',
      background: 'rgba(0,0,0,0.3)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      gap: '20px',
      justifyContent: 'center'
    }}>
      {insights.map((stat, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
             <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${stat.value}%`, background: stat.color, transition: 'width 0.5s ease' }}></div>
             </div>
             <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: stat.color }}>{stat.value}%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CodeInsights;
