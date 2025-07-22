import React from 'react';
import { Bell, ChevronRight } from 'lucide-react';
import { TapCard } from '@/components/ui/tap-card';
const Index = () => {
  const handleCardClick = (cardName: string) => {
    console.log(`Clicked: ${cardName}`);
  };
  return <div className="min-h-screen bg-background p-4 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <div className="w-6 h-6 bg-primary rounded-full"></div>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Моя цель</h1>
            <p className="text-sm text-muted-foreground">Достичь уровень 3 "AI-Native"</p>
          </div>
        </div>
        <Bell className="w-6 h-6 text-muted-foreground" />
      </div>

      {/* Tasks Section */}
      <TapCard className="mb-4" onClick={() => handleCardClick('Ваши задания')}>
        <div className="bg-card rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Ваши задания</h2>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="w-full bg-gray-light rounded-full h-2">
            <div className="bg-progress-blue h-2 rounded-full w-1/4"></div>
          </div>
        </div>
      </TapCard>

      {/* Module Card */}
      <TapCard className="mb-4" onClick={() => handleCardClick('Модуль 3.1')}>
        <div className="bg-card rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-accent rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-task-red rounded-sm transform rotate-45"></div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Модуль 3.2
            </p>
              <p className="text-sm font-medium text-foreground">Когортный анализ и SQL</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </TapCard>

      {/* Progress Card */}
      <TapCard className="mb-4" onClick={() => handleCardClick('Мой прогресс')}>
        <div className="bg-purple-gradient rounded-xl p-4 text-white relative overflow-hidden">
          <h3 className="text-lg font-semibold mb-1">Мой прогресс</h3>
          <p className="text-sm opacity-90 mb-4">5 навыков</p>
          <button className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Навык прокачен
          </button>
          <div className="absolute top-0 right-0 text-6xl opacity-30">📈</div>
        </div>
      </TapCard>

      {/* My Tasks Card */}
      <TapCard className="mb-4" onClick={() => handleCardClick('Мои задания')}>
        <div className="bg-green-gradient rounded-xl p-4 text-white relative overflow-hidden">
          <h3 className="text-lg font-semibold mb-1">Мои задания</h3>
          <p className="text-sm opacity-90 mb-4">15 заданий</p>
          <button className="bg-green-accent text-white px-4 py-2 rounded-lg text-sm font-medium">
            +5 заданий
          </button>
        </div>
      </TapCard>

      {/* Webinar Records Card */}
      <TapCard onClick={() => handleCardClick('Записи вебинаров')}>
        <div className="bg-purple-gradient rounded-xl p-4 text-white relative overflow-hidden">
          <h3 className="text-lg font-semibold mb-1">Записи вебинаров</h3>
          <p className="text-sm opacity-90 mb-4">6 вебинаров</p>
          <button className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Смотреть
          </button>
        </div>
      </TapCard>
    </div>;
};
export default Index;