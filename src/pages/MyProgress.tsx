import React, { useState } from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserSkills } from '@/hooks/useUserSkills';
import { useAuth } from '@/hooks/useAuth';

const MyProgress = () => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user } = useAuth();
  const { skills: userSkills, loading, updateTargetLevel } = useUserSkills(user?.id);

  // Transform data to match existing component structure
  const skills = userSkills.map(userSkill => ({
    title: userSkill.skill.name,
    slug: userSkill.skill.slug,
    progress: userSkill.current_level,
    targetLevel: userSkill.target_level,
    basicCompleted: userSkill.current_level >= 1,
    proSelected: userSkill.target_level >= 2,
    aiNativeSelected: userSkill.target_level >= 3,
    scorePercent: userSkill.progress_percent,
    isGoalAchieved: userSkill.is_goal_achieved
  }));

  const updateSkillTargetLevel = (skillIndex: number, newTargetLevel: number) => {
    const userSkill = userSkills[skillIndex];
    if (userSkill) {
      updateTargetLevel(userSkill.skill_id, newTargetLevel);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  const renderProgressBars = (skill: any) => {
    const levels = ['Basic', 'Pro', 'AI-Native'];
    
    return (
      <div className="space-y-2">
        <div className="flex gap-1">
          {levels.map((level, index) => {
            let bgColor = 'bg-gray-200';
            
            // Special logic for "Исследования и обработка информации"
            if (skill.title === "Исследования и обработка информации") {
              if (index === 0) {
                bgColor = 'bg-green-500'; // Basic completed
              } else if (index === 1 || index === 2) {
                bgColor = 'bg-yellow-400'; // Pro and AI-Native selected but not completed
              }
            }
            // Special logic for "Создание контента", "Анализ и визуализация данных", "Продуктивность"
            else if (["Создание контента", "Анализ и визуализация данных", "Продуктивность"].includes(skill.title)) {
              if (index === 0) {
                bgColor = 'bg-green-500'; // Basic completed
              } else if (index === 1) {
                bgColor = 'bg-yellow-400'; // Pro selected but not completed
              } else if (index === 2) {
                bgColor = 'bg-gray-200'; // AI-Native not selected (white/gray)
              }
            }
            // For other skills (goal achieved) - only Basic completed
            else {
              if (index === 0) {
                bgColor = 'bg-green-500'; // Basic completed
              } else {
                bgColor = 'bg-gray-200'; // Other levels not selected
              }
            }
            
            return (
              <div 
                key={index}
                className={`h-2 flex-1 rounded-full ${bgColor}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          {levels.map((level, index) => (
            <span key={index} className="text-[10px]">{level}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 max-w-sm md:max-w-md lg:max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="w-10 h-10 glass-subtle rounded-2xl flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-glass" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-glass">Мой прогресс</h1>
            <p className="text-sm text-glass-muted">8 навыков</p>
          </div>
        </div>
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <button className="w-10 h-10 glass-subtle rounded-2xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-glass-muted" />
            </button>
          </DialogTrigger>
          <DialogContent className="glass-strong border-white/30 max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-glass">Настройка целевых уровней</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {skills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="text-sm font-medium text-glass">{skill.title}</h4>
                  <Select 
                    value={skill.targetLevel.toString()} 
                    onValueChange={(value) => updateSkillTargetLevel(index, parseInt(value))}
                  >
                    <SelectTrigger className="glass-subtle border-white/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-strong border-white/30">
                      <SelectItem value="1">Basic</SelectItem>
                      <SelectItem value="2">Pro</SelectItem>
                      <SelectItem value="3">AI-Native</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
              <Button 
                onClick={() => setIsSettingsOpen(false)}
                className="w-full mt-6 bg-white/20 hover:bg-white/30 text-glass border border-white/30"
              >
                Сохранить
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Skills Diagram - Radar Chart */}
      <div className="relative glass-card rounded-3xl p-6 mb-6 h-80 overflow-hidden shadow-inner">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-60 h-60">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 240 240">
              <defs>
                {/* Gradients */}
                <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(139 92 246)" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="rgb(139 92 246)" stopOpacity="0.05"/>
                </linearGradient>
                <linearGradient id="targetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(139 92 246)" stopOpacity="0.1"/>
                  <stop offset="100%" stopColor="rgb(139 92 246)" stopOpacity="0.02"/>
                </linearGradient>
              </defs>
              
              {/* Octagon grid lines (3 levels) */}
              {[1, 2, 3].map((level) => {
                const scale = level / 3;
                const points = skills.map((_, index) => {
                  const angle = (index * 45 - 90) * Math.PI / 180;
                  const radius = 80 * scale;
                  const x = 120 + Math.cos(angle) * radius;
                  const y = 120 + Math.sin(angle) * radius;
                  return `${x},${y}`;
                }).join(' ');
                
                return (
                  <polygon
                    key={level}
                    points={points}
                    fill="none"
                    stroke="rgb(229 231 235)"
                    strokeWidth="1"
                    opacity={0.5}
                  />
                );
              })}
              
              {/* Axis lines */}
              {skills.map((_, index) => {
                const angle = (index * 45 - 90) * Math.PI / 180;
                const x = 120 + Math.cos(angle) * 80;
                const y = 120 + Math.sin(angle) * 80;
                
                return (
                  <line
                    key={index}
                    x1="120"
                    y1="120"
                    x2={x}
                    y2={y}
                    stroke="rgb(229 231 235)"
                    strokeWidth="1"
                    opacity={0.3}
                  />
                );
              })}
              
              {/* Target level polygon (dashed) */}
              <polygon
                points={skills.map((skill, index) => {
                  const angle = (index * 45 - 90) * Math.PI / 180;
                  const radius = (skill.targetLevel / 3) * 80;
                  const x = 120 + Math.cos(angle) * radius;
                  const y = 120 + Math.sin(angle) * radius;
                  return `${x},${y}`;
                }).join(' ')}
                fill="url(#targetGradient)"
                stroke="rgb(139 92 246)"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.6"
              />
              
              {/* Current progress polygon */}
              <polygon
                points={skills.map((skill, index) => {
                  const angle = (index * 45 - 90) * Math.PI / 180;
                  const radius = (skill.progress / 3) * 80;
                  const x = 120 + Math.cos(angle) * radius;
                  const y = 120 + Math.sin(angle) * radius;
                  return `${x},${y}`;
                }).join(' ')}
                fill="url(#radarGradient)"
                stroke="rgb(139 92 246)"
                strokeWidth="3"
              />
              
              {/* Progress points */}
              {skills.map((skill, index) => {
                const angle = (index * 45 - 90) * Math.PI / 180;
                const radius = (skill.progress / 3) * 80;
                const x = 120 + Math.cos(angle) * radius;
                const y = 120 + Math.sin(angle) * radius;
                
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="rgb(139 92 246)"
                    stroke="white"
                    strokeWidth="2"
                  />
                );
              })}
              
              {/* Target points */}
              {skills.map((skill, index) => {
                const angle = (index * 45 - 90) * Math.PI / 180;
                const radius = (skill.targetLevel / 3) * 80;
                const x = 120 + Math.cos(angle) * radius;
                const y = 120 + Math.sin(angle) * radius;
                
                return (
                  <circle
                    key={`target-${index}`}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="none"
                    stroke="rgb(139 92 246)"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                );
              })}
              
              {/* Center point */}
              <circle
                cx="120"
                cy="120"
                r="3"
                fill="rgb(139 92 246)"
              />
            </svg>
            
            {/* Skills labels positioned around octagon */}
            {skills.map((skill, index) => {
              const angle = (index * 45 - 90) * Math.PI / 180;
              const labelRadius = 105;
              const x = 120 + Math.cos(angle) * labelRadius;
              const y = 120 + Math.sin(angle) * labelRadius;
              
              return (
                <div
                  key={index}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center"
                  style={{
                    left: `${(x / 240) * 100}%`,
                    top: `${(y / 240) * 100}%`
                  }}
                >
                  <p className="text-xs text-glass-muted whitespace-nowrap font-medium leading-tight">
                    {skill.title.split(' ')[0]}
                  </p>
                  {skill.title.split(' ').length > 1 && (
                    <p className="text-xs text-glass-muted whitespace-nowrap font-medium leading-tight">
                      {skill.title.split(' ').slice(1).join(' ')}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Skills List */}
      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div key={index} className="glass-card rounded-3xl p-6 shadow-inner">
            {skill.isGoalAchieved && (
              <div className="mb-2">
                <span className="bg-white/20 text-glass text-xs px-3 py-1 rounded-full border border-white/30">
                  Цель достигнута
                </span>
              </div>
            )}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-glass">{skill.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-12 h-12 ${skill.isGoalAchieved ? 'bg-white/30' : 'bg-white/20'} rounded-2xl flex items-center justify-center text-glass font-bold text-sm border border-white/30`}>
                  {skill.scorePercent}%
                </div>
              </div>
            </div>
            
            <div className="mb-2">
              {renderProgressBars(skill)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProgress;