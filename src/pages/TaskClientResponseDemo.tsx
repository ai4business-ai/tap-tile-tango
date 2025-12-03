import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const TaskClientResponseDemo = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'testing' | 'solution'>('testing');
  const [testingPrompt, setTestingPrompt] = useState('');
  const [solutionPrompt, setSolutionPrompt] = useState('');

  return (
    <div className="min-h-screen bg-[#FFFFFF] px-4 pb-8 pt-4 w-full md:max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-[#4b5563]" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-[#111827] mb-1">Ответ клиенту</h1>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-medium text-[#F37168] border border-[#F37168]/30 rounded-full bg-transparent">
              Basic
            </span>
            <p className="text-sm text-[#4b5563]">Коммуникация и работа в команде</p>
          </div>
        </div>
      </div>

      {/* Описание и Контекст */}
      <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg p-6 mb-6">
        {/* Описание задания */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#111827] mb-4">Описание задания</h2>
          <div className="space-y-4">
            <p className="text-[16px] text-[#4b5563] leading-relaxed">
              Вы — специалист отдела по работе с корпоративными клиентами телеком-компании «СвязьБизнес». Ваш клиент, ООО «Торговые сети», управляет сетью из 30 супермаркетов в городе. Два месяца назад вы заключили с ними выгодный контракт на предоставление пакета услуг: выделенные интернет-каналы, облачная АТС и видеонаблюдение.
            </p>
            <p className="text-[16px] text-[#4b5563] leading-relaxed">
              Сегодня утром вы получили электронное письмо от IT-директора ООО «Торговые сети», Анны Ковалевой. Письмо написано в резком и раздраженном тоне. Клиент требует объяснений, почему перенос офисных линий в новый бизнес-центр, запланированный и согласованный на 15 октября, был перенесен на 5 ноября без ее ведома. Она угрожает расторжением договора и переходом к конкуренту, так как из-за переноса срывается открытие их флагманского магазина.
            </p>
          </div>
        </div>

        {/* Выдержка из письма клиента */}
        <div className="bg-[#f9fafb] rounded-xl p-6 border-l-4 border-[#8277EC] mb-6">
          <h3 className="text-[15px] font-bold text-[#111827] mb-4">Выдержка из письма клиента</h3>
          <div className="space-y-2 mb-4">
            <p className="text-[#111827] font-semibold not-italic">Тема: Срыв сроков подключения по договору №ТК-78/02</p>
            <p className="text-[#111827] font-semibold not-italic">От: Анна Ковалева, IT-директор ООО «Торговые сети»</p>
          </div>
          <div className="space-y-3">
            <p className="text-[15px] text-[#4b5563] italic leading-relaxed">
              "В каком ужасном положении оказалась ваша компания? Сегодня 11 октября, а в наш новый головной офис до сих пор не подключен интернет и телефонная связь! Напоминаю, что подключение было согласовано на 15 октября."
            </p>
            <p className="text-[15px] text-[#4b5563] italic leading-relaxed">
              "Из-за вашей халатности и полного отсутствия коммуникации мы вынуждены переносить открытие флагманского магазина. Несмотря на многолетнее сотрудничество, мы шокированы таким непрофессионализмом."
            </p>
            <p className="text-[15px] text-[#4b5563] italic leading-relaxed">
              "Требую в течение дня предоставить официальные разъяснения и новый, окончательный план работ. В противном случае мы будем вынуждены расторгнуть все договоры и обратиться к вашему конкуренту."
            </p>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="relative bg-white/85 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg p-6 overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#8277EC]"></div>
          <h3 className="text-lg font-bold text-[#111827] mb-4 pl-3">Дополнительная информация</h3>
          <ul className="space-y-3 pl-3">
            <li className="flex items-start gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1956FF] mt-2 flex-shrink-0"></span>
              <span className="text-[#4b5563]">Управляющая компания бизнес-центра не предоставила доступ к кабельной инфраструктуре в срок из-за проверок госорганов</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1956FF] mt-2 flex-shrink-0"></span>
              <span className="text-[#4b5563]">Инженеры оперативно разработали и согласовали альтернативный маршрут прокладки кабеля</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1956FF] mt-2 flex-shrink-0"></span>
              <span className="text-[#4b5563]">Все технические работы будут завершены к 3 ноября</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1956FF] mt-2 flex-shrink-0"></span>
              <span className="text-[#4b5563]">Два дополнительных дня (4-5 ноября) заложены на обязательное тестирование всех услуг перед сдачей клиенту</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Ваша задача */}
      <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-[#111827] mb-4">Ваша задача</h2>
        <p className="text-[#4b5563] mb-6">
          Составьте промпт для ИИ, чтобы он сгенерировал для вас черновик письма Анне Ковалевой, максимально соответствующий требованиям ниже.
        </p>

        {/* Требования к ответу */}
        <div className="mb-6">
          <h3 className="font-bold text-[#111827] mb-4">Требования к ответу:</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-[#F37168] font-bold">✓</span>
              <span className="text-[#111827]"><span className="font-semibold">Признание проблемы:</span> Четко признайте факт переноса сроков и нашу ошибку в несвоевременном уведомлении</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#F37168] font-bold">✓</span>
              <span className="text-[#111827]"><span className="font-semibold">Искренние извинения:</span> Принесите извинения за доставленные неудобства и срыв ее планов</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#F37168] font-bold">✓</span>
              <span className="text-[#111827]"><span className="font-semibold">Объяснение причин:</span> Спокойно, без оправданий, объясните цепочку событий</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#F37168] font-bold">✓</span>
              <span className="text-[#111827]"><span className="font-semibold">Конкретный план:</span> Предложите новый, реалистичный план с датами</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#F37168] font-bold">✓</span>
              <span className="text-[#111827]"><span className="font-semibold">Деловой и уважительный тон:</span> Сохраняйте профессионализм</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#F37168] font-bold">✓</span>
              <span className="text-[#111827]"><span className="font-semibold">Цель:</span> Восстановить доверие и подтвердить наши обязательства</span>
            </li>
          </ul>
        </div>

        {/* Подсказка */}
        <div className="relative bg-white/85 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg p-6 overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#8277EC]"></div>
          <h3 className="font-bold text-[#111827] mb-3 pl-3">💡 Подсказка</h3>
          <p className="text-sm font-medium text-[#111827] mb-4 pl-3">Подумайте над структурой вашего промпта. Что должен знать ИИ, чтобы помочь вам?</p>
          <ul className="space-y-2 pl-3">
            <li className="flex items-start gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1956FF] mt-2 flex-shrink-0"></span>
              <span className="text-sm text-[#4b5563]"><span className="font-bold text-[#111827]">Роль:</span> Кто я? (Специалист отдела по работе с клиентами...)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1956FF] mt-2 flex-shrink-0"></span>
              <span className="text-sm text-[#4b5563]"><span className="font-bold text-[#111827]">Контекст:</span> Что произошло? (Клиент зол, потому что...)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1956FF] mt-2 flex-shrink-0"></span>
              <span className="text-sm text-[#4b5563]"><span className="font-bold text-[#111827]">Факты:</span> Какие объективные данные нужно включить? (Даты, причины, технические детали...)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1956FF] mt-2 flex-shrink-0"></span>
              <span className="text-sm text-[#4b5563]"><span className="font-bold text-[#111827]">Задача:</span> Какую цель я преследую? (Извиниться, объяснить, предложить новый четкий план...)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1956FF] mt-2 flex-shrink-0"></span>
              <span className="text-sm text-[#4b5563]"><span className="font-bold text-[#111827]">Тон и стиль:</span> Каким должен быть язык письма? (Деловой, уважительный, эмпатичный...)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Критерии оценки */}
      <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-[#111827] mb-4">Критерии оценки</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-[#F37168] font-bold">✓</span>
            <span className="text-[15px] text-[#4b5563]">Полнота промпта (все необходимые элементы присутствуют)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#F37168] font-bold">✓</span>
            <span className="text-[15px] text-[#4b5563]">Четкость инструкций для ИИ</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#F37168] font-bold">✓</span>
            <span className="text-[15px] text-[#4b5563]">Структурированность (роль, контекст, задача, тон)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#F37168] font-bold">✓</span>
            <span className="text-[15px] text-[#4b5563]">Конкретика (даты, факты, детали включены)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#F37168] font-bold">✓</span>
            <span className="text-[15px] text-[#4b5563]">Эмпатия и бизнес-тон</span>
          </li>
        </ul>
      </div>

      {/* Рабочая область */}
      <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg p-6">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('testing')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'testing'
                  ? 'text-[#F37168] border border-[#F37168]/30 bg-transparent shadow-sm'
                  : 'text-[#4b5563] border border-transparent'
              }`}
            >
              Тестирование
            </button>
            <button
              onClick={() => setActiveTab('solution')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'solution'
                  ? 'text-[#F37168] border border-[#F37168]/30 bg-transparent shadow-sm'
                  : 'text-[#4b5563] border border-transparent'
              }`}
            >
              Решение
            </button>
          </div>
          <span className="px-3 py-1 text-[12px] font-medium text-[#F37168] border border-[#F37168]/30 rounded-full bg-transparent">
            Попыток: 5/5
          </span>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'testing' ? (
          <div>
            <h3 className="text-lg font-bold text-[#111827] mb-2">Проверьте ваш промпт</h3>
            <p className="text-sm text-[#4b5563] mb-4">Напишите вариант промта и протестируйте результат перед отправкой.</p>
            <Textarea
              value={testingPrompt}
              onChange={(e) => setTestingPrompt(e.target.value)}
              placeholder="Напишите промт для его тестирования"
              className="min-h-[160px] bg-[#f9fafb] border-[#4b5563] rounded-xl mb-3"
              maxLength={4000}
            />
            <div className="flex justify-between items-center mb-4">
              <span className="text-[12px] font-medium text-[#4b5563]">{testingPrompt.length}/4000 символов</span>
            </div>
            <Button 
              className="w-full py-3 bg-[#FFFFFF] text-[#F37168] border-2 border-[#F37168] rounded-xl font-medium hover:bg-[#F37168] hover:text-white transition-all shadow-none"
              disabled={!testingPrompt.trim()}
            >
              Протестировать промпт
            </Button>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-bold text-[#111827] mb-2">Финальное решение</h3>
            <p className="text-sm text-[#4b5563] mb-4">Вставьте итоговый промпт, который вы считаете лучшим.</p>
            <Textarea
              value={solutionPrompt}
              onChange={(e) => setSolutionPrompt(e.target.value)}
              placeholder="Вставьте ваш финальный промт здесь"
              className="min-h-[160px] bg-[#FFFFFF] border-[#4b5563] rounded-xl mb-3"
              maxLength={4000}
            />
            <div className="flex justify-between items-center mb-4">
              <span className="text-[12px] font-medium text-[#4b5563]">{solutionPrompt.length}/4000 символов</span>
            </div>
            <Button 
              className="w-full py-3 bg-[#FFFFFF] text-[#F37168] border-2 border-[#F37168] rounded-xl font-medium hover:bg-[#F37168] hover:text-white transition-all shadow-none"
              disabled={!solutionPrompt.trim()}
            >
              Отправить на проверку
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskClientResponseDemo;
