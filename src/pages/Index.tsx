import React from 'react';
import { ChevronRight } from 'lucide-react';
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
  return <div className="min-h-screen p-4 md:p-6 lg:p-8 max-w-sm md:max-w-md lg:max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-center mb-8">
        <div className="glass-subtle rounded-xl px-4 py-2">
          <p className="text-xs text-muted-foreground font-medium">Здесь лого вашей компании</p>
        </div>
      </div>


      {/* Module Card */}
      <TapCard className="mb-4" onClick={() => handleCardClick('Анализ данных')}>
        <div className="glass-card rounded-2xl p-4 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-pastel-lavender rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-pastel-peach rounded-sm transform rotate-45"></div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Модуль 3.2</p>
              <p className="text-sm font-medium text-foreground">Анализ Word/PDF документа</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </TapCard>

      {/* Progress Card */}
      <TapCard className="mb-4" onClick={() => handleCardClick('Мой прогресс')}>
        <div className="glass-strong rounded-2xl p-4 relative overflow-hidden shadow-xl">
          <h3 className="text-lg font-semibold mb-1 text-foreground">Мой прогресс</h3>
          <p className="text-sm text-muted-foreground mb-4">8 навыков</p>
          <div className="flex flex-wrap gap-2">
            <div className="glass-subtle text-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              🔍 <span>Искатель</span>
            </div>
            <div className="glass-subtle text-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              📊 <span>Аналитик</span>
            </div>
            <div className="glass-subtle text-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              ⚙️ <span>Инженер</span>
            </div>
          </div>
          
        </div>
      </TapCard>

      {/* My Tasks Card */}
      <TapCard className="mb-4" onClick={() => handleCardClick('Мои задания')}>
        <div className="glass-strong rounded-2xl p-4 relative overflow-hidden shadow-xl">
          <h3 className="text-lg font-semibold mb-1 text-foreground">Мои задания</h3>
          <p className="text-sm text-muted-foreground mb-3">89 заданий</p>
          
          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Общий прогресс</span>
              <span>18/89</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-pastel-mint h-2 rounded-full transition-all duration-500" 
                style={{ width: '20%' }}
              />
            </div>
          </div>
          
          <button className="bg-pastel-mint/80 text-foreground px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur-sm">
            +24 задания
          </button>
        </div>
      </TapCard>

      {/* Webinar Records Card */}
      <TapCard onClick={() => handleCardClick('Записи вебинаров')}>
        <div className="glass-strong rounded-2xl p-4 relative overflow-hidden shadow-xl">
          <h3 className="text-lg font-semibold mb-1 text-foreground">Записи вебинаров</h3>
          <p className="text-sm text-muted-foreground mb-4">6 вебинаров</p>
          <button className="bg-pastel-sky/80 text-foreground px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
            Смотреть
          </button>
        </div>
      </TapCard>
    </div>;
};
export default Index;
