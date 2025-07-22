import React from 'react';
import { ArrowLeft, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TaskDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/tasks/data-analysis')}
            className="w-8 h-8 flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Анализ данных</h1>
            <p className="text-sm text-muted-foreground">3 задания</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/tasks/data-analysis')}
          className="w-10 h-10 bg-muted rounded-2xl flex items-center justify-center"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Status Badge */}
        <div>
          <span className="bg-purple-accent text-white text-sm font-medium px-3 py-1 rounded-full">
            Новое
          </span>
        </div>

        {/* Title and Description */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">Когортный анализ и SQL</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Проведение когортного анализа на основе данных в различных таблицах, а также формирование SQL запросов при помощи GPT
          </p>
        </div>

        {/* What You'll Learn */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Чему научишься</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm text-muted-foreground">Анализировать большие таблицы</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm text-muted-foreground">Составлять SQL-запросы</span>
            </li>
          </ul>
        </div>

        {/* Task */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Задание</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Скачай табличку и проанализируй её. Твоя задача с помощью GPT составить SQL запрос для того, чтобы выявить сумму всех транзакций у клиентов, чьё LTV больше 5000 рублей
          </p>
        </div>

        {/* Materials */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Материалы</h3>
          <div className="space-y-3">
            <div className="bg-card rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-xl">📊</div>
                <span className="text-sm font-medium text-foreground">Ссылка на таблицу</span>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </div>
            
            <div className="bg-card rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-xl">🎓</div>
                <span className="text-sm font-medium text-foreground">Ссылка на курс</span>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-4 left-4 right-4 max-w-sm mx-auto">
        <button className="w-full bg-foreground text-background py-4 rounded-2xl text-base font-medium">
          Сдать домашку
        </button>
      </div>
    </div>
  );
};

export default TaskDetail;