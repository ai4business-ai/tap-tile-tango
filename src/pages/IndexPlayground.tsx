import React from 'react';
import { MessageSquare, Brain, PenTool, Lightbulb, Search, Zap, BarChart3, Target, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GuestBanner } from '@/components/GuestBanner';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useUserSkills } from '@/hooks/useUserSkills';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

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
            <button className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40">
              <span className="text-white text-xl font-semibold">
                {user?.email?.[0].toUpperCase() || 'А'}
              </span>
            </button>
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
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E5E7EB" strokeWidth={1} />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={({ payload, x, y, cx, cy, index }) => {
                      const skill = skills.find(s => s.skill.slug === payload.value);
                      if (!skill) return null;
                      
                      const angle = (index * 360) / skills.length - 90;
                      const rad = (angle * Math.PI) / 180;
                      const iconRadius = 145;
                      const iconX = cx + iconRadius * Math.cos(rad);
                      const iconY = cy + iconRadius * Math.sin(rad);

                      return (
                        <g transform={`translate(${iconX},${iconY})`}>
                          <foreignObject x={-24} y={-24} width={48} height={48}>
                            <div className={`w-12 h-12 rounded-2xl ${getSkillColor(skill.skill.slug)} flex items-center justify-center shadow-lg`}>
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
                          {skill.progress_percent}%
                        </span>
                      </div>
                      <Progress value={skill.progress_percent} className="h-2" />
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
