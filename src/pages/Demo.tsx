import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TapCard } from '@/components/ui/tap-card';
import { useAuth } from '@/hooks/useAuth';
import { useNextAssignment } from '@/hooks/useNextAssignment';
import { useUserSkills } from '@/hooks/useUserSkills';
import { ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSkillIcon, getSkillColor } from '@/utils/skillIconsDemo';
import ProgressMainIcon from '@/assets/progress-main.svg';
import TaskIcon from '@/assets/task-icon.svg';
import WebinarIcon from '@/assets/webinar-icon.svg';

const demoProgressBySlug: Record<string, number> = {
  'communication': 23,
  'knowledge-management': 50,
  'content-creation': 15,
  'problem-solving': 88,
  'research': 67,
  'automation': 10,
  'data-analysis': 40,
  'productivity': 92,
};

const demoCompletedBySlug: Record<string, { completed: number; total: number }> = {
  'communication': { completed: 2, total: 11 },
  'knowledge-management': { completed: 5, total: 11 },
  'content-creation': { completed: 1, total: 11 },
  'problem-solving': { completed: 9, total: 11 },
  'research': { completed: 8, total: 13 },
  'automation': { completed: 1, total: 11 },
  'data-analysis': { completed: 4, total: 11 },
  'productivity': { completed: 10, total: 11 },
};

const getDisplayProgress = (slug: string, actualProgress: number) => {
  if (actualProgress && actualProgress > 0) return actualProgress;
  return demoProgressBySlug[slug] ?? 0;
};

