import React from 'react';
import { Bell, ChevronRight, Target } from 'lucide-react';
import { TapCard } from '@/components/ui/tap-card';
import { useNavigate } from 'react-router-dom';
const Index = () => {
  const navigate = useNavigate();
  
  const handleCardClick = (cardName: string) => {
    if (cardName === 'Ваши задания' || cardName === 'Мои задания') {
      navigate('/tasks');
    } else if (cardName === 'Записи вебинаров') {
      navigate('/webinar-records');
    } else if (cardName === 'Мой прогресс') {
      navigate('/my-progress');
    } else if (cardName === 'Анализ данных') {
      navigate('/task/document-analysis');
    } else {
      console.log(`Clicked: ${cardName}`);
    }
  };
  return <div className="min-h-screen p-4 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="glass rounded-2xl p-3 bg-white/90 backdrop-blur-lg">
            <img 
              src="/lovable-uploads/2b30c222-0182-4f9f-90f1-5056bee4557e.png" 
              alt="Билайн логотип" 
              className="w-20 h-auto"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Моя цель</h1>
              <p className="text-sm text-muted-foreground">Достичь уровень 3 "AI-Native"</p>
            </div>
          </div>
        </div>
        
      </div>


      {/* Module Card */}
      <TapCard className="mb-4" onClick={() => handleCardClick('Анализ данных')}>
        <div className="glass-card rounded-2xl p-4 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-accent rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-task-red rounded-sm transform rotate-45"></div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Модуль 3.2</p>
              <p className="text-sm font-medium text-foreground">Анализ данных</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </TapCard>

      {/* Progress Card */}
      <TapCard className="mb-4" onClick={() => handleCardClick('Мой прогресс')}>
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-4 text-white relative overflow-hidden shadow-xl">
          <h3 className="text-lg font-semibold mb-1">Мой прогресс</h3>
          <p className="text-sm opacity-90 mb-4">8 навыков</p>
          <button className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Навык прокачен
          </button>
          
        </div>
      </TapCard>

      {/* My Tasks Card */}
      <TapCard className="mb-4" onClick={() => handleCardClick('Мои задания')}>
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-4 text-white relative overflow-hidden shadow-xl">
          <h3 className="text-lg font-semibold mb-1">Мои задания</h3>
          <p className="text-sm opacity-90 mb-3">89 заданий</p>
          
          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs opacity-80 mb-1">
              <span>Общий прогресс</span>
              <span>18/89</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500" 
                style={{ width: '20%' }}
              />
            </div>
          </div>
          
          <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
            +24 задания
          </button>
        </div>
      </TapCard>

      {/* Webinar Records Card */}
      <TapCard onClick={() => handleCardClick('Записи вебинаров')}>
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-4 text-white relative overflow-hidden shadow-xl">
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
