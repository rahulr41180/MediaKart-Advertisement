
import React from 'react'
import "../CSS/CarComponent.css"

export const CarComponent = ({ position }) => {
  const maxBumpHeight = 50; // Adjust as needed for the bump height
  const totalDistance = 75; // The car will move up to 75% of the path

  const getYPosition = (pos) => {
    // Create a sine wave for the bump effect
    const bump = Math.sin((pos / totalDistance) * Math.PI) * maxBumpHeight;
    return bump;
    
  };

  const y = getYPosition(position);

  return (
    <div className="car" style={{
      left: `${position}%`,
      bottom: `${y}px`,
    }}>
      🚗
    </div>
  )
}