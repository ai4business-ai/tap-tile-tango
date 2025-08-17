import React, { useState } from 'react';
import { ArrowLeft, FileText, Target, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TaskDocumentAnalysis = () => {
  const navigate = useNavigate();
  const [userAnswer, setUserAnswer] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/skill-assignments/research')}
          className="w-8 h-8 flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Анализ объемного документа</h1>
          <p className="text-sm text-muted-foreground">BASIC уровень</p>
        </div>
      </div>

      {/* Task Description */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="w-5 h-5 text-primary" />
            Описание задания
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Представьте, что ваш руководитель переслал вам годовой отчет конкурента (или отраслевое исследование) со словами: "Посмотри, пожалуйста, что там важного. Мне нужны ключевые выводы к завтрашнему совещанию". У вас есть 30 минут и документ на 20+ страниц.
          </p>
        </CardContent>
      </Card>

      {/* Task Requirements */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="w-5 h-5 text-primary" />
            Ваша задача
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Шаги выполнения:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Выберите любой публичный документ объемом 20+ страниц</li>
              <li>• Создайте промпт для ИИ для анализа документа</li>
              <li>• Результат должен содержать ключевые цифры и факты</li>
              <li>• Основные выводы и тренды</li>
              <li>• Практические рекомендации</li>
              <li>• Все это на 1 странице A4</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Success Criteria */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckCircle className="w-5 h-5 text-primary" />
            Критерии успешного выполнения
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Executive summary читается за 2-3 минуты</li>
            <li>• Содержит 5-7 ключевых инсайтов</li>
            <li>• Структурирован по принципу "от важного к деталям"</li>
            <li>• Понятен человеку, не читавшему оригинал</li>
          </ul>
          <div className="mt-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="text-sm text-foreground font-medium">💡 Подсказка:</p>
            <p className="text-sm text-muted-foreground mt-1">
              Подумайте, как научить ИИ отличать важное от второстепенного именно для вашей бизнес-задачи.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Answer Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Ваш ответ</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Опишите выбранный документ, ваш промпт для ИИ и приложите получившееся executive summary..."
            className="min-h-[150px]"
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="mb-4">
        <Button className="w-full py-4 text-base font-medium">
          <CheckCircle className="w-4 h-4 mr-2" />
          Сдать задание
        </Button>
      </div>
    </div>
  );
};

export default TaskDocumentAnalysis;