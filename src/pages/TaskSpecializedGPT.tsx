import React, { useState } from 'react';
import { ArrowLeft, Bot, Target, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TaskSpecializedGPT = () => {
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
          <h1 className="text-xl font-semibold text-foreground">Создание специализированного GPT</h1>
          <p className="text-sm text-muted-foreground">AI-NATIVE уровень</p>
        </div>
      </div>

      {/* Task Description */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bot className="w-5 h-5 text-primary" />
            Описание задания
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Вы стали экспертом по работе с ИИ в своем отделе. Коллеги постоянно просят помочь с анализом типовых документов. Пора создать инструмент, который будет делать это автоматически.
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
              <li>• Определите тип документов, с которыми чаще всего работает ваш отдел</li>
              <li>• Создайте инструкцию (system prompt) для GPT</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">GPT должен уметь:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Понимать специфику вашей отрасли и терминологию</li>
              <li>• Знать, на что обращать внимание в документах</li>
              <li>• Выдавать результат в нужном формате</li>
              <li>• Задавать уточняющие вопросы при необходимости</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Включите в промпт:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Роль и экспертизу агента</li>
              <li>• Пошаговый алгоритм анализа</li>
              <li>• Шаблоны вывода результатов</li>
              <li>• Примеры хорошего анализа</li>
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
            <li>• GPT корректно обрабатывает 3+ разных документа</li>
            <li>• Использует профессиональную терминологию</li>
            <li>• Выдает стабильно качественный результат</li>
            <li>• Может обучить новичка основам анализа</li>
          </ul>
          <div className="mt-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="text-sm text-foreground font-medium">💡 Подсказка:</p>
            <p className="text-sm text-muted-foreground mt-1">
              Начните с описания того, как бы вы сами анализировали такой документ, затем переведите это в инструкции для ИИ.
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
            placeholder="Опишите тип документов вашего отдела, приложите полную инструкцию для GPT и примеры результатов его работы..."
            className="min-h-[150px]"
            maxLength={4000}
          />
          <div className="text-sm text-muted-foreground mt-1">
            {userAnswer.length}/4000 символов
          </div>
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

export default TaskSpecializedGPT;