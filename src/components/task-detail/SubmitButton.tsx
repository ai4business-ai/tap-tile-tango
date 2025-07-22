
import React from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  onClick: () => void;
  isSubmitting: boolean;
  disabled: boolean;
}

export const SubmitButton = ({ onClick, isSubmitting, disabled }: SubmitButtonProps) => {
  return (
    <div className="mt-6 mb-4 px-4 max-w-sm mx-auto">
      <Button 
        onClick={onClick}
        disabled={disabled}
        className="w-full py-4 text-base font-medium"
      >
        {isSubmitting ? (
          <>
            <Upload className="w-4 h-4 mr-2 animate-spin" />
            Отправляем...
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Сдать домашку
          </>
        )}
      </Button>
    </div>
  );
};
