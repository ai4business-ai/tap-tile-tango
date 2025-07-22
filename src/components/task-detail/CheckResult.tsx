
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CheckResultProps {
  score: number;
  feedback: string;
  suggestions?: string[];
}

export const CheckResult = ({ score, feedback, suggestions }: CheckResultProps) => {
  const getScoreBadgeVariant = (score: number): "default" | "destructive" | "outline" | "secondary" => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span>Результат проверки</span>
          <Badge variant={getScoreBadgeVariant(score)} className="ml-2">
            {score}/100
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">Обратная связь:</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feedback}
          </p>
        </div>
        
        {suggestions && suggestions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Рекомендации:</h4>
            <ul className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-muted-foreground">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
