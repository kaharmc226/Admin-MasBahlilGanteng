import React from 'react'
import { motion } from 'framer-motion'

export const FoodItem3D = ({ 
  src, 
  top, 
  left, 
  right, 
  bottom, 
  size = 120, 
  delay = 0, 
  rotate = 0,
  position = 'fixed'
}) => (
  <motion.div
    initial={{ y: 0, opacity: 0, scale: 0.5, rotate }}
    animate={{ 
      y: [0, -40, 0],
      rotate: [rotate, rotate + 15, rotate - 15, rotate],
      opacity: 0.25,
      scale: 1
    }}
    transition={{ 
      duration: 5 + Math.random() * 3, 
      repeat: Infinity, 
      ease: 'easeInOut',
      delay 
    }}
    style={{
      position,
      top, left, right, bottom,
      width: size,
      height: size,
      zIndex: 0,
      pointerEvents: 'none',
      filter: 'blur(1px) drop-shadow(0 25px 50px rgba(0,0,0,0.15))'
    }}
  >
    <img 
      src={src} 
      alt="food decoration" 
      style={{ 
        width: '100%', 
        height: '100%', 
        objectFit: 'cover', 
        borderRadius: '50%', 
        border: '4px solid white', 
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1) ' + (position === 'absolute' ? ', 0 20px 40px rgba(0,0,0,0.2)' : '')
      }} 
    />
  </motion.div>
)

export default FoodItem3D
