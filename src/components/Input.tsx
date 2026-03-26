import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  return (
    <div style={{ marginBottom: '12px' }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
          {label}
        </label>
      )}
      <input
        style={{
          width: '100%',
          padding: '8px',
          border: `1px solid ${error ? '#d32f2f' : '#ccc'}`,
          borderRadius: '4px',
          fontSize: '14px',
          boxSizing: 'border-box',
          ...style,
        }}
        {...props}
      />
      {error && <span style={{ color: '#d32f2f', fontSize: '12px' }}>{error}</span>}
    </div>
  );
}
