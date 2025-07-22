import React from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyProgress = () => {
  const navigate = useNavigate();

  const skills = [
    {
      title: "Анализ данных",
      progress: 4, // из 5
      score: 0.5,
      target: 1.5,
      date: "20 апреля в 14:00",
      isNew: false
    },
    {
      title: "Работа с презентациями",
      progress: 3, // из 5  
      score: 0.5,
      target: 0.5,
      date: "20 апреля в 14:00",
      isNew: false
    },
    {
      title: "Поиск и исследования",
      progress: 3, // из 5
      score: 0.5,
      target: 1.0,
      date: "20 апреля в 14:00",
      isNew: false
    },
    {
      title: "Работа с текстом",
      progress: 4, // из 5
      score: 0.5,
      target: 1.5,
      date: "20 апреля в 14:00",
      isNew: false
    },
    {
      title: "Креатив и визуализация",
      progress: 2, // из 5
      score: 0.3,
      target: 3.0,
      date: "20 апреля в 14:00",
      isNew: true
    }
  ];

  const renderProgressBars = (progress: number, total: number = 5) => {
    return (
      <div className="flex gap-1">
        {[...Array(total)].map((_, index) => (
          <div 
            key={index}
            className={`h-2 flex-1 rounded-full ${
              index < progress ? 'bg-purple-accent' : 'bg-gray-200'
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

      {/* Skills Diagram */}
      <div className="relative bg-card rounded-xl p-6 mb-6 h-80 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Central hub */}
          <div className="w-16 h-16 bg-purple-accent/20 rounded-full flex items-center justify-center relative">
            <div className="w-8 h-8 bg-purple-accent rounded-full"></div>
            
            {/* Skill branches */}
            {skills.map((skill, index) => {
              const angle = (index * 72) - 90; // 360/5 = 72 degrees between each
              const radius = 100;
              const x = Math.cos(angle * Math.PI / 180) * radius;
              const y = Math.sin(angle * Math.PI / 180) * radius;
              
              return (
                <div key={index} className="absolute" style={{
                  transform: `translate(${x}px, ${y}px)`
                }}>
                  {/* Skill node */}
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-lg ${
                      skill.progress >= 3 ? 'bg-purple-accent' : 'bg-purple-accent/30'
                    } flex items-center justify-center text-white text-xs font-bold transform -translate-x-6 -translate-y-6`}>
                      {skill.progress}
                    </div>
                    
                    {/* Skill label */}
                    <div className="absolute top-14 left-1/2 transform -translate-x-1/2 text-center">
                      <p className="text-xs text-muted-foreground whitespace-nowrap">{skill.title.split(' ')[0]}</p>
                      {skill.title.split(' ').length > 1 && (
                        <p className="text-xs text-muted-foreground whitespace-nowrap">{skill.title.split(' ').slice(1).join(' ')}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Connection line */}
                  <div 
                    className="absolute top-1/2 left-1/2 w-20 h-0.5 bg-purple-accent/30 origin-left transform -translate-y-0.5 -translate-x-6"
                    style={{
                      transform: `translate(-24px, -2px) rotate(${angle + 180}deg)`
                    }}
                  ></div>
                </div>
              );
            })}
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
                <div className="w-10 h-10 bg-purple-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {skill.score}
                </div>
              </div>
            </div>
            
            <div className="mb-2">
              {renderProgressBars(skill.progress)}
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