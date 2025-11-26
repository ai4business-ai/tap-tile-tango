import React, { useEffect, useState } from 'react';
import { ArrowLeft, Play, BookOpen, FileText, Lock, Check, Clock, PlayCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { GuestBanner } from '@/components/GuestBanner';
import { useUserAssignments } from '@/hooks/useUserAssignments';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const SkillAssignments = () => {
  const navigate = useNavigate();
  const { skillName } = useParams();
  const { user } = useAuth();
  const [skillTitle, setSkillTitle] = useState<string>('');

  useEffect(() => {
    // Fetch skill title
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
    if (completedCount > 0 || levelAssignments.some(a => a.submission?.status === 'submitted')) return 'planned';
    return 'locked';
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="min-h-screen p-4">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/tasks')}
            className="w-8 h-8 flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Навык не найден</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="px-4 pb-4 md:px-6 md:pb-6 lg:px-8 lg:pb-8 md:max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/tasks')}
            className="w-8 h-8 flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{skillTitle}</h1>
            <p className="text-sm text-muted-foreground">Задания по уровням</p>
          </div>
        </div>

        {/* Levels */}
        <div className="space-y-6">
        {['Basic', 'Pro', 'AI-Native'].map((level) => {
          const levelAssignments = groupedAssignments[level] || [];
          const levelStatus = getLevelStatus(level);

          if (levelAssignments.length === 0) return null;
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

          const statusBadge = getStatusBadge(levelStatus);

          return (
            <div key={level} className={`backdrop-blur-lg rounded-2xl p-4 shadow-lg ${getStatusColor(levelStatus)}`}>
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
                {levelAssignments.map((assignment, index) => {
                  const assignmentStatus = assignment.submission?.status || 'not_started';
                  const isAvailable = assignment.task_id !== null;
                  const isCompleted = assignmentStatus === 'completed';
                  const isClickable = isAvailable && !isCompleted;
                  
                  const handleAssignmentClick = () => {
                    if (isClickable) {
                      navigate(`/task/${assignment.task_id}`);
                    }
                  };

                  const getAssignmentDisplayStatus = () => {
                    if (assignmentStatus === 'completed') return 'completed';
                    if (assignmentStatus === 'submitted' || assignmentStatus === 'in_progress') return 'planned';
                    return 'not_started';
                  };

                  const displayStatus = getAssignmentDisplayStatus();

                  return (
                    <div 
                      key={assignment.id}
                      onClick={handleAssignmentClick}
                      className={`rounded-xl p-3 border transition-all ${
                        !isAvailable
                          ? 'bg-muted/20 border-muted/30 cursor-not-allowed opacity-60'
                          : isClickable
                          ? 'bg-background/40 border-white/10 hover:bg-background/60 hover:border-primary-orange/30 cursor-pointer hover-scale' 
                          : 'bg-background/30 border-white/5 cursor-default opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            isAvailable ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {assignment.title}
                          </p>
                          {!isAvailable && (
                            <p className="text-xs text-muted-foreground mt-1">
                              🔒 Скоро будет доступно
                            </p>
                          )}
                        </div>
                        
                        {/* Status indicator */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!isAvailable ? (
                            <div className="w-6 h-6 rounded-full bg-muted/40 border-2 border-muted/50 flex items-center justify-center">
                              <Lock className="w-3 h-3 text-muted-foreground" />
                            </div>
                          ) : (
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              displayStatus === 'completed' 
                                ? 'border-green-500 bg-green-500' 
                                : displayStatus === 'planned'
                                ? 'border-yellow-400 bg-yellow-400/20'
                                : 'border-primary-orange/40 bg-primary-orange/10'
                            }`}>
                              {displayStatus === 'completed' && (
                                <Check className="w-4 h-4 text-white" />
                              )}
                              {displayStatus === 'planned' && (
                                <Clock className="w-3 h-3 text-yellow-600" />
                              )}
                              {displayStatus === 'not_started' && isAvailable && (
                                <PlayCircle className="w-3 h-3 text-primary-orange" />
                              )}
                            </div>
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
    </div>
  );
};

export default SkillAssignments;