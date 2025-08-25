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
        <div className="glass-subtle rounded-3xl px-6 py-3">
          <p className="text-xs text-glass-muted font-medium">Здесь лого вашей компании</p>
        </div>
      </div>


      {/* Module Card */}
      <TapCard className="mb-4" onClick={() => handleCardClick('Анализ данных')}>
        <div className="glass-card rounded-3xl p-6 shadow-inner flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <div className="w-5 h-5 bg-white/40 rounded-lg transform rotate-45"></div>
            </div>
            <div>
              <p className="text-sm text-glass-muted">Модуль 3.2</p>
              <p className="text-sm font-medium text-glass">Анализ Word/PDF документа</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-glass-muted" />
        </div>
      </TapCard>

      {/* Progress Card */}
      <TapCard className="mb-4" onClick={() => handleCardClick('Мой прогресс')}>
        <div className="glass-strong rounded-3xl p-6 relative overflow-hidden shadow-inner">
          <h3 className="text-lg font-semibold mb-1 text-glass">Мой прогресс</h3>
          <p className="text-sm text-glass-muted mb-4">8 навыков</p>
          <div className="flex flex-wrap gap-2">
            <div className="glass-subtle text-glass px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              🔍 <span>Искатель</span>
            </div>
            <div className="glass-subtle text-glass px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              📊 <span>Аналитик</span>
            </div>
            <div className="glass-subtle text-glass px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              ⚙️ <span>Инженер</span>
            </div>
          </div>
          
        </div>
      </TapCard>

      {/* My Tasks Card */}
      <TapCard className="mb-4" onClick={() => handleCardClick('Мои задания')}>
        <div className="glass-strong rounded-3xl p-6 relative overflow-hidden shadow-inner">
          <h3 className="text-lg font-semibold mb-1 text-glass">Мои задания</h3>
          <p className="text-sm text-glass-muted mb-3">89 заданий</p>
          
          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-glass-muted mb-1">
              <span>Общий прогресс</span>
              <span>18/89</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white/60 h-2 rounded-full transition-all duration-500" 
                style={{ width: '20%' }}
              />
            </div>
          </div>
          
          <button className="bg-white/20 text-glass px-4 py-2 rounded-2xl text-sm font-medium shadow-inner backdrop-blur-sm border border-white/30">
            +24 задания
          </button>
        </div>
      </TapCard>

      {/* Webinar Records Card */}
      <TapCard onClick={() => handleCardClick('Записи вебинаров')}>
        <div className="glass-strong rounded-3xl p-6 relative overflow-hidden shadow-inner">
          <h3 className="text-lg font-semibold mb-1 text-glass">Записи вебинаров</h3>
          <p className="text-sm text-glass-muted mb-4">6 вебинаров</p>
          <button className="bg-white/20 text-glass px-4 py-2 rounded-2xl text-sm font-medium backdrop-blur-sm border border-white/30">
            Смотреть
          </button>
        </div>
      </TapCard>
    </div>;
};
export default Index;
