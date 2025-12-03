import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Lock, Check, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserAssignments } from '@/hooks/useUserAssignments';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { getSkillIcon, getSkillColor } from '@/utils/skillIconsDemo';

const SkillAssignmentsDemo = () => {
  const navigate = useNavigate();
  const { skillName } = useParams();
  const { user } = useAuth();
  const [skillTitle, setSkillTitle] = useState<string>('');

  useEffect(() => {
    if (skillName) {
      supabase
        .from('skills')
        .select('name')
        .eq('slug', skillName)
        .single()
        .then(({ data }) => {
          if (data) setSkillTitle(data.name);
        });
    }
  }, [skillName]);

  const { assignments, loading } = useUserAssignments(user?.id, skillName);

  // Group assignments by level
  const groupedAssignments = assignments.reduce((acc, assignment) => {
    if (!acc[assignment.level]) {
      acc[assignment.level] = [];
    }
    acc[assignment.level].push(assignment);
    return acc;
  }, {} as Record<string, typeof assignments>);

  // Determine level status based on submissions
  const getLevelStatus = (level: string) => {
    const levelAssignments = groupedAssignments[level] || [];
    const completedCount = levelAssignments.filter(a => a.submission?.status === 'completed').length;
    const totalCount = levelAssignments.length;

    if (completedCount === totalCount && totalCount > 0) return 'completed';
    if (completedCount > 0 || levelAssignments.some(a => a.submission?.status === 'submitted')) return 'in_progress';
    return 'locked';
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <p className="text-[#4b5563]">Загрузка...</p>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="min-h-screen p-4">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/tasks/demo')}
            className="w-8 h-8 flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6 text-[#111827]" />
          </button>
          <h1 className="text-xl font-semibold text-[#111827]">Навык не найден</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 px-4 pb-24 md:max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 py-6">
        <button 
          onClick={() => navigate('/tasks/demo')}
          className="w-10 h-10 glass-subtle rounded-2xl flex items-center justify-center"
        >
          <ChevronLeft className="w-6 h-6 text-[#111827]" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div 
            className={`w-12 h-12 rounded-2xl ${getSkillColor(skillName || '')} flex items-center justify-center shadow-lg flex-shrink-0`}
            style={{ boxShadow: '0 8px 16px rgba(25, 86, 255, 0.4)' }}
          >
            {getSkillIcon(skillName || '')}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#111827]">{skillTitle}</h1>
            <p className="text-sm text-[#F37168] font-medium">
              {assignments.length} заданий
            </p>
          </div>
        </div>
      </div>

      {/* Levels */}
      <div className="space-y-4">
        {['Basic', 'Pro', 'AI-Native'].map((level) => {
          const levelAssignments = groupedAssignments[level] || [];
          const levelStatus = getLevelStatus(level);

          if (levelAssignments.length === 0) return null;

          const isLocked = levelStatus === 'locked';

          return (
            <Card key={level} className="border-0 shadow-xl bg-white">
              <CardContent className="p-5">
                {/* Level Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 text-xs font-medium text-[#F37168] border border-[#F37168]/30 rounded-full bg-transparent">
                      {level}
                    </span>
                    <span className="text-sm text-[#4b5563]">
                      {levelAssignments.filter(a => a.submission?.status === 'completed').length}/{levelAssignments.length} выполнено
                    </span>
                  </div>
                  {isLocked && (
                    <Lock className="w-5 h-5 text-[#111827]" />
                  )}
                </div>
                
                {/* Educational Content - Simple blocks */}
                <div className="space-y-3 mb-4">
                  <div 
                    className={`bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-all ${isLocked ? 'opacity-60' : ''}`}
                  >
                    <span className="font-medium text-[#111827]">Обучающее видео</span>
                    <ChevronRight className="w-5 h-5 text-[#F37168]" />
                  </div>

                  <div 
                    className={`bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-all ${isLocked ? 'opacity-60' : ''}`}
                  >
                    <span className="font-medium text-[#111827]">Дополнительные материалы</span>
                    <ChevronRight className="w-5 h-5 text-[#F37168]" />
                  </div>
                </div>
                
                {/* Tasks */}
                <div className="space-y-3">
                  {levelAssignments.map((assignment) => {
                    const assignmentStatus = assignment.submission?.status || 'not_started';
                    const isAvailable = assignment.task_id !== null;
                    const isCompleted = assignmentStatus === 'completed';
                    const isClickable = isAvailable && !isCompleted;
                    
                    const handleAssignmentClick = () => {
                      if (isClickable) {
                        navigate(`/task/${assignment.task_id}/demo`);
                      }
                    };

                    const getAssignmentDisplayStatus = () => {
                      if (assignmentStatus === 'completed') return 'completed';
                      if (assignmentStatus === 'submitted' || assignmentStatus === 'in_progress') return 'in_progress';
                      return 'not_started';
                    };

                    const displayStatus = getAssignmentDisplayStatus();

                    return (
                      <div 
                        key={assignment.id}
                        onClick={handleAssignmentClick}
                        className={`bg-white border border-gray-100 rounded-xl p-4 transition-all ${
                          !isAvailable
                            ? 'opacity-60 cursor-not-allowed'
                            : isClickable
                            ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' 
                            : 'cursor-default opacity-70'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1">
                            <p className={`font-medium ${
                              isAvailable ? 'text-[#111827]' : 'text-[#4b5563]'
                            }`}>
                              {assignment.title}
                            </p>
                          </div>
                          
                          {/* Status indicator */}
                          <div className="flex-shrink-0">
                            {!isAvailable ? (
                              <Lock className="w-5 h-5 text-[#111827]" />
                            ) : displayStatus === 'completed' ? (
                              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            ) : displayStatus === 'in_progress' ? (
                              <div className="w-6 h-6 rounded-full bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center">
                                <Clock className="w-3 h-3 text-yellow-600" />
                              </div>
                            ) : (
                              <ChevronRight className="w-5 h-5 text-[#F37168]" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SkillAssignmentsDemo;
