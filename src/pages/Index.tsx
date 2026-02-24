import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TapCard } from '@/components/ui/tap-card';
import { useAuth } from '@/hooks/useAuth';
import { useNextAssignment } from '@/hooks/useNextAssignment';
import { useUserSkills } from '@/hooks/useUserSkills';
import { useUserAssignmentStats } from '@/hooks/useUserAssignmentStats';
import { useUserCourses } from '@/hooks/useUserCourses';
import { useCourses } from '@/hooks/useCourses';
import { useIsMobile } from '@/hooks/use-mobile';
import { TrendingUp, ChevronRight, FileText } from 'lucide-react';
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
import { getSkillIcon, getSkillColor } from '@/utils/skillIcons';
import { levelToPercent } from '@/utils/skillLevels';
import MyCoursesWidget from '@/components/home/MyCoursesWidget';
import StreakWidget from '@/components/home/StreakWidget';
import CourseCatalogWidget from '@/components/home/CourseCatalogWidget';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getNextTaskPath } = useNextAssignment();
  const { userCourses, loading: coursesLoading } = useUserCourses(user?.id);
  const { courses } = useCourses();
  const { skills, loading } = useUserSkills(user?.id);
  const { stats } = useUserAssignmentStats(user?.id);
  const isMobile = useIsMobile();
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

  const overallProgress = stats.completionPercentage;
  const learningSkillsCount = skills.length;
  const totalCompletedAssignments = stats.completedAssignments;
  const totalAssignments = stats.totalAssignments;

  const radarData = skills.map(skill => ({
    subject: skill.skill.slug,
    value: Math.max(skill.progress_percent, 1),
    target: levelToPercent(skill.target_level),
    fullMark: 100,
  }));

  const showBanner = !user && !isBannerCollapsed;
  const headerOffset = showBanner ? '-mt-36' : '-mt-28';
  const headerPadding = showBanner ? 'pt-44' : 'pt-36';

  return (
    <div className="min-h-screen">
      {/* Purple Header */}
      <div className={`bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] px-6 ${headerPadding} lg:pt-12 pb-40 lg:pb-32 relative ${headerOffset} lg:mt-0 transition-all duration-300 lg:rounded-2xl`}>
        <div className="max-w-md lg:max-w-5xl mx-auto">
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

      <div className="max-w-md lg:max-w-5xl mx-auto px-4 lg:px-0 -mt-32 lg:-mt-24 pb-24 lg:pb-8 space-y-4">
        {/* Top section: Progress + Radar on desktop */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-4 lg:space-y-0">
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
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C026D3] via-[#EC4899] to-[#F97316] flex items-center justify-center shadow-xl">
                  <TrendingUp className="w-12 h-12 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <Progress value={overallProgress} className="h-2.5 mt-4" />
            </CardContent>
          </Card>

          {/* Radar Chart Card */}
          <Card 
            className="border-0 shadow-xl bg-white cursor-pointer hover:shadow-2xl transition-all"
            onClick={() => navigate('/my-progress')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
                  <span className="text-xs text-muted-foreground">Прогресс</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full border-2 border-dashed border-[#F97316]" />
                  <span className="text-xs text-muted-foreground">Цель</span>
                </div>
              </div>
              <div className="relative">
                <ResponsiveContainer width="100%" height={isMobile ? 280 : 360}>
                  <RadarChart data={radarData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <PolarGrid stroke="#E5E7EB" strokeWidth={1} />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={({ payload, x, y, cx, cy, index }) => {
                        const skill = skills.find(s => s.skill.slug === payload.value);
                        if (!skill) return null;
                        
                        const angle = (index * 360) / skills.length - 90;
                        const rad = (angle * Math.PI) / 180;
                        const iconRadius = isMobile ? 100 : 145;
                        const iconSize = isMobile ? 40 : 48;
                        const iconX = cx + iconRadius * Math.cos(rad);
                        const iconY = cy + iconRadius * Math.sin(rad);

                        return (
                          <g transform={`translate(${iconX},${iconY})`}>
                            <foreignObject x={-(iconSize / 2)} y={-(iconSize / 2)} width={iconSize} height={iconSize}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <div 
                                    className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-2xl ${getSkillColor(skill.skill.slug)} flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform`}
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
                                      <span className="text-sm text-muted-foreground">Прогресс</span>
                                      <span className="text-xl font-bold text-[#8B5CF6]">
                                        {skill.progress_percent}%
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
                    <Radar 
                      name="Цель" 
                      dataKey="target" 
                      stroke="#F97316" 
                      fill="#F97316" 
                      fillOpacity={0.08}
                      strokeWidth={2}
                      strokeDasharray="6 4"
                    />
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
        </div>

        {/* Section 2: My Courses + Streak */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-6 space-y-4 lg:space-y-0">
          <div className="lg:col-span-2">
            <MyCoursesWidget userCourses={userCourses} loading={coursesLoading} />
          </div>
          <StreakWidget />
        </div>

        {/* Bottom cards: 3-col on desktop */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-6 space-y-4 lg:space-y-0">
          {/* Next Task Card */}
          <TapCard onClick={async () => {
            const nextPath = await getNextTaskPath();
            navigate(nextPath);
          }}>
            <div className="glass-card rounded-3xl p-6 flex items-center justify-between h-full">
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

          {/* My Tasks Card */}
          <TapCard onClick={() => navigate('/tasks')}>
            <div className="glass-card rounded-3xl p-6 relative overflow-hidden h-full">
              <h3 className="text-lg font-semibold mb-1 text-glass">Мои задания</h3>
              <p className="text-sm text-glass-muted mb-3">{stats.totalAssignments} заданий</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-xs text-glass-muted mb-1">
                  <span>Общий прогресс</span>
                  <span>{stats.completedAssignments}/{stats.totalAssignments}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white/60 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${stats.completionPercentage}%` }}
                  />
                </div>
              </div>
              
              <button className="bg-white/20 text-glass px-4 py-2 rounded-2xl text-sm font-medium shadow-inner backdrop-blur-sm border border-white/30">
                +{stats.totalAssignments - stats.completedAssignments} задания
              </button>
            </div>
          </TapCard>

          {/* Course Catalog Card */}
          <CourseCatalogWidget coursesCount={courses.length} />
        </div>
      </div>
    </div>
  );
};

export default Index;
