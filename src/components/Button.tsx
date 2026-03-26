import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', children, style, ...props }: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    fontSize: '14px',
    opacity: props.disabled ? 0.6 : 1,
    ...(variant === 'primary'
      ? { backgroundColor: '#1976d2', color: '#fff' }
      : { backgroundColor: '#e0e0e0', color: '#333' }),
    ...style,
  };

  return (
    <button style={baseStyle} {...props}>
      {children}
    </button>
  );
}
