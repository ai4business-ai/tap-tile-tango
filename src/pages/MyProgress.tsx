import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useUserSkills } from '@/hooks/useUserSkills';
import { GuestBanner } from '@/components/GuestBanner';
import { GuestLimitDialog } from '@/components/GuestLimitDialog';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { getSkillIcon, getSkillColor } from '@/utils/skillIcons';
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
  const radarData = skills.map(skill => ({
    subject: skill.skill.slug,
    value: getDisplayProgress(skill.skill.slug, skill.progress_percent),
    fullMark: 100,
  }));

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <GuestLimitDialog
        open={showGuestLimit} 
        onOpenChange={setShowGuestLimit}
        feature="Изменение целевого уровня навыков"
      />

      <div className="max-w-md mx-auto px-4 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="w-10 h-10 glass-subtle rounded-2xl flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Мой прогресс</h1>
              <p className="text-sm text-muted-foreground">{skills.length} навыков</p>
            </div>
          </div>
          <button 
            onClick={handleSettingsClick}
            className="w-10 h-10 glass-subtle rounded-2xl flex items-center justify-center"
          >
            <Settings className="w-6 h-6 text-muted-foreground" />
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
                                  className={`w-12 h-12 rounded-2xl ${getSkillColor(skill.skill.slug)} flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform`}
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
                className="border-0 shadow-md bg-white"
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
    </div>
  );
};

export default MyProgress;
