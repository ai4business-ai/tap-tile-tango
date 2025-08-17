import React from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyProgress = () => {
  const navigate = useNavigate();

  const skills = [
    {
      title: "Исследования и обработка информации",
      progress: 3,
      targetLevel: 3,
      basicCompleted: true,
      proSelected: true,
      aiNativeSelected: true,
      scorePercent: 100,
      isGoalAchieved: false
    },
    {
      title: "Создание контента",
      progress: 1,
      targetLevel: 3,
      basicCompleted: true,
      proSelected: true,
      aiNativeSelected: true,
      scorePercent: 33,
      isGoalAchieved: false
    },
    {
      title: "Анализ и визуализация данных",
      progress: 1,
      targetLevel: 3,
      basicCompleted: true,
      proSelected: true,
      aiNativeSelected: true,
      scorePercent: 33,
      isGoalAchieved: false
    },
    {
      title: "Автоматизация процессов",
      progress: 1,
      targetLevel: 1,
      basicCompleted: true,
      proSelected: false,
      aiNativeSelected: false,
      scorePercent: 33,
      isGoalAchieved: true
    },
    {
      title: "Решение задач и принятие решений",
      progress: 1,
      targetLevel: 1,
      basicCompleted: true,
      proSelected: false,
      aiNativeSelected: false,
      scorePercent: 33,
      isGoalAchieved: true
    },
    {
      title: "Коммуникация и работа в команде",
      progress: 1,
      targetLevel: 1,
      basicCompleted: true,
      proSelected: false,
      aiNativeSelected: false,
      scorePercent: 33,
      isGoalAchieved: true
    },
    {
      title: "Продуктивность",
      progress: 1,
      targetLevel: 3,
      basicCompleted: true,
      proSelected: true,
      aiNativeSelected: true,
      scorePercent: 33,
      isGoalAchieved: false
    },
    {
      title: "Управление знаниями",
      progress: 1,
      targetLevel: 1,
      basicCompleted: true,
      proSelected: false,
      aiNativeSelected: false,
      scorePercent: 33,
      isGoalAchieved: true
    }
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="w-8 h-8 flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Мой прогресс</h1>
            <p className="text-sm text-muted-foreground">8 навыков</p>
          </div>
        </div>
        <button className="w-8 h-8 flex items-center justify-center">
          <Settings className="w-6 h-6 text-muted-foreground" />
        </button>
      </div>

      {/* Skills Diagram - Radar Chart */}
      <div className="relative bg-card/60 backdrop-blur-lg rounded-2xl p-6 mb-6 h-80 overflow-hidden border border-white/10 shadow-lg">
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
                  <p className="text-xs text-muted-foreground whitespace-nowrap font-medium leading-tight">
                    {skill.title.split(' ')[0]}
                  </p>
                  {skill.title.split(' ').length > 1 && (
                    <p className="text-xs text-muted-foreground whitespace-nowrap font-medium leading-tight">
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
          <div key={index} className="bg-card/60 backdrop-blur-lg rounded-2xl p-4 border border-white/10 shadow-lg">
            {skill.isGoalAchieved && (
              <div className="mb-2">
                <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                  Цель достигнута
                </span>
              </div>
            )}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">{skill.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 ${skill.isGoalAchieved ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-purple-accent'} rounded-full flex items-center justify-center text-white font-bold text-xs`}>
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