
import React from 'react';
import { ArrowLeft, X } from 'lucide-react';

interface TaskHeaderProps {
  onBack: () => void;
  onClose: () => void;
  title: string;
  subtitle: string;
}

export const TaskHeader = ({ onBack, onClose, title, subtitle }: TaskHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <button 
        onClick={onClose}
        className="w-10 h-10 bg-muted rounded-2xl flex items-center justify-center"
      >
        <X className="w-5 h-5 text-foreground" />
      </button>
    </div>
  );
};
