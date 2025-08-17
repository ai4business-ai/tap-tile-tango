import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const SkillAssignments = () => {
  const navigate = useNavigate();
  const { skillName } = useParams();

  const skillAssignments = {
    "research": {
      title: "Исследования и обработка информации",
      levels: {
        "Basic": [
          "Эффективный поиск информации в Google",
          "Работа с научными базами данных",
          "Оценка достоверности источников",
          "Структурирование найденной информации"
        ],
        "Pro": [
          "Автоматизация сбора данных",
          "Использование ИИ для анализа текстов",
          "Создание систем мониторинга информации",
          "Работа с большими массивами данных"
        ],
        "AI-Native": [
          "Создание ИИ-агентов для исследований",
          "Интеграция множественных источников данных",
          "Предиктивная аналитика трендов",
          "Автоматическое создание отчетов исследований"
        ]
      }
    }
  };

  const currentSkill = skillAssignments["research"];
  
  if (!currentSkill) {
    return <div>Навык не найден</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/tasks')}
          className="w-8 h-8 flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{currentSkill.title}</h1>
          <p className="text-sm text-muted-foreground">Задания по уровням</p>
        </div>
      </div>

      {/* Levels */}
      <div className="space-y-6">
        {Object.entries(currentSkill.levels).map(([level, assignments]) => (
          <div key={level} className="bg-card/60 backdrop-blur-lg rounded-2xl p-4 border border-white/10 shadow-lg">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground mb-2">{level}</h2>
              <div className="h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
            </div>
            
            <div className="space-y-3">
              {assignments.map((assignment, index) => (
                <div 
                  key={index}
                  className="bg-background/30 rounded-xl p-3 border border-white/5 hover:bg-background/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{assignment}</p>
                    <div className="w-6 h-6 rounded-full border-2 border-primary/30 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary/50"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillAssignments;