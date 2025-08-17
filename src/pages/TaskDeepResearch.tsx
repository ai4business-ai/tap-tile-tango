import React, { useState } from 'react';
import { ArrowLeft, Search, Target, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TaskDeepResearch = () => {
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
          <h1 className="text-xl font-semibold text-foreground">Освоение Deep Research</h1>
          <p className="text-sm text-muted-foreground">PRO уровень</p>
        </div>
      </div>

      {/* Task Description */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Search className="w-5 h-5 text-primary" />
            Описание задания
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Вам поручили провести исследование для стратегического решения: выход на новый рынок, запуск продукта или выбор технологии. Нужен комплексный анализ с разных сторон, а не поверхностный обзор.
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
              <li>• Выберите актуальную для вашей работы тему исследования</li>
              <li>• Создайте промпт с краткой формулировкой проблемы (2-3 предложения)</li>
              <li>• Расширьте до детального брифа с контекстом</li>
              <li>• Включите 5-7 конкретных исследовательских вопросов</li>
              <li>• Укажите желаемую структуру результата</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Покажите итеративный процесс:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Версия 1: Базовый запрос</li>
              <li>• Версия 2: Расширенный промпт</li>
              <li>• Версия 3: Промпт для Deep Research</li>
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
            <li>• Исследование охватывает минимум 5 аспектов темы</li>
            <li>• Использует 10+ источников информации</li>
            <li>• Содержит противоположные точки зрения</li>
            <li>• Дает actionable рекомендации</li>
          </ul>
          <div className="mt-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="text-sm text-foreground font-medium">💡 Подсказка:</p>
            <p className="text-sm text-muted-foreground mt-1">
              Deep Research работает лучше, когда вы даете ему роль (консультант, аналитик) и четкие критерии оценки информации.
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
            placeholder="Опишите выбранную тему, приложите все три версии промптов и результаты исследования..."
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

export default TaskDeepResearch;