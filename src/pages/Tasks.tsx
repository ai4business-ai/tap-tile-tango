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
            <h1 className="text-xl font-semibold text-glass">Мои задания</h1>
            <p className="text-sm text-glass-muted">89 заданий</p>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div 
            key={index} 
            className={`glass-card rounded-3xl p-6 pb-20 shadow-inner relative transition-all ${
              task.isLocked ? 'opacity-60' : 'cursor-pointer hover:bg-white/25'
            }`}
            onClick={() => handleTaskClick(task.title, task.isLocked)}
          >
            <div>
              <h3 className="text-lg font-semibold text-glass mb-1">{task.title}</h3>
              <p className="text-sm text-glass-muted mb-3">{task.count}</p>
              
              {/* Badge positioned below text */}
              <span className="bg-white/20 text-glass text-sm font-medium px-3 py-1 rounded-2xl border border-white/30">
                {task.badge}
              </span>
            </div>
            
            {/* Lock icon */}
            {task.isLocked && (
              <div className="absolute bottom-6 right-6">
                <Lock className="w-6 h-6 text-glass-muted" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;