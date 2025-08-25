
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TaskHeader } from '@/components/task-detail/TaskHeader';
import { TaskMaterials } from '@/components/task-detail/TaskMaterials';
import { CheckResult } from '@/components/task-detail/CheckResult';
import { AnswerForm } from '@/components/task-detail/AnswerForm';
import { SubmitButton } from '@/components/task-detail/SubmitButton';
import { useTaskDetail } from '@/hooks/useTaskDetail';

const TaskDetail = () => {
  const {
    userAnswer,
    setUserAnswer,
    isSubmitting,
    checkResult,
    handleDownloadTable,
    handleOpenCourse,
    handleSubmitHomework,
    navigate
  } = useTaskDetail();

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 max-w-sm md:max-w-md lg:max-w-2xl mx-auto">
      <TaskHeader
        onBack={() => navigate('/tasks/data-analysis')}
        onClose={() => navigate('/tasks/data-analysis')}
        title="Анализ данных"
        subtitle="3 задания"
      />

      <div className="space-y-6">
        <Badge className="bg-white/20 text-glass border border-white/30">
          Новое
        </Badge>

        <div>
          <h2 className="text-xl font-semibold text-glass mb-3">Когортный анализ и SQL</h2>
          <p className="text-sm text-glass-muted leading-relaxed">
            Проведение когортного анализа на основе данных в различных таблицах, а также формирование SQL запросов при помощи GPT
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-glass mb-3">Чему научишься</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-glass rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm text-glass-muted">Анализировать большие таблицы</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-glass rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm text-glass-muted">Составлять SQL-запросы</span>
            </li>
          </ul>
        </div>

        <AnswerForm
          value={userAnswer}
          onChange={setUserAnswer}
          disabled={isSubmitting}
        />

        <TaskMaterials
          onDownloadTable={handleDownloadTable}
          onOpenCourse={handleOpenCourse}
        />

        {checkResult && (
          <CheckResult
            score={checkResult.score}
            feedback={checkResult.feedback}
            suggestions={checkResult.suggestions}
          />
        )}
      </div>

      <SubmitButton
        onClick={handleSubmitHomework}
        isSubmitting={isSubmitting}
        disabled={isSubmitting || !userAnswer.trim()}
      />
    </div>
  );
};

export default TaskDetail;
