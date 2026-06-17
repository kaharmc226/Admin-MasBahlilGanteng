import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export const Modal = ({ 
  isOpen,
  onClose, 
  title, 
  subtitle,
  children, 
  type = 'slide', // 'slide' or 'center'
  width = '480px'
}) => {
  const isSlide = type === 'slide';

  // Parse width — support both 'max-w-md' style and direct px values
  const resolvedWidth = width.includes('max-w') 
    ? { 'max-w-sm': '384px', 'max-w-md': '448px', 'max-w-lg': '512px', 'max-w-xl': '576px', 'max-w-2xl': '672px' }[width] || '480px'
    : width;

  return (
    <motion.div 
      key="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: isSlide ? 'stretch' : 'center',
        justifyContent: isSlide ? 'flex-end' : 'center',
      }}
    >
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Content */}
      <motion.div 
        initial={isSlide ? { x: '100%' } : { scale: 0.9, opacity: 0 }}
        animate={isSlide ? { x: 0 } : { scale: 1, opacity: 1 }}
        exit={isSlide ? { x: '100%' } : { scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: resolvedWidth,
          ...(isSlide 
            ? { height: '100%' } 
            : { borderRadius: '16px', maxHeight: '90vh' }
          ),
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          borderBottom: '1px solid var(--border, #e2e8f0)',
        }}>
          <div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '950', 
              color: 'var(--text-main, #0f172a)', 
              letterSpacing: '-0.5px',
              margin: 0,
            }}>{title}</h2>
            {subtitle && (
              <p style={{ 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: 'var(--text-muted, #64748b)', 
                marginTop: '4px',
                margin: '4px 0 0 0',
              }}>{subtitle}</p>
            )}
          </div>
          <button 
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: '50%',
              background: '#f1f5f9',
              border: 'none',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              transition: 'background 0.2s',
              flexShrink: 0,
            }}
          >
            <X size={20} color="#64748b" />
          </button>
        </div>

        {/* Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
        }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};