const Demo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getNextTaskPath } = useNextAssignment();
  const { skills, loading } = useUserSkills(user?.id);
  const [isBannerCollapsed, setIsBannerCollapsed] = useState(() => {
    return localStorage.getItem('guestBannerCollapsed') === 'true';
  });

  useEffect(() => {
    const checkBannerState = () => {
      setIsBannerCollapsed(localStorage.getItem('guestBannerCollapsed') === 'true');
    };
    window.addEventListener('storage', checkBannerState);
    const interval = setInterval(checkBannerState, 100);
    return () => {
      window.removeEventListener('storage', checkBannerState);
      clearInterval(interval);
    };
  }, []);

  // Calculate overall progress
  const overallProgress = skills.length > 0 
    ? Math.round(
        skills.reduce(
          (sum, skill) => sum + getDisplayProgress(skill.skill.slug, skill.progress_percent),
          0
        ) / skills.length
      )
    : 0;

  // Calculate learning skills count
  const learningSkillsCount = skills.length;

  // Calculate total completed assignments
  const totalCompletedAssignments = Object.values(demoCompletedBySlug).reduce((sum, skill) => sum + skill.completed, 0);
  const totalAssignments = Object.values(demoCompletedBySlug).reduce((sum, skill) => sum + skill.total, 0);

  // Prepare radar chart data
  // Конвертация уровня в проценты для геймификации
  const getLevelAsPercent = (level: number) => {
    switch (level) {
      case 1: return 33;  // Basic
      case 2: return 66;  // Pro
      case 3: return 100; // AI-Native
      default: return 33;
    }
  };

  const radarData = skills.map(skill => {
    const currentProgress = getDisplayProgress(skill.skill.slug, skill.progress_percent);
    const boughtLevelPercent = getLevelAsPercent(skill.current_level);

    return {
      subject: skill.skill.slug,
      value: currentProgress,
      targetValue: boughtLevelPercent,
      fullMark: 100,
    };
  });

  const showBanner = !user && !isBannerCollapsed;
  const headerOffset = showBanner ? '-mt-36' : '-mt-28';
  const headerPadding = showBanner ? 'pt-44' : 'pt-36';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Purple Header */}
      <div className={`bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] px-6 ${headerPadding} pb-40 relative ${headerOffset} transition-all duration-300`}>
        <div className="max-w-md mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Привет, {user?.email?.split('@')[0] || 'Гость'}!
              </h1>
              <p className="text-white/90 text-base">Ваш прогресс обучения</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-32 pb-24 space-y-4">
        {/* Overall Progress Card */}
        <Card className="border-0 shadow-xl bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">Общий прогресс</p>
                <p className="text-6xl font-bold text-[#8B5CF6] mb-2">{overallProgress}%</p>
                <p className="text-sm text-muted-foreground">{learningSkillsCount} навыков изучается</p>
                <p className="text-xs text-muted-foreground mt-1">{totalCompletedAssignments}/{totalAssignments} заданий выполнено</p>
              </div>
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C026D3] via-[#EC4899] to-[#F97316] flex items-center justify-center shadow-xl p-4">
                <img src={ProgressMainIcon} alt="Progress" className="w-full h-full object-contain" />
              </div>
            </div>
            <Progress value={overallProgress} className="h-2.5 mt-4" />
          </CardContent>
        </Card>

        {/* Radar Chart Card - Clickable */}
        <Card 
          className="border-0 shadow-xl bg-white cursor-pointer hover:shadow-2xl transition-all"
          onClick={() => navigate('/my-progress')}
        >
          <CardContent className="p-6">
            <div className="relative">
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <PolarGrid stroke="#E5E7EB" strokeWidth={1} />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={({ payload, x, y, cx, cy, index }) => {
                      const skill = skills.find(s => s.skill.slug === payload.value);
                      if (!skill) return null;
                      
                      const angle = (index * 360) / skills.length - 90;
                      const rad = (angle * Math.PI) / 180;
                      const iconRadius = 135;
                      const iconX = cx + iconRadius * Math.cos(rad);
                      const iconY = cy + iconRadius * Math.sin(rad);

                      const stats = demoCompletedBySlug[skill.skill.slug] || { completed: 0, total: 0 };
                      
                      return (
                        <g transform={`translate(${iconX},${iconY})`}>
                          <foreignObject x={-24} y={-24} width={48} height={48}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <div 
                                  className={`w-12 h-12 rounded-2xl ${getSkillColor(skill.skill.slug)} flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform`}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {getSkillIcon(skill.skill.slug)}
                                </div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="center" className="w-72 bg-popover/95 backdrop-blur-xl border-border z-50">
                                <DropdownMenuLabel>
                                  <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-2xl ${getSkillColor(skill.skill.slug)} flex items-center justify-center shadow-lg flex-shrink-0`}>
                                      {getSkillIcon(skill.skill.slug)}
                                    </div>
                                    <span className="text-sm font-semibold">{skill.skill.name}</span>
                                  </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <div className="px-2 py-3">
                                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm text-muted-foreground">Выполнено заданий</span>
                                    <span className="text-xl font-bold text-[#8B5CF6]">
                                      {stats.completed}/{stats.total}
                                    </span>
                                  </div>
                                </div>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </foreignObject>
                        </g>
                      );
                    }}
                  />
                  {/* Целевой уровень - показывает купленный уровень навыка */
                  }
                  <Radar 
                    name="Целевой уровень" 
                    dataKey="targetValue" 
                    stroke="#02E8FF"
                    fill="#02E8FF"
                    fillOpacity={0.15}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  {/* Текущий прогресс */}
                  <Radar 
                    name="Прогресс" 
                    dataKey="value" 
                    stroke="#8B5CF6" 
                    fill="#8B5CF6" 
                    fillOpacity={0.25}
                    strokeWidth={3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Next Task Card */}
        <TapCard onClick={async () => {
          const nextPath = await getNextTaskPath();
          navigate(nextPath);
        }}>
          <div className="glass-card rounded-3xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-orange to-sky-blue flex items-center justify-center shadow-md p-2">
                <img src={TaskIcon} alt="Task" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Следующее задание</p>
                <p className="text-sm font-semibold text-deep-purple">Следующее задание</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </TapCard>

        {/* My Tasks Card */}
        <TapCard onClick={() => navigate('/tasks')}>
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
        <TapCard onClick={() => navigate('/webinar-records')}>
          <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-deep-purple to-primary-orange flex items-center justify-center shadow-md p-2">
                <img src={WebinarIcon} alt="Webinar" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-deep-purple">Записи вебинаров</h3>
                <p className="text-sm text-muted-foreground">6 вебинаров доступно</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </TapCard>
      </div>
    </div>
  );
};

export default Demo;
