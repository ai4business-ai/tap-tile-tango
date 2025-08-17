import React from 'react';
import { ArrowLeft, FileText, Check } from 'lucide-react';
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
            { text: "Найти и обобщить информацию по рабочему вопросу за 5 минут", status: "completed" },
            { text: "Проанализировать Word/PDF документ объемом 20+ страниц и создать executive summary на 1 страницу", status: "planned", taskId: "document-analysis" },
            { text: "Проверить факты и данные через множественные источники с оценкой достоверности", status: "completed" },
            { text: "Создать саммари документа/статьи", status: "completed" }
          ]
        },
        "Pro": {
          status: "planned",
          assignments: [
            { text: "Освоить Deep Research: научиться формулировать исследовательские вопросы и использовать режим глубокого поиска для комплексного анализа", status: "planned", taskId: "deep-research" },
            { text: "Объединить и проанализировать информацию из 5+ документов разных форматов (PDF, Excel, Word) по одному проекту", status: "completed" },
            { text: "Создать сравнительный анализ 3+ решений/подходов с матрицей критериев", status: "completed" },
            { text: "Построить базу знаний по проекту с системой тегов и быстрого поиска", status: "completed" }
          ]
        },
        "AI-Native": {
          status: "planned",
          assignments: [
            { text: "Создать специализированного GPT/агента для анализа документов вашей отрасли", status: "planned", taskId: "specialized-gpt" },
            { text: "Разработать систему автоматической проверки фактов и валидации данных", status: "completed" },
            { text: "Построить персональную систему knowledge mining из корпоративных документов", status: "completed" }
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
              
               <div className="space-y-4">
                {levelData.assignments.map((assignment, index) => {
                  const handleAssignmentClick = () => {
                    if (assignment.taskId && assignment.status === 'planned') {
                      navigate(`/task/${assignment.taskId}`);
                    }
                  };

                  const getAssignmentStatusBadge = (status: string) => {
                    switch (status) {
                      case 'completed': return { text: 'Выполнено', color: 'bg-green-500' };
                      case 'planned': return { text: 'К выполнению', color: 'bg-orange-500' };
                      default: return { text: 'Заблокировано', color: 'bg-gray-500' };
                    }
                  };

                  const assignmentBadge = getAssignmentStatusBadge(assignment.status);

                  return (
                    <div 
                      key={index}
                      className="relative bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-4 text-white shadow-lg transition-transform hover:scale-[1.02]"
                    >
                      {/* Status badge in top right */}
                      <div className="absolute top-3 right-3">
                        <span className={`${assignmentBadge.color} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                          {assignmentBadge.text}
                        </span>
                      </div>

                      {/* Large check icon for completed tasks */}
                      {assignment.status === 'completed' && (
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      <div className={`${assignment.status === 'completed' ? 'ml-16' : ''} pr-16`}>
                        <h3 className="font-semibold text-white mb-3 leading-tight">
                          {assignment.text}
                        </h3>

                        {/* Task button */}
                        <button
                          onClick={handleAssignmentClick}
                          disabled={assignment.status !== 'planned'}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            assignment.status === 'planned'
                              ? 'bg-white/20 text-white hover:bg-white/30 cursor-pointer'
                              : 'bg-white/10 text-white/70 cursor-not-allowed'
                          }`}
                        >
                          <FileText className="w-4 h-4" />
                          Задание
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillAssignments;