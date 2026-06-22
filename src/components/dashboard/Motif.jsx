import React from 'react'

export const Motif = ({ icon: Icon, top, right, bottom, left, color, opacity = 0.05 }) => (
  <div style={{ position: 'absolute', top, right, bottom, left, opacity, pointerEvents: 'none', zIndex: 0 }}>
    <Icon size={120} color={color} />
  </div>
)

export default Motif
