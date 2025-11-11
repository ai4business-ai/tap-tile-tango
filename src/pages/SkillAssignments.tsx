import React from 'react';
import { ArrowLeft, Play, BookOpen, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const SkillAssignments = () => {
  const navigate = useNavigate();
  const { skillName } = useParams();

  const skillAssignments = {
    "communication": {
      title: "Коммуникация и работа в команде",
      levels: {
        "Basic": {
          status: "planned",
          assignments: [
            { text: "Подготовить ответ клиенту в нужном тоне", status: "planned", taskId: "client-response" },
            { text: "Создать agenda и follow-up встречи", status: "planned", taskId: "meeting-agenda" },
            { text: "Сформулировать конструктивный feedback", status: "planned", taskId: "feedback-colleagues" }
          ]
        },
        "Pro": {
          status: "locked",
          assignments: [
            { text: "Разработать коммуникационную стратегию проекта", status: "locked" },
            { text: "Создать скрипты для сложных переговоров", status: "locked" },
            { text: "Построить систему онбординга для новичков в подразделении", status: "locked" }
          ]
        },
        "AI-Native": {
          status: "locked",
          assignments: [
            { text: "Создать AI-медиатора для команды", status: "locked" },
            { text: "Разработать систему автоматического саммари встреч", status: "locked" },
            { text: "Построить knowledge graph команды", status: "locked" }
          ]
        }
      }
    },
    "research": {
      title: "Исследования и обработка информации",
      levels: {
        "Basic": {
          status: "completed",
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

  const currentSkill = skillAssignments[skillName as keyof typeof skillAssignments];
  
  if (!currentSkill) {
    return <div>Навык не найден</div>;
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 max-w-sm md:max-w-md lg:max-w-2xl mx-auto">
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
              
              {/* Educational Content */}
              <div className="space-y-3 mb-4">
                {/* Video Cover */}
                <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-4 border border-primary/20 hover-scale cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-foreground">Обучающее видео</h3>
                      <p className="text-xs text-muted-foreground">Основы работы на {level} уровне</p>
                    </div>
                    <div className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                      8 мин
                    </div>
                  </div>
                </div>

                {/* Additional Materials Card */}
                <div className="bg-gradient-to-br from-muted/40 to-muted/20 rounded-xl p-4 border border-border/50 hover-scale cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-foreground">Дополнительные материалы</h3>
                      <p className="text-xs text-muted-foreground">Статьи, примеры и шаблоны</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">5</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tasks Header */}
              <div className="mb-3">
                <h3 className="text-sm font-medium text-foreground mb-2">Задания для выполнения</h3>
                <div className="h-px bg-gradient-to-r from-muted-foreground/30 to-transparent"></div>
              </div>
              
               <div className="space-y-3">
                {levelData.assignments.map((assignment, index) => {
                  const handleAssignmentClick = () => {
                    if (assignment.taskId && assignment.status === 'planned') {
                      navigate(`/task/${assignment.taskId}`);
                    }
                  };

                  return (
                    <div 
                      key={index}
                      onClick={handleAssignmentClick}
                      className={`bg-background/30 rounded-xl p-3 border border-white/5 transition-colors ${
                        assignment.taskId && assignment.status === 'planned' 
                          ? 'hover:bg-background/50 cursor-pointer' 
                          : 'cursor-default'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">{assignment.text}</p>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          assignment.status === 'completed' 
                            ? 'border-green-500 bg-green-500' 
                            : assignment.status === 'planned'
                            ? 'border-yellow-400/50'
                            : 'border-gray-400/30'
                        }`}>
                          {assignment.status === 'completed' && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                          {assignment.status === 'planned' && (
                            <div className="w-2 h-2 rounded-full bg-yellow-400/50"></div>
                          )}
                        </div>
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