
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface AnswerFormProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const AnswerForm = ({ value, onChange, disabled }: AnswerFormProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-3">Задание</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        Скачай табличку и проанализируй её. Твоя задача с помощью GPT составить SQL запрос для того, чтобы выявить сумму всех транзакций у клиентов, чьё LTV больше 5000 рублей
      </p>
      
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground block">Ваш ответ:</label>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Вставьте ваш SQL-запрос и описание анализа..."
          className="min-h-[120px]"
          disabled={disabled}
          maxLength={4000}
        />
        <div className="text-sm text-muted-foreground mt-1">
          {value.length}/4000 символов
        </div>
      </div>
    </div>
  );
};
