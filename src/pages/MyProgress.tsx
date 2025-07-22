import React from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyProgress = () => {
  const navigate = useNavigate();

  const skills = [
    {
      title: "Анализ данных",
      progress: 2, // из 3
      availableNext: true, // третье задание доступно
      scorePercent: 67,
      target: 1.5,
      date: "20 апреля в 14:00",
      isNew: true
    },
    {
      title: "Работа с презентациями",
      progress: 2, // из 3  
      availableNext: false,
      scorePercent: 67,
      target: 0.5,
      date: "20 апреля в 14:00",
      isNew: false
    },
    {
      title: "Поиск и исследования",
      progress: 2, // из 3
      availableNext: false,
      scorePercent: 67,
      target: 1.0,
      date: "20 апреля в 14:00",
      isNew: false
    },
    {
      title: "Работа с текстом",
      progress: 2, // из 3
      availableNext: false,
      scorePercent: 67,
      target: 1.5,
      date: "20 апреля в 14:00",
      isNew: false
    },
    {
      title: "Креатив и визуализация",
      progress: 2, // из 3
      availableNext: false,
      scorePercent: 67,
      target: 3.0,
      date: "20 апреля в 14:00",
      isNew: false
    }
  ];

  const renderProgressBars = (progress: number, availableNext: boolean = false, total: number = 3) => {
    return (
      <div className="flex gap-1">
        {[...Array(total)].map((_, index) => (
          <div 
            key={index}
            className={`h-2 flex-1 rounded-full ${
              index < progress ? 'bg-green-500' : 
              index === progress && availableNext ? 'bg-yellow-400' : 
              'bg-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 max-w-sm mx-auto">
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
            <p className="text-sm text-muted-foreground">5 навыков</p>
          </div>
        </div>
        <button className="w-8 h-8 flex items-center justify-center">
          <Settings className="w-6 h-6 text-muted-foreground" />
        </button>
      </div>

      {/* Skills Diagram - Radar Chart */}
      <div className="relative bg-card rounded-xl p-6 mb-6 h-80 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-60 h-60">
            {/* Pentagon background */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 240 240">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(229 231 235)" strokeWidth="1"/>
                </pattern>
              </defs>
              
              {/* Pentagon shape filled with gradient */}
              <polygon
                points="120,20 180,80 160,160 80,160 60,80"
                fill="url(#pentagonGradient)"
                stroke="rgb(139 92 246)"
                strokeWidth="2"
              />
              
              <defs>
                <linearGradient id="pentagonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(139 92 246)" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="rgb(139 92 246)" stopOpacity="0.1"/>
                </linearGradient>
              </defs>
              
              {/* Pentagon outline */}
              <polygon
                points="120,20 180,80 160,160 80,160 60,80"
                fill="none"
                stroke="rgb(229 231 235)"
                strokeWidth="1"
              />
            </svg>
            
            {/* Skills labels positioned around pentagon */}
            {skills.map((skill, index) => {
              const positions = [
                { x: '50%', y: '10%', textAlign: 'center' }, // top
                { x: '85%', y: '35%', textAlign: 'left' },   // top-right
                { x: '80%', y: '85%', textAlign: 'left' },   // bottom-right
                { x: '20%', y: '85%', textAlign: 'right' },  // bottom-left
                { x: '15%', y: '35%', textAlign: 'right' }   // top-left
              ];
              
              const position = positions[index];
              
              return (
                <div
                  key={index}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: position.x,
                    top: position.y,
                    textAlign: position.textAlign as any
                  }}
                >
                  <p className="text-xs text-muted-foreground whitespace-nowrap font-medium">
                    {skill.title}
                  </p>
                </div>
              );
            })}
            
            {/* Center icon */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 bg-purple-accent/20 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-purple-accent rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills List */}
      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div key={index} className="bg-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {skill.isNew && (
                  <span className="bg-purple-accent text-white text-xs px-2 py-1 rounded-full">
                    Новое
                  </span>
                )}
                <h3 className="text-base font-semibold text-foreground">{skill.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-purple-accent rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {skill.scorePercent}%
                </div>
              </div>
            </div>
            
            <div className="mb-2">
              {renderProgressBars(skill.progress, skill.availableNext)}
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>еще {skill.target} до цели</span>
              <span>{skill.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProgress;