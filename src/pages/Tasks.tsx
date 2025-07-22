import React from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
  const navigate = useNavigate();

  const handleTaskClick = (taskTitle: string) => {
    if (taskTitle === "Анализ данных") {
      navigate('/tasks/data-analysis');
    } else {
      console.log(`Clicked: ${taskTitle}`);
    }
  };

  const tasks = [
    {
      title: "Работа с презентациями",
      count: "3 задания",
      badge: "+1",
      isLocked: true
    },
    {
      title: "Анализ данных", 
      count: "3 задания",
      badge: "+1",
      isLocked: false
    },
    {
      title: "Поиск и исследования",
      count: "3 задания", 
      badge: "+1",
      isLocked: true
    },
    {
      title: "Работа с текстом",
      count: "3 задания",
      badge: "+1", 
      isLocked: true
    },
    {
      title: "Креатив и визуализация",
      count: "3 задания",
      badge: "+1",
      isLocked: true
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/')}
          className="w-8 h-8 flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Мои задания</h1>
          <p className="text-sm text-muted-foreground">15 заданий</p>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div 
            key={index} 
            className="bg-card rounded-xl p-4 pb-16 shadow-sm relative cursor-pointer hover:bg-muted/20 transition-colors"
            onClick={() => handleTaskClick(task.title)}
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