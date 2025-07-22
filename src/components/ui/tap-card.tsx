import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface TapCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TapCard: React.FC<TapCardProps> = ({ children, className, onClick }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = () => {
    setIsPressed(true);
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    onClick?.();
  };

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
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  );
};