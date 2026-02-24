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
import { levelToPercent } from '@/utils/skillLevels';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MyProgress = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { skills, loading, updateTargetLevel } = useUserSkills(user?.id);
  const [showSettings, setShowSettings] = useState(false);
  const [showGuestLimit, setShowGuestLimit] = useState(false);
  const isMobile = useIsMobile();

  const radarData = skills.map(skill => ({
    subject: skill.skill.slug,
    value: Math.max(skill.progress_percent, 1),
    target: levelToPercent(skill.target_level),
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

  return (
    <div className="min-h-screen">
      <GuestLimitDialog
        open={showGuestLimit} 
        onOpenChange={setShowGuestLimit}
        feature="Изменение целевого уровня навыков"
      />

      <div className="pb-24 lg:pb-8">
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

        {/* Desktop: 2-col layout, Mobile: stacked */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Radar Chart */}
          <Card className="border-0 shadow-xl bg-white mb-6 lg:mb-0">
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
                <ResponsiveContainer width="100%" height={isMobile ? 320 : 420}>
                  <RadarChart data={radarData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <PolarGrid stroke="#E5E7EB" strokeWidth={1} />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={({ payload, x, y, cx, cy, index }) => {
                        const skill = skills.find(s => s.skill.slug === payload.value);
                        if (!skill) return null;
                        
                        const angle = (index * 360) / skills.length - 90;
                        const rad = (angle * Math.PI) / 180;
                        const iconRadius = isMobile ? 135 : 175;
                        const iconX = cx + iconRadius * Math.cos(rad);
                        const iconY = cy + iconRadius * Math.sin(rad);
                        const progressPercent = skill.progress_percent;
                        
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
                                      <span className="text-sm text-muted-foreground">Прогресс</span>
                                      <span className="text-xl font-bold text-[#8B5CF6]">
                                        {progressPercent}%
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
                    <Radar name="Цель" dataKey="target" stroke="#F97316" fill="#F97316" fillOpacity={0.08} strokeWidth={2} strokeDasharray="6 4" />
                    <Radar name="Прогресс" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.25} strokeWidth={3} />
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
                <Card key={skill.id} className="border-0 shadow-md bg-white">
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

        {/* Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto bg-popover/95 backdrop-blur-xl border-border">
            <DialogHeader>
              <DialogTitle>Настройка целевых уровней</DialogTitle>
              <DialogDescription>Выберите целевой уровень для каждого навыка</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {skills.map((skill) => (
                <div key={skill.id} className="space-y-2">
                  <h4 className="text-sm font-medium">{skill.skill.name}</h4>
                  <Select value={skill.target_level.toString()} onValueChange={(value) => updateSkillTargetLevel(skill.skill_id, parseInt(value))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover/95 backdrop-blur-xl border-border z-50">
                      <SelectItem value="1">Basic</SelectItem>
                      <SelectItem value="2">Pro</SelectItem>
                      <SelectItem value="3">AI-Native</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
              <Button onClick={() => setShowSettings(false)} className="w-full mt-6">Сохранить</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyProgress;
