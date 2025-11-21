import React, { useState } from 'react';
import { MessageSquare, Brain, PenTool, Lightbulb, Search, Zap, BarChart3, Target, TrendingUp, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GuestBanner } from '@/components/GuestBanner';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useUserSkills } from '@/hooks/useUserSkills';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from '@/integrations/supabase/client';
import { demoAssignments } from '@/data/demoSkills';

// Map skill slug to icon and color - exact match from photos
const getSkillIcon = (slug: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'communication': <MessageSquare className="w-5 h-5 text-white" />,
    'knowledge-management': <Brain className="w-5 h-5 text-white" />,
    'content-creation': <PenTool className="w-5 h-5 text-white" />,
    'problem-solving': <Lightbulb className="w-5 h-5 text-white" />,
    'research': <Search className="w-5 h-5 text-white" />,
    'automation': <Zap className="w-5 h-5 text-white" />,
    'data-analysis': <BarChart3 className="w-5 h-5 text-white" />,
    'productivity': <Target className="w-5 h-5 text-white" />,
  };
  return iconMap[slug] || <Target className="w-5 h-5 text-white" />;
};

const getSkillColor = (slug: string) => {
  const colorMap: Record<string, string> = {
    'communication': 'bg-[#3B9DFF]', // Blue
    'knowledge-management': 'bg-[#B350D6]', // Purple
    'content-creation': 'bg-[#FF7847]', // Orange
    'problem-solving': 'bg-[#FFA94D]', // Orange/Yellow
    'research': 'bg-[#00BCD4]', // Cyan
    'automation': 'bg-[#9C4FFF]', // Purple
    'data-analysis': 'bg-[#5B9BFF]', // Blue
    'productivity': 'bg-[#4CAF50]', // Green
  };
  return colorMap[slug] || 'bg-[#3B9DFF]';
};

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

const IndexPlayground = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { skills, loading } = useUserSkills(user?.id);

  // Calculate overall progress (fallback to demo percentages if реальные = 0)
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

  // Prepare radar chart data (используем отображаемый прогресс)
  const radarData = skills.map(skill => ({
    subject: skill.skill.slug,
    value: getDisplayProgress(skill.skill.slug, skill.progress_percent),
    fullMark: 100,
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Загрузка...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {!user && <GuestBanner />}
      
      {/* Purple Header */}
      <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] px-6 pt-12 pb-40 relative">
        <div className="max-w-md mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Привет, {user?.email?.split('@')[0] || 'Алексей'}!
              </h1>
              <p className="text-white/90 text-base">Ваш прогресс обучения</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40 hover:bg-white/30 transition-colors">
                  <span className="text-white text-xl font-semibold">
                    {user?.email?.[0].toUpperCase() || 'А'}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Аккаунт</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || 'guest@example.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={async () => {
                    if (user) {
                      await supabase.auth.signOut();
                      navigate('/auth');
                    }
                  }}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Выйти</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C026D3] via-[#EC4899] to-[#F97316] flex items-center justify-center shadow-xl">
                <TrendingUp className="w-12 h-12 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <Progress value={overallProgress} className="h-2.5 mt-4" />
          </CardContent>
        </Card>

        {/* Radar Chart Card */}
        <Card className="border-0 shadow-xl bg-white">
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
                                >
                                  {getSkillIcon(skill.skill.slug)}
                                </div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="center" className="w-72">
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

        {/* Skills List */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Навыки</h2>
          <div className="space-y-3">
            {skills.map((skill) => (
              <Card 
                key={skill.id}
                className="border-0 shadow-md bg-white cursor-pointer hover:shadow-xl transition-all"
                onClick={() => navigate('/tasks')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl ${getSkillColor(skill.skill.slug)} flex items-center justify-center shadow-md flex-shrink-0`}>
                      {getSkillIcon(skill.skill.slug)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-base mb-2">{skill.skill.name}</h3>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="text-xs font-medium text-[#8B5CF6] bg-[#8B5CF6]/10 px-2 py-1 rounded-full">
                          {skill.current_level === 1 ? 'Basic' : skill.current_level === 2 ? 'Pro' : 'AI-Native'}
                        </span>
                        <span className="text-sm font-bold text-[#8B5CF6]">
                          {getDisplayProgress(skill.skill.slug, skill.progress_percent)}%
                        </span>
                      </div>
                      <Progress value={getDisplayProgress(skill.skill.slug, skill.progress_percent)} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPlayground;
