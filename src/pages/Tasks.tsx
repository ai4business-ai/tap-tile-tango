import React from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
  const navigate = useNavigate();

  const tasks = [
    {
      title: "Работа с презентациями",
      count: "3 задания",
      badge: "+1",
      isLocked: false
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
          <div key={index} className="bg-card rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-accent rounded-lg flex items-center justify-center">
                  <span className="bg-task-red text-white text-xs font-medium px-1.5 py-0.5 rounded">
                    {task.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-medium text-foreground">{task.title}</h3>
                  <p className="text-sm text-muted-foreground">{task.count}</p>
                </div>
              </div>
              {task.isLocked && (
                <Lock className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;