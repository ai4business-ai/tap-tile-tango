import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TapCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface TouchData {
  startX: number;
  startY: number;
  startTime: number;
}

export const TapCard: React.FC<TapCardProps> = ({ children, className, onClick }) => {
  const [isPressed, setIsPressed] = useState(false);
  const touchData = useRef<TouchData | null>(null);
  
  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchData.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now()
    };
    setIsPressed(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPressed(false);
    
    if (!touchData.current) return;
    
    const touch = e.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - touchData.current.startX);
    const deltaY = Math.abs(touch.clientY - touchData.current.startY);
    const deltaTime = Date.now() - touchData.current.startTime;
    
    // Consider it a tap if:
    // - Movement is less than 15px in any direction
    // - Touch duration is less than 500ms
    const isTap = deltaX < 15 && deltaY < 15 && deltaTime < 500;
    
    if (isTap) {
      onClick?.();
    }
    
    touchData.current = null;
  };

  const handleTouchCancel = () => {
    setIsPressed(false);
    touchData.current = null;
  };

  // Mouse event handlers (for desktop)
  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  return (
    <div
      className={cn(
        "transition-transform duration-150 ease-out cursor-pointer select-none",
        isPressed ? "scale-96" : "scale-100 active:scale-96",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={onClick} // Keep for desktop mouse clicks
    >
      {children}
    </div>
  );
};