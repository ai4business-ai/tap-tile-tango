import React, { useState } from 'react';
import { ArrowLeft, FileText, Target, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PromptTester } from '@/components/PromptTester';
import { TutorChat } from '@/components/TutorChat';

const TaskFeedback = () => {
  const navigate = useNavigate();
  const [showDescription, setShowDescription] = useState(true);
  const [showTask, setShowTask] = useState(true);
  const [showCriteria, setShowCriteria] = useState(true);

  const taskContent = (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Описание задания
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowDescription(!showDescription)} className="h-6 px-2">
              {showDescription ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        {showDescription && (
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Компания «Инновация» планирует запустить новую функцию «Умный помощник» в своем мобильном приложении. Эта функция использует ИИ для анализа финансовых привычек пользователя и дает персональные рекомендации по экономии и инвестициям.
            </p>
            <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/30">
              <h4 className="text-sm font-semibold text-foreground mb-2">⚠️ Проблема:</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Юридический отдел заблокировал запуск фичи. Юристы считают, что рекомендации ИИ могут быть истолкованы как финансовая консультация, что требует специальной лицензии и несет огромные риски для компании (иски, штрафы, репутационный ущерб).
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                Команда продукта и маркетинга в ярости, так как все готово к запуску промо-кампании, а конкуренты уже выпускают похожие функции.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <h4 className="text-sm font-semibold text-foreground mb-2">Аргументы юристов:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>Нужна лицензия на финансовое консультирование</li>
                  <li>Высокие риски исков от пользователей</li>
                  <li>Возможны штрафы от регуляторов</li>
                  <li>Репутационные риски для компании</li>
                </ul>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <h4 className="text-sm font-semibold text-foreground mb-2">Аргументы команды продукта:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>Конкуренты уже запустили похожие функции</li>
                  <li>Промо-кампания готова к запуску</li>
                  <li>Пользователи ждут эту функцию</li>
                  <li>Упущенная выгода</li>
                </ul>
              </div>
            </div>
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
              <h4 className="text-sm font-semibold text-foreground mb-2">Ваша роль:</h4>
              <p className="text-sm text-muted-foreground">
                Вам, как продакт-менеджеру, поручили найти компромиссное решение. Вам нужно быстро проанализировать аргументы сторон и дать конструктивную обратную связь коллегам из юридического отдела.
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Ваша задача
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowTask(!showTask)} className="h-6 px-2">
              {showTask ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        {showTask && (
          <CardContent className="space-y-4">
            <p className="text-sm font-medium text-foreground">
              Составьте промпт для ИИ, который поможет вам подготовить конструктивный ответ юристам и предложить решение.
            </p>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Цель промпта:</h4>
              <p className="text-sm text-muted-foreground">
                Получить от ИИ проект письма с конструктивной обратной связью по ситуации для юридического отдела.
              </p>
            </div>
            <div className="bg-accent/20 rounded-lg p-4 border border-accent">
              <h4 className="text-sm font-semibold text-foreground mb-2">Письмо должно включать:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><strong>1. Понимание их позиции и рисков</strong><br/>Покажите, что вы услышали и поняли их аргументы</li>
                <li><strong>2. Предложение конкретных решений</strong><br/>Вместо спора — конструктивное предложение по изменению текста функции</li>
                <li><strong>3. Варианты нового текста (3-4 варианта)</strong><br/>Описание функции «Умный помощник», которое:
                  <ul className="ml-4 mt-1 space-y-1 list-disc list-inside">
                    <li>Сохраняет пользу и привлекательность для пользователя</li>
                    <li>Исключает формулировки про «финансовую консультацию»</li>
                    <li>Юридически безопасно</li>
                  </ul>
                </li>
                <li><strong>4. Нацеленность на сотрудничество</strong><br/>Предложите совместно доработать варианты</li>
              </ul>
            </div>
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
              <h4 className="text-sm font-semibold text-foreground mb-2">💡 Подсказка:</h4>
              <p className="text-sm text-muted-foreground mb-2">Структура эффективного промпта:</p>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                <li><strong>Роль:</strong> Кто вы в этой ситуации?</li>
                <li><strong>Контекст:</strong> Опишите ситуацию и позиции сторон</li>
                <li><strong>Задача:</strong> Что конкретно нужно создать?</li>
                <li><strong>Требования:</strong> Какие элементы должны быть в письме?</li>
                <li><strong>Тон:</strong> Конструктивный, эмпатичный, нацеленный на сотрудничество</li>
              </ul>
            </div>
          </CardContent>
        )}
      </Card>

      <Card className="mb-6 lg:mb-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Критерии оценки
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowCriteria(!showCriteria)} className="h-6 px-2">
              {showCriteria ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        {showCriteria && (
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Эмпатия к позиции юристов</li>
              <li>✓ Конструктивность предложений</li>
              <li>✓ Юридическая безопасность альтернативных формулировок</li>
              <li>✓ Тон сотрудничества (не конфронтации)</li>
              <li>✓ Практичность решения</li>
              <li>✓ Наличие 3-4 вариантов текста функции</li>
            </ul>
          </CardContent>
        )}
      </Card>
    </>
  );

  const workContent = (
    <>
      <PromptTester 
        taskContext="feedback-colleagues"
        taskId="feedback-colleagues-task"
        placeholder="Напишите промпт для составления конструктивной обратной связи юристам..."
      />
      <TutorChat
        taskContext="feedback-colleagues"
        taskId="feedback-colleagues"
        skillSlug="communication"
        placeholder="Вставьте ваш промпт для оценки тьютором..."
        label="Ваш промпт для ИИ:"
      />
    </>
  );

  return (
    <div className="min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/skill-assignments/communication')}
          className="w-8 h-8 flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Обратная связь коллегам</h1>
          <p className="text-sm text-muted-foreground">BASIC уровень | Коммуникация и работа в команде</p>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-6">
        <div className="lg:sticky lg:top-8 lg:self-start">{taskContent}</div>
        <div>{workContent}</div>
      </div>
    </div>
  );
};

export default TaskFeedback;
