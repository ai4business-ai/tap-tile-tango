import React from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
  const navigate = useNavigate();

  const handleTaskClick = (taskTitle: string, isLocked: boolean) => {
    if (isLocked) {
      return; // Do nothing if locked
    }
    
    if (taskTitle === "Исследования и обработка информации") {
      navigate('/skill-assignments/research');
    } else if (taskTitle === "Анализ и визуализация данных") {
      navigate('/tasks/data-analysis');
    } else {
      console.log(`Clicked: ${taskTitle}`);
    }
  };

  const tasks = [
    {
      title: "Исследования и обработка информации",
      count: "12 заданий",
      badge: "+3",
      isLocked: false,
      levels: ["Basic", "Pro", "AI-Native"]
    },
    {
      title: "Создание контента", 
      count: "11 заданий",
      badge: "+3",
      isLocked: true,
      levels: ["Basic", "Pro", "AI-Native"]
    },
    {
      title: "Анализ и визуализация данных",
      count: "11 заданий", 
      badge: "+3",
      isLocked: true,
      levels: ["Basic", "Pro", "AI-Native"]
    },
    {
      title: "Автоматизация процессов",
      count: "11 заданий",
      badge: "+3", 
      isLocked: true,
      levels: ["Basic", "Pro", "AI-Native"]
    },
    {
      title: "Решение задач и принятие решений",
      count: "11 заданий",
      badge: "+3",
      isLocked: true,
      levels: ["Basic", "Pro", "AI-Native"]
    },
    {
      title: "Коммуникация и работа в команде",
      count: "11 заданий",
      badge: "+3",
      isLocked: true,
      levels: ["Basic", "Pro", "AI-Native"]
    },
    {
      title: "Продуктивность",
      count: "11 заданий",
      badge: "+3",
      isLocked: true,
      levels: ["Basic", "Pro", "AI-Native"]
    },
    {
      title: "Управление знаниями",
      count: "11 заданий",
      badge: "+3",
      isLocked: true,
      levels: ["Basic", "Pro", "AI-Native"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6 lg:p-8 max-w-sm md:max-w-md lg:max-w-2xl mx-auto">
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
            <h1 className="text-xl font-semibold text-foreground">Мои задания</h1>
            <p className="text-sm text-muted-foreground">89 заданий</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-2">
          <img 
            src="/lovable-uploads/2b30c222-0182-4f9f-90f1-5056bee4557e.png" 
            alt="Билайн логотип" 
            className="w-16 h-auto"
          />
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div 
            key={index} 
            className={`bg-card/60 backdrop-blur-lg rounded-2xl p-4 pb-16 shadow-lg relative transition-colors border border-white/10 ${
              task.isLocked ? 'opacity-60' : 'cursor-pointer hover:bg-card/80'
            }`}
            onClick={() => handleTaskClick(task.title, task.isLocked)}
          >
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">{task.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{task.count}</p>
              
              {/* Badge positioned below text */}
              <span className="bg-purple-accent text-white text-sm font-medium px-2 py-1 rounded-lg">
                {task.badge}
              </span>
            </div>
            
            {/* Lock icon */}
            {task.isLocked && (
              <div className="absolute bottom-4 right-4">
                <Lock className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;