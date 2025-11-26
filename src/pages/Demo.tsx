import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TapCard } from '@/components/ui/tap-card';
import { useAuth } from '@/hooks/useAuth';
import { useNextAssignment } from '@/hooks/useNextAssignment';
import { useUserSkills } from '@/hooks/useUserSkills';
import { ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  'productivity': 92
};
const demoCompletedBySlug: Record<string, {
  completed: number;
  total: number;
}> = {
  'communication': {
    completed: 2,
    total: 11
  },
  'knowledge-management': {
    completed: 5,
    total: 11
  },
  'content-creation': {
    completed: 1,
    total: 11
  },
  'problem-solving': {
    completed: 9,
    total: 11
  },
  'research': {
    completed: 8,
    total: 13
  },
  'automation': {
    completed: 1,
    total: 11
  },
  'data-analysis': {
    completed: 4,
    total: 11
  },
  'productivity': {
    completed: 10,
    total: 11
  }
};
const getDisplayProgress = (slug: string, actualProgress: number) => {
  if (actualProgress && actualProgress > 0) return actualProgress;
  return demoProgressBySlug[slug] ?? 0;
};
const Demo = () => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    getNextTaskPath
  } = useNextAssignment();
  const {
    skills,
    loading
  } = useUserSkills(user?.id);
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
  const overallProgress = skills.length > 0 ? Math.round(skills.reduce((sum, skill) => sum + getDisplayProgress(skill.skill.slug, skill.progress_percent), 0) / skills.length) : 0;

  // Calculate learning skills count
  const learningSkillsCount = skills.length;

  // Calculate total completed assignments
  const totalCompletedAssignments = Object.values(demoCompletedBySlug).reduce((sum, skill) => sum + skill.completed, 0);
  const totalAssignments = Object.values(demoCompletedBySlug).reduce((sum, skill) => sum + skill.total, 0);

  // Prepare radar chart data
  // Конвертация уровня в проценты для геймификации
  const getLevelAsPercent = (level: number) => {
    switch (level) {
      case 1:
        return 33;
      // Basic
      case 2:
        return 66;
      // Pro
      case 3:
        return 100;
      // AI-Native
      default:
        return 33;
    }
  };
  const radarData = skills.map(skill => {
    const currentProgress = getDisplayProgress(skill.skill.slug, skill.progress_percent);
    const boughtLevelPercent = getLevelAsPercent(skill.current_level);
    return {
      subject: skill.skill.slug,
      value: currentProgress,
      targetValue: boughtLevelPercent,
      fullMark: 100
    };
  });
  const showBanner = !user && !isBannerCollapsed;
  const headerOffset = showBanner ? '-mt-36' : '-mt-28';
  const headerPadding = showBanner ? 'pt-44' : 'pt-36';
  const getInitials = () => {
    if (!user) return 'G';
    if (user.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ');
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user.email?.[0].toUpperCase() || 'G';
  };
  return <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Glass Header */}
      <div className="fixed top-0 left-0 right-0 z-50 top-header transition-all duration-300">
        <div className="max-w-md mx-auto px-4 pt-4">
          <div className="glass-header rounded-3xl px-6">
            <div className="flex items-center justify-between py-3">
              {/* Left: hakku.ai branding */}
              <div className="flex flex-col">
                <span className="font-source-serif text-base font-semibold text-gray-900">
                  hakku.ai
                </span>
                <span className="text-[10px] text-gray-900">
                  AI training app
                </span>
              </div>

              {/* Center: Company Logo Placeholder */}
              <div className="absolute left-1/2 -translate-x-1/2 text-center max-w-[100px]">
                <p className="text-[10px] text-gray-900 font-medium leading-tight">
                  Здесь лого<br />вашей компании
                </p>
              </div>
              
              {/* Right: User Avatar Button */}
              <button className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border border-[#F37168] hover:bg-white/40 transition-all">
                {user?.user_metadata?.avatar_url ? <Avatar className="h-10 w-10">
                    <AvatarImage src={user.user_metadata.avatar_url} alt="User" />
                    <AvatarFallback className="bg-transparent text-gray-900 text-sm font-semibold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar> : <span className="text-gray-900 text-sm font-semibold">
                    {getInitials()}
                  </span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Purple Header */}
      <div className={`bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] px-6 ${headerPadding} pb-40 relative ${headerOffset} transition-all duration-300`}>
        <div className="max-w-md mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Привет, {user?.email?.split('@')[0] || 'Гость'}!
              </h1>
              
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
                <p className="text-sm text-gray-600 mb-2">Прогресс обучения</p>
                <p className="text-6xl font-bold text-[#8277EC] mb-2">{overallProgress}%</p>
                <p className="text-sm text-gray-600"><span className="text-[#F37168] font-semibold">{learningSkillsCount}</span> навыков изучается</p>
                <p className="text-xs text-gray-600 mt-1"><span className="text-[#F37168] font-semibold">{totalCompletedAssignments}/{totalAssignments}</span> заданий выполнено</p>
              </div>
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8277EC] to-[#02E8FF] flex items-center justify-center shadow-xl p-4">
                <img src={ProgressMainIcon} alt="Progress" className="w-full h-full object-contain" />
              </div>
            </div>
            <Progress value={overallProgress} className="h-2.5 mt-4 [&>div]:bg-gradient-to-r [&>div]:from-[#1956FF] [&>div]:to-[#02E8FF]" />
          </CardContent>
        </Card>

        {/* Radar Chart Card - Clickable */}
        <Card className="border-0 shadow-xl bg-white cursor-pointer hover:shadow-2xl transition-all" onClick={() => navigate('/my-progress')}>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Мой прогресс</h3>
            <div className="relative">
              <ResponsiveContainer width="100%" height={360}>
                <RadarChart data={radarData} margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
              }}>
                  <PolarGrid stroke="#e5e7eb" strokeWidth={1} strokeOpacity={0.6} />
                  <PolarAngleAxis dataKey="subject" tick={({
                  payload,
                  x,
                  y,
                  cx,
                  cy,
                  index
                }) => {
                  const skill = skills.find(s => s.skill.slug === payload.value);
                  if (!skill) return null;
                  const angle = index * 360 / skills.length - 90;
                  const rad = angle * Math.PI / 180;
                  const iconRadius = 142;
                  const iconX = cx + iconRadius * Math.cos(rad);
                  const iconY = cy + iconRadius * Math.sin(rad);
                  const stats = demoCompletedBySlug[skill.skill.slug] || {
                    completed: 0,
                    total: 0
                  };
                  return <g transform={`translate(${iconX},${iconY})`}>
                          <foreignObject x={-24} y={-24} width={48} height={48}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <div className={`w-12 h-12 rounded-2xl ${getSkillColor(skill.skill.slug)} flex items-center justify-center shadow-lg cursor-pointer`} onClick={e => e.stopPropagation()}>
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
                        </g>;
                }} />
                  {/* Целевой уровень - показывает купленный уровень навыка */
                }
                  <Radar name="Целевой уровень" dataKey="targetValue" stroke="#F37168" fill="#F37168" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="5 5" />
                  {/* Текущий прогресс */}
                  <Radar name="Прогресс" dataKey="value" stroke="#8277EC" fill="#8277EC" fillOpacity={0.15} strokeWidth={2} />
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
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8277EC] to-[#02E8FF] flex items-center justify-center p-2" style={{
              boxShadow: '0 8px 16px rgba(25, 86, 255, 0.4)'
            }}>
                <img src={TaskIcon} alt="Task" className="w-full h-full object-contain brightness-0 invert" />
              </div>
              <span className="font-bold text-gray-900 text-base">Следующее задание</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </TapCard>

        {/* My Tasks Card */}
        <Card className="border-0 shadow-xl bg-white cursor-pointer hover:shadow-2xl transition-all" onClick={() => navigate('/tasks')}>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Мои задания</h3>
            
            {/* Progress bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[#8277EC] font-medium">Общий прогресс</span>
                <span className="text-sm text-[#F37168] font-bold">40/90</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-[#1956FF] to-[#8277EC]" style={{
                width: '20%'
              }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Webinar Records Card */}
        <TapCard onClick={() => navigate('/webinar-records')}>
          <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8277EC] to-[#02E8FF] flex items-center justify-center p-2" style={{
              boxShadow: '0 8px 16px rgba(25, 86, 255, 0.4)'
            }}>
                <img src={WebinarIcon} alt="Webinar" className="w-full h-full object-contain brightness-0 invert" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">Записи вебинаров</h3>
              <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
            </div>
          </div>
        </TapCard>
      </div>
    </div>;
};
export default Demo;