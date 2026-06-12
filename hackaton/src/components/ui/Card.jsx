import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <motion.div 
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
      className={`bg-white rounded-2xl border border-white shadow-card p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
