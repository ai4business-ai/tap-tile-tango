import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Lock, Check, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserAssignments } from '@/hooks/useUserAssignments';
import { useUserSkills } from '@/hooks/useUserSkills';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { getSkillIcon, getSkillColor } from '@/utils/skillIconsDemo';

const levelToNumber: Record<string, number> = { 'Basic': 1, 'Pro': 2, 'AI-Native': 3 };

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
  const { skills: userSkills } = useUserSkills(user?.id);

  const currentSkillData = userSkills.find(s => s.skill.slug === skillName);
  const targetLevel = currentSkillData?.target_level ?? 1;

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
    const levelNum = levelToNumber[level] || 1;

    if (completedCount === totalCount && totalCount > 0) return 'completed';
    if (completedCount > 0 || levelAssignments.some(a => a.submission?.status === 'submitted')) return 'in_progress';
    if (levelNum === 1 || targetLevel >= levelNum) return 'planned';
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 py-6">
        <button 
          onClick={() => navigate('/tasks/demo')}
          className="w-10 h-10 glass-subtle rounded-2xl flex items-center justify-center"
        >
          <ChevronLeft className="w-6 h-6 text-[#111827]" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-[#111827]">{skillTitle}</h1>
          <p className="text-sm text-[#F37168] font-medium">
            {assignments.length} заданий
          </p>
        </div>
      </div>

      {/* Levels */}
      <div className="space-y-4">
        {['Basic', 'Pro', 'AI-Native'].map((level) => {
          const levelAssignments = groupedAssignments[level] || [];
          const levelStatus = getLevelStatus(level);

          if (levelAssignments.length === 0) return null;

          // Only show lock for Pro and AI-Native levels when locked
          const isLevelLocked = level !== 'Basic' && levelStatus === 'locked';

          return (
            <Card key={level} className="border-0 shadow-xl bg-white">
              <CardContent className="p-5">
                {/* Level Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-4 py-1.5 text-sm font-medium text-[#F37168] border border-[#F37168]/30 rounded-full bg-transparent">
                    {level}
                  </span>
                  {isLevelLocked ? (
                    <Lock className="w-5 h-5 text-[#111827]" />
                  ) : levelStatus === 'planned' ? (
                    <span className="text-xs font-medium text-blue-500 bg-blue-50 px-2.5 py-1 rounded-full">
                      Запланировано
                    </span>
                  ) : levelStatus === 'in_progress' ? (
                    <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-full">
                      В процессе
                    </span>
                  ) : levelStatus === 'completed' ? (
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                      Выполнено
                    </span>
                  ) : null}
                </div>
                
                {/* Educational Content - Purple left border blocks */}
                <div className={`space-y-3 mb-4 ${isLevelLocked ? 'opacity-50' : ''}`}>
                  <div 
                    className={`bg-[#f9fafb] border-l-4 border-[#8277EC] rounded-xl p-4 ${
                      isLevelLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'
                    } transition-all`}
                  >
                    <span className="font-medium text-[#111827]">Обучающее видео</span>
                  </div>

                  <div 
                    className={`bg-[#f9fafb] border-l-4 border-[#8277EC] rounded-xl p-4 ${
                      isLevelLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'
                    } transition-all`}
                  >
                    <span className="font-medium text-[#111827]">Дополнительные материалы</span>
                  </div>
                </div>
                
                {/* Tasks */}
                <div className={`space-y-3 ${isLevelLocked ? 'opacity-50' : ''}`}>
                  {levelAssignments.map((assignment) => {
                    const assignmentStatus = assignment.submission?.status || 'not_started';
                    const isAvailable = assignment.task_id !== null && !isLevelLocked;
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
                            ? 'cursor-not-allowed'
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
                          
                          {/* Status indicator - no lock icons for individual items */}
                          <div className="flex-shrink-0">
                            {isLevelLocked ? null : displayStatus === 'completed' ? (
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
