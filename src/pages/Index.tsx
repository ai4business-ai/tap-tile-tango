import React from 'react';
import { ChevronRight, BookOpen, Target, Video, FileText } from 'lucide-react';
import { TapCard } from '@/components/ui/tap-card';
import { useNavigate } from 'react-router-dom';
import { UserMenu } from '@/components/UserMenu';
import { GuestBanner } from '@/components/GuestBanner';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNextAssignment } from '@/hooks/useNextAssignment';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getNextTaskPath } = useNextAssignment();
  
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
  return (
    <div className="min-h-screen">
      {!user && <GuestBanner />}
      <div className="p-4 md:p-6 lg:p-8 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1"></div>
        <div className="glass-subtle rounded-3xl px-6 py-3">
          <p className="text-xs text-muted-foreground font-medium">Здесь лого вашей компании</p>
        </div>
        <div className="flex-1 flex justify-end">
          <UserMenu />
        </div>
      </div>


      {/* Next Task Card */}
      <TapCard className="mb-4" onClick={async () => {
        const nextPath = await getNextTaskPath();
        navigate(nextPath);
      }}>
        <div className="glass-card rounded-3xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-orange to-sky-blue flex items-center justify-center shadow-md">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Следующее задание</p>
              <p className="text-sm font-semibold text-deep-purple">Следующее задание</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </TapCard>

      {/* My Progress Card */}
      <TapCard className="mb-4" onClick={() => handleCardClick('Мой прогресс')}>
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-blue to-deep-purple flex items-center justify-center shadow-md">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-deep-purple">Мой прогресс</h3>
              <p className="text-sm text-muted-foreground">8 навыков изучается</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="accent" className="text-xs">
              🔍 Искатель
            </Badge>
            <Badge variant="default" className="text-xs">
              📊 Аналитик
            </Badge>
            <Badge variant="secondary" className="text-xs">
              ⚙️ Инженер
            </Badge>
          </div>
        </div>
      </TapCard>

      {/* My Tasks Card */}
      <TapCard className="mb-4" onClick={() => handleCardClick('Мои задания')}>
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
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
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-deep-purple to-primary-orange flex items-center justify-center shadow-md">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-deep-purple">Записи вебинаров</h3>
              <p className="text-sm text-muted-foreground">6 вебинаров доступно</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full"
          >
            Смотреть записи
          </Button>
        </div>
      </TapCard>
    </div>
    </div>
  );
};

export default Index;
