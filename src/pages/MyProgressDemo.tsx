import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BottomNavigation } from '@/components/BottomNavigation';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useUserSkills } from '@/hooks/useUserSkills';
import { GuestBanner } from '@/components/GuestBanner';
import { GuestLimitDialog } from '@/components/GuestLimitDialog';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { getSkillIcon, getSkillColor } from '@/utils/skillIconsDemo';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const MyProgress = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { skills, loading, updateTargetLevel } = useUserSkills(user?.id);
  const [showSettings, setShowSettings] = useState(false);
  const [showGuestLimit, setShowGuestLimit] = useState(false);

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
    const boughtLevelPercent = getLevelAsPercent(skill.current_level); // Купленный уровень
    
    return {
      subject: skill.skill.slug,
      // Фиолетовый - реальный прогресс пользователя
      value: currentProgress,
      // Оранжевый - максимум по купленному уровню (Basic=33%, Pro=66%, AI-Native=100%)
      targetValue: boughtLevelPercent,
      fullMark: 100,
    };
  });

  const updateSkillTargetLevel = async (skillId: string, targetLevel: number) => {
    await updateTargetLevel(skillId, targetLevel);
  };

  const handleSettingsClick = () => {
    if (!user) {
      setShowGuestLimit(true);
    } else {
      setShowSettings(true);
    }
  };

  const getInitials = () => {
    if (!user) return 'G';
    if (user.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ');
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user.email?.[0].toUpperCase() || 'G';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <GuestLimitDialog
        open={showGuestLimit} 
        onOpenChange={setShowGuestLimit}
        feature="Изменение целевого уровня навыков"
      />

      {/* Custom Top Header for this page */}
      <div className="fixed top-0 left-0 right-0 z-50">
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
                  Здесь лого<br/>вашей компании
                </p>
              </div>
              
              {/* Right: User Avatar Button */}
              <button 
                className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border border-white/40 hover:bg-white/40 transition-all"
              >
                {user?.user_metadata?.avatar_url ? (
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.user_metadata.avatar_url} alt="User" />
                    <AvatarFallback className="bg-transparent text-gray-900 text-sm font-semibold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <span className="text-gray-900 text-sm font-semibold">
                    {getInitials()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pb-24 pt-24">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="w-10 h-10 glass-subtle rounded-2xl flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Мой прогресс</h1>
              <p className="text-sm text-[#8277EC]">{skills.length} навыков</p>
            </div>
          </div>
          <button 
            onClick={handleSettingsClick}
            className="w-10 h-10 glass-subtle rounded-2xl flex items-center justify-center"
          >
            <Settings className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        {/* Radar Chart */}
        <Card className="border-0 shadow-xl bg-white mb-6">
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
                                  className={`w-12 h-12 rounded-2xl ${getSkillColor(skill.skill.slug)} flex items-center justify-center shadow-lg cursor-pointer`}
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
                                    <span className="text-sm font-semibold text-gray-900">{skill.skill.name}</span>
                                  </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <div className="px-2 py-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-gray-900">Выполнено заданий</span>
                    <span className="text-xl font-bold text-[#8277EC]">
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
                  {/* Целевой уровень - показывает купленный уровень навыка */}
                  <Radar 
                    name="Целевой уровень" 
                    dataKey="targetValue" 
                    stroke="#02E8FF"
                    fill="#02E8FF"
                    fillOpacity={0.15}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  {/* Текущий прогресс - ограничен целевым уровнем */}
                  <Radar 
                    name="Прогресс" 
                    dataKey="value" 
                    stroke="#8277EC" 
                    fill="#8277EC" 
                    fillOpacity={0.15}
                    strokeWidth={3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Skills List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Навыки</h2>
          <div className="space-y-3">
            {skills.map((skill) => (
              <Card 
                key={skill.id}
                className="border-0 shadow-md bg-white"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl ${getSkillColor(skill.skill.slug)} flex items-center justify-center shadow-md flex-shrink-0`}>
                      {getSkillIcon(skill.skill.slug)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base mb-2">{skill.skill.name}</h3>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="text-xs font-medium text-[#8277EC] border border-[#8277EC]/30 px-2 py-1 rounded-full">
                          {skill.current_level === 1 ? 'Basic' : skill.current_level === 2 ? 'Pro' : 'AI-Native'}
                        </span>
                        <span className="text-sm font-bold text-[#8277EC]">
                          {getDisplayProgress(skill.skill.slug, skill.progress_percent)}%
                        </span>
                      </div>
                      <Progress 
                        value={getDisplayProgress(skill.skill.slug, skill.progress_percent)} 
                        className={`h-2 ${
                          skills.indexOf(skill) % 3 === 0 
                            ? '[&>div]:bg-gradient-to-r [&>div]:from-[#1956FF] [&>div]:to-[#8277EC]'
                            : skills.indexOf(skill) % 3 === 1 
                            ? '[&>div]:bg-gradient-to-r [&>div]:from-[#1956FF] [&>div]:to-[#02E8FF]'
                            : '[&>div]:bg-gradient-to-r [&>div]:from-[#8277EC] [&>div]:to-[#02E8FF]'
                        }`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto bg-popover/95 backdrop-blur-xl border-border">
            <DialogHeader>
              <DialogTitle>Настройка целевых уровней</DialogTitle>
              <DialogDescription>
                Выберите целевой уровень для каждого навыка
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {skills.map((skill) => (
                <div key={skill.id} className="space-y-2">
                  <h4 className="text-sm font-medium">{skill.skill.name}</h4>
                  <Select 
                    value={skill.target_level.toString()} 
                    onValueChange={(value) => updateSkillTargetLevel(skill.skill_id, parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover/95 backdrop-blur-xl border-border z-50">
                      <SelectItem value="1">Basic</SelectItem>
                      <SelectItem value="2">Pro</SelectItem>
                      <SelectItem value="3">AI-Native</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
              <Button 
                onClick={() => setShowSettings(false)}
                className="w-full mt-6"
              >
                Сохранить
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default MyProgress;
