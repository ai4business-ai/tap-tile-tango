import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface BlurredAnswerBlockProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  isSubmitting?: boolean;
  canSubmit?: boolean;
  taskDescription?: string;
  placeholder?: string;
}

export const BlurredAnswerBlock = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  isSubmitting = false,
  canSubmit = true,
  taskDescription,
  placeholder = "Введите ваш ответ..."
}: BlurredAnswerBlockProps) => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  return (
    <Card className="p-6 relative">
      {!isUnlocked && (
        <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <Button
            onClick={handleUnlock}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg font-medium shadow-lg"
          >
            Сдать задание
          </Button>
        </div>
      )}
      
      <div className={!isUnlocked ? "filter blur-sm pointer-events-none" : ""}>
        <h3 className="text-lg font-semibold text-foreground mb-3">Ваш ответ</h3>
        {taskDescription && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {taskDescription}
          </p>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Ваш ответ:</label>
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="min-h-[120px]"
              disabled={disabled}
              maxLength={4000}
            />
            <div className="text-sm text-muted-foreground mt-1">
              {value.length}/4000 символов
            </div>
          </div>
          
          <Button
            onClick={onSubmit}
            disabled={!canSubmit || isSubmitting || disabled}
            className="w-full"
          >
            {isSubmitting ? "Отправка..." : "Сдать задание"}
          </Button>
        </div>
      </div>
    </Card>
  );
};