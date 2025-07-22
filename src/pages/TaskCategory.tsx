import React from 'react';
import { ArrowLeft, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const TaskCategory = () => {
  const navigate = useNavigate();
  const { category } = useParams();

  const handleTaskClick = (taskTitle: string) => {
    if (taskTitle === 'Когортный анализ и SQL') {
      navigate('/task-detail');
    } else {
      console.log(`Clicked: ${taskTitle}`);
    }
  };

  const categoryData = {
    'data-analysis': {
      title: 'Анализ данных',
      count: '3 задания',
      tasks: [
        {
          title: 'Когортный анализ и SQL',
          description: 'Проведение когортного анализа на основе данных в различных таблицах, а также формирование SQL запросов при помощи GPT',
          status: 'Новое',
          statusType: 'new'
        },
        {
          title: 'Выявление аномалий',
          description: 'Поиск и выявление аномалий, анализ их причин на основе данных и формирование гипотез улучшения',
          status: 'Доработки',
          statusType: 'rework'
        },
        {
          title: 'Поиск данных в таблицах',
          description: 'Проанализируешь сложные таблицы на предмет поиска конкретных данных',
          status: 'Проверено',
          statusType: 'completed'
        }
      ]
    }
  };

  const currentCategory = categoryData[category as keyof typeof categoryData];

  if (!currentCategory) {
    return <div>Категория не найдена</div>;
  }

  const getStatusBadge = (statusType: string, status: string) => {
    switch (statusType) {
      case 'new':
        return (
          <span className="bg-purple-accent text-white text-sm font-medium px-3 py-1 rounded-full">
            {status}
          </span>
        );
      case 'rework':
        return (
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-task-red" />
            <span className="bg-task-red/10 text-task-red text-sm font-medium px-3 py-1 rounded-full">
              {status}
            </span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-accent" />
            <span className="bg-green-accent/10 text-green-accent text-sm font-medium px-3 py-1 rounded-full">
              {status}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/tasks')}
          className="w-8 h-8 flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{currentCategory.title}</h1>
          <p className="text-sm text-muted-foreground">{currentCategory.count}</p>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {currentCategory.tasks.map((task, index) => (
          <div key={index} className="bg-card rounded-xl p-4 shadow-sm">
            {/* Status Badge */}
            <div className="mb-3">
              {getStatusBadge(task.statusType, task.status)}
            </div>
            
            {/* Task Content */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground mb-2">{task.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
            </div>
            
            {/* Task Button */}
            {task.title === 'Когортный анализ и SQL' ? (
              <button 
                onClick={() => handleTaskClick(task.title)}
                className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
              >
                Задание
              </button>
            ) : (
              <button 
                disabled
                className="w-full bg-muted text-muted-foreground px-4 py-3 rounded-lg text-sm font-medium cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Задание
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskCategory;