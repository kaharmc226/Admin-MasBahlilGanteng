import React from 'react';

export const Input = ({ label, type = 'text', className = '', style: customStyle = {}, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {label && (
        <label style={{ 
          fontSize: '0.8rem', 
          fontWeight: '800', 
          color: 'var(--text-muted, #64748b)',
          letterSpacing: '0.5px',
        }}>{label}</label>
      )}
      <input 
        type={type}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '12px',
          border: '2px solid var(--border, #e2e8f0)',
          background: 'var(--bg, #f8fafc)',
          color: 'var(--text-main, #0f172a)',
          fontWeight: '600',
          fontSize: '0.95rem',
          fontFamily: 'inherit',
          outline: 'none',
          transition: 'border-color 0.2s',
          boxSizing: 'border-box',
          ...customStyle,
        }}
        onFocus={(e) => { e.target.style.borderColor = 'var(--primary, #10b981)'; }}
        onBlur={(e) => { e.target.style.borderColor = 'var(--border, #e2e8f0)'; }}
        {...props}
      />
    </div>
  );
};

export const Select = ({ label, options, className = '', style: customStyle = {}, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {label && (
        <label style={{ 
          fontSize: '0.8rem', 
          fontWeight: '800', 
          color: 'var(--text-muted, #64748b)',
          letterSpacing: '0.5px',
        }}>{label}</label>
      )}
      <select 
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '12px',
          border: '2px solid var(--border, #e2e8f0)',
          background: 'var(--bg, #f8fafc)',
          color: 'var(--text-main, #0f172a)',
          fontWeight: '600',
          fontSize: '0.95rem',
          fontFamily: 'inherit',
          outline: 'none',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
          boxSizing: 'border-box',
          ...customStyle,
        }}
        onFocus={(e) => { e.target.style.borderColor = 'var(--primary, #10b981)'; }}
        onBlur={(e) => { e.target.style.borderColor = 'var(--border, #e2e8f0)'; }}
        {...props}
      >
        {options.map((opt, i) => (
          <option key={i} value={opt.value || opt}>{opt.label || opt}</option>
        ))}
      </select>
    </div>
  );
};
