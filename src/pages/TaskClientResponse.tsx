import React, { useState } from 'react';
import { ArrowLeft, FileText, Target, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PromptTester } from '@/components/PromptTester';
import { TutorChat } from '@/components/TutorChat';

const TaskClientResponse = () => {
  const navigate = useNavigate();
  const [showDescription, setShowDescription] = useState(true);
  const [showTask, setShowTask] = useState(true);
  const [showCriteria, setShowCriteria] = useState(true);

  const taskContent = (
    <>
      {/* Task Description */}
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
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Вы — специалист отдела по работе с корпоративными клиентами телеком-компании «СвязьБизнес». Ваш клиент, ООО «Торговые сети», управляет сетью из 30 супермаркетов в городе. Два месяца назад вы заключили с ними выгодный контракт на предоставление пакета услуг: выделенные интернет-каналы, облачная АТС и видеонаблюдение.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Сегодня утром вы получили электронное письмо от IT-директора ООО «Торговые сети», Анны Ковалевой. Письмо написано в резком и раздраженном тоне. Клиент требует объяснений, почему перенос офисных линий в новый бизнес-центр, запланированный и согласованный на 15 октября, был перенесен на 5 ноября без ее ведома. Она угрожает расторжением договора и переходом к конкуренту, так как из-за переноса срывается открытие их флагманского магазина.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <h4 className="text-sm font-semibold text-foreground mb-2">Выдержка из письма клиента:</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="italic">Тема: Срыв сроков подключения по договору №ТК-78/02</p>
                  <p>От: Анна Ковалева, IT-директор ООО «Торговые сети»</p>
                  <p className="mt-3">"В каком ужасном положении оказалась ваша компания? Сегодня 11 октября, а в наш новый головной офис до сих пор не подключен интернет и телефонная связь! Напоминаю, что подключение было согласовано на 15 октября."</p>
                  <p className="mt-2">"Из-за вашей халатности и полного отсутствия коммуникации мы вынуждены переносить открытие флагманского магазина. Несмотря на многолетнее сотрудничество, мы шокированы таким непрофессионализмом."</p>
                  <p className="mt-2">"Требую в течение дня предоставить официальные разъяснения и новый, окончательный план работ. В противном случае мы будем вынуждены расторгнуть все договоры и обратиться к вашему конкуренту."</p>
                </div>
              </div>
              <div className="bg-accent/20 rounded-lg p-4 border border-accent">
                <h4 className="text-sm font-semibold text-foreground mb-2">Дополнительная информация:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>Управляющая компания бизнес-центра не предоставила доступ к кабельной инфраструктуре в срок из-за проверок госорганов</li>
                  <li>Инженеры оперативно разработали и согласовали альтернативный маршрут прокладки кабеля</li>
                  <li>Все технические работы будут завершены к 3 ноября</li>
                  <li>Два дополнительных дня (4-5 ноября) заложены на обязательное тестирование всех услуг перед сдачей клиенту</li>
                </ul>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Task Requirements */}
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
              Составьте промпт для ИИ, чтобы он сгенерировал для вас черновик письма Анне Ковалевой, максимально соответствующий требованиям ниже.
            </p>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Требования к ответу:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground list-decimal list-inside">
                <li><strong>Признание проблемы:</strong> Четко признайте факт переноса сроков и нашу ошибку в несвоевременном уведомлении</li>
                <li><strong>Искренние извинения:</strong> Принесите извинения за доставленные неудобства и срыв ее планов</li>
                <li><strong>Объяснение причин:</strong> Спокойно, без оправданий, объясните цепочку событий</li>
                <li><strong>Конкретный план:</strong> Предложите новый, реалистичный план с датами</li>
                <li><strong>Деловой и уважительный тон:</strong> Сохраняйте профессионализм</li>
                <li><strong>Цель:</strong> Восстановить доверие и подтвердить наши обязательства</li>
              </ul>
            </div>
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
              <h4 className="text-sm font-semibold text-foreground mb-2">💡 Подсказка:</h4>
              <p className="text-sm text-muted-foreground mb-2">Подумайте над структурой вашего промпта. Что должен знать ИИ, чтобы помочь вам?</p>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                <li><strong>Роль:</strong> Кто я? (Специалист отдела по работе с клиентами...)</li>
                <li><strong>Контекст:</strong> Что произошло? (Клиент зол, потому что...)</li>
                <li><strong>Факты:</strong> Какие объективные данные нужно включить? (Даты, причины, технические детали...)</li>
                <li><strong>Задача:</strong> Какую цель я преследую? (Извиниться, объяснить, предложить новый четкий план...)</li>
                <li><strong>Тон и стиль:</strong> Каким должен быть язык письма? (Деловой, уважительный, эмпатичный...)</li>
              </ul>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Evaluation Criteria */}
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
              <li>✓ Полнота промпта (все необходимые элементы присутствуют)</li>
              <li>✓ Четкость инструкций для ИИ</li>
              <li>✓ Структурированность (роль, контекст, задача, тон)</li>
              <li>✓ Конкретика (даты, факты, детали включены)</li>
              <li>✓ Эмпатия и бизнес-тон</li>
            </ul>
          </CardContent>
        )}
      </Card>
    </>
  );

  const workContent = (
    <>
      <PromptTester 
        taskContext="client-response"
        taskId="client-response-task"
        placeholder="Напишите промпт для ИИ, чтобы он составил письмо клиенту..."
      />
      <TutorChat
        taskContext="client-response"
        taskId="client-response"
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
          <h1 className="text-xl font-semibold text-foreground">Ответ клиенту</h1>
          <p className="text-sm text-muted-foreground">BASIC уровень | Коммуникация и работа в команде</p>
        </div>
      </div>

      {/* Desktop: 2-col, Mobile: stacked */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-6">
        <div className="lg:sticky lg:top-8 lg:self-start">{taskContent}</div>
        <div>{workContent}</div>
      </div>
    </div>
  );
};

export default TaskClientResponse;
