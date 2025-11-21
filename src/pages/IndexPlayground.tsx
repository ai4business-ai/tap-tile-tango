import React from 'react';
import { ChevronRight, MessageSquare, Brain, PenTool, Lightbulb, Search, Zap, BarChart3, Target, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserMenu } from '@/components/UserMenu';
import { GuestBanner } from '@/components/GuestBanner';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useUserSkills } from '@/hooks/useUserSkills';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

// Map skill slug to icon
const getSkillIcon = (slug: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'communication': <MessageSquare className="w-4 h-4 text-white" />,
    'knowledge-management': <Brain className="w-4 h-4 text-white" />,
    'content-creation': <PenTool className="w-4 h-4 text-white" />,
    'problem-solving': <Lightbulb className="w-4 h-4 text-white" />,
    'research': <Search className="w-4 h-4 text-white" />,
    'automation': <Zap className="w-4 h-4 text-white" />,
    'data-analysis': <BarChart3 className="w-4 h-4 text-white" />,
    'productivity': <Target className="w-4 h-4 text-white" />,
  };
  return iconMap[slug] || <Target className="w-4 h-4 text-white" />;
};

// Map skill slug to background color
const getSkillColor = (slug: string) => {
  const colorMap: Record<string, string> = {
    'communication': 'from-sky-blue to-sky-blue/80',
    'knowledge-management': 'from-deep-purple to-deep-purple/80',
    'content-creation': 'from-primary-orange to-primary-orange/80',
    'problem-solving': 'from-primary-orange/90 to-sky-blue/90',
    'research': 'from-sky-blue/90 to-deep-purple/90',
    'automation': 'from-deep-purple/90 to-primary-orange/90',
    'data-analysis': 'from-sky-blue to-primary-orange',
    'productivity': 'from-primary-orange to-sky-blue',
  };
  return colorMap[slug] || 'from-primary-orange to-sky-blue';
};

const IndexPlayground = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { skills, loading } = useUserSkills(user?.id);

  // Calculate overall progress
  const overallProgress = skills.length > 0 
    ? Math.round(skills.reduce((sum, skill) => sum + skill.progress_percent, 0) / skills.length)
    : 0;

  // Calculate learning skills count
  const learningSkillsCount = skills.filter(skill => skill.progress_percent > 0 && skill.progress_percent < 100).length;

  // Prepare radar chart data
  const radarData = skills.map(skill => ({
    subject: skill.skill.slug,
    value: skill.progress_percent,
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
    <div className="min-h-screen">
      {!user && <GuestBanner />}
      
      <div className="max-w-md mx-auto">
        {/* Purple Header */}
        <div className="bg-gradient-to-br from-deep-purple to-deep-purple/90 px-6 pt-8 pb-32 rounded-b-[3rem] shadow-xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Привет, {user?.email?.split('@')[0] || 'Гость'}!
              </h1>
              <p className="text-white/80 text-sm">Ваш прогресс обучения</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-xl font-semibold">
                {user?.email?.[0].toUpperCase() || 'Г'}
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 -mt-24 pb-6 space-y-4">
          {/* Overall Progress Card */}
          <Card className="border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Общий прогресс</p>
                  <p className="text-5xl font-bold text-deep-purple">{overallProgress}%</p>
                  <p className="text-sm text-muted-foreground mt-1">{learningSkillsCount} навыков изучается</p>
                </div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-deep-purple via-primary-orange to-primary-orange/80 flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </CardContent>
          </Card>

          {/* Radar Chart Card */}
          <Card className="border-0 shadow-xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-deep-purple mb-4">Навыки по категориям</h3>
              <div className="relative">
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={({ payload, x, y, cx, cy, index }) => {
                        const skill = skills.find(s => s.skill.slug === payload.value);
                        if (!skill) return null;
                        
                        // Calculate angle for positioning
                        const angle = (index * 360) / skills.length - 90;
                        const rad = (angle * Math.PI) / 180;
                        const iconRadius = 140;
                        const iconX = cx + iconRadius * Math.cos(rad);
                        const iconY = cy + iconRadius * Math.sin(rad);

                        return (
                          <g transform={`translate(${iconX},${iconY})`}>
                            <foreignObject x={-20} y={-20} width={40} height={40}>
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getSkillColor(skill.skill.slug)} flex items-center justify-center shadow-md`}>
                                {getSkillIcon(skill.skill.slug)}
                              </div>
                            </foreignObject>
                          </g>
                        );
                      }}
                    />
                    <Radar 
                      name="Прогресс" 
                      dataKey="value" 
                      stroke="hsl(var(--primary-orange))" 
                      fill="hsl(var(--primary-orange))" 
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Skills List */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4 px-2">Навыки</h2>
            <div className="space-y-3">
              {skills.map((skill) => (
                <Card 
                  key={skill.id}
                  className="border-0 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate('/tasks')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getSkillColor(skill.skill.slug)} flex items-center justify-center shadow-md flex-shrink-0`}>
                        {getSkillIcon(skill.skill.slug)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1 truncate">{skill.skill.name}</h3>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-muted-foreground">
                            {skill.current_level === 1 ? 'Basic' : skill.current_level === 2 ? 'Pro' : 'AI-Native'}
                          </span>
                          <span className="text-sm font-semibold text-deep-purple">
                            {skill.progress_percent}%
                          </span>
                        </div>
                        <Progress value={skill.progress_percent} className="h-1.5 mt-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPlayground;
