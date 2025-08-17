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
        "Basic": {
          status: "completed", // completed, planned, locked
          assignments: [
            "Найти и обобщить информацию по рабочему вопросу за 5 минут",
            "Проанализировать Word/PDF документ объемом 20+ страниц и создать executive summary на 1 страницу",
            "Проверить факты и данные через множественные источники с оценкой достоверности",
            "Создать саммари документа/статьи"
          ]
        },
        "Pro": {
          status: "planned",
          assignments: [
            "Освоить Deep Research: научиться формулировать исследовательские вопросы и использовать режим глубокого поиска для комплексного анализа",
            "Объединить и проанализировать информацию из 5+ документов разных форматов (PDF, Excel, Word) по одному проекту",
            "Создать сравнительный анализ 3+ решений/подходов с матрицей критериев",
            "Построить базу знаний по проекту с системой тегов и быстрого поиска"
          ]
        },
        "AI-Native": {
          status: "planned",
          assignments: [
            "Создать специализированного GPT/агента для анализа документов вашей отрасли",
            "Разработать систему автоматической проверки фактов и валидации данных",
            "Построить персональную систему knowledge mining из корпоративных документов"
          ]
        }
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
        {Object.entries(currentSkill.levels).map(([level, levelData]) => {
          const getStatusColor = (status: string) => {
            switch (status) {
              case 'completed': return 'bg-green-500/10 border-green-500/20';
              case 'planned': return 'bg-yellow-400/10 border-yellow-400/20';
              default: return 'bg-card/60 border-white/10';
            }
          };

          const getStatusBadge = (status: string) => {
            switch (status) {
              case 'completed': return { text: 'Выполнено', color: 'bg-green-500' };
              case 'planned': return { text: 'Запланировано', color: 'bg-yellow-400' };
              default: return { text: 'Заблокировано', color: 'bg-gray-500' };
            }
          };

          const statusBadge = getStatusBadge(levelData.status);

          return (
            <div key={level} className={`backdrop-blur-lg rounded-2xl p-4 shadow-lg ${getStatusColor(levelData.status)}`}>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-foreground">{level}</h2>
                  <span className={`${statusBadge.color} text-white text-xs px-2 py-1 rounded-full`}>
                    {statusBadge.text}
                  </span>
                </div>
                <div className="h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
              </div>
              
              <div className="space-y-3">
                {levelData.assignments.map((assignment, index) => (
                  <div 
                    key={index}
                    className="bg-background/30 rounded-xl p-3 border border-white/5 hover:bg-background/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{assignment}</p>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        levelData.status === 'completed' 
                          ? 'border-green-500 bg-green-500' 
                          : levelData.status === 'planned'
                          ? 'border-yellow-400/50'
                          : 'border-gray-400/30'
                      }`}>
                        {levelData.status === 'completed' && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                        {levelData.status === 'planned' && (
                          <div className="w-2 h-2 rounded-full bg-yellow-400/50"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillAssignments;