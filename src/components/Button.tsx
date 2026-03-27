import type { ButtonHTMLAttributes } from 'react';
import { theme } from '../styles/theme';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', children, style, ...props }: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: theme.radius.sm,
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    fontSize: '14px',
    fontFamily: theme.fontFamily,
    opacity: props.disabled ? 0.6 : 1,
    ...(variant === 'primary'
      ? { backgroundColor: theme.colors.primary, color: theme.colors.primaryText }
      : { backgroundColor: theme.colors.surfaceMuted, color: theme.colors.text }),
    ...style,
  };

  return (
    <button style={baseStyle} {...props}>
      {children}
    </button>
  );
}
