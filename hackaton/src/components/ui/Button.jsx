import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  className = '', 
  style: customStyle = {},
  ...props 
}) => {
  const variantStyles = {
    primary: {
      background: 'var(--primary, #10b981)',
      color: 'white',
      border: 'none',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
    },
    secondary: {
      background: 'var(--primary-light, #f0fdf4)',
      color: 'var(--primary, #10b981)',
      border: 'none',
    },
    outline: {
      background: 'transparent',
      border: '2px solid var(--primary, #10b981)',
      color: 'var(--primary, #10b981)',
    },
    danger: {
      background: '#ef4444',
      color: 'white',
      border: 'none',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-muted, #64748b)',
      border: 'none',
    },
  };

  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '0.875rem' },
    md: { padding: '10px 20px', fontSize: '1rem' },
    lg: { padding: '14px 32px', fontSize: '1.1rem' },
  };

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;

  return (
    <motion.button 
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: '800',
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontFamily: 'inherit',
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...customStyle,
      }}
      {...props}
    >
      {Icon && <Icon size={iconSize} />}
      {children}
    </motion.button>
  );
};
