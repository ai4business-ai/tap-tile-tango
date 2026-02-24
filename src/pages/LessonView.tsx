import { useParams, useNavigate } from 'react-router-dom';
import { useCourseContent } from '@/hooks/useCourseContent';
import { useLessonProgress, useMarkLessonComplete } from '@/hooks/useLessonProgress';
import { useAuth } from '@/hooks/useAuth';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Wrench, ChevronRight } from 'lucide-react';
import TheoryBlock from '@/components/lesson/TheoryBlock';
import LessonNavBar from '@/components/lesson/LessonNavBar';
import type { CourseLesson, LessonContentJson } from '@/hooks/useCourseContent';
import { toast } from 'sonner';

export default function LessonView() {
  const { courseSlug, lessonId } = useParams<{ courseSlug: string; lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: course, isLoading } = useCourseContent(courseSlug);
  const markComplete = useMarkLessonComplete();

  // Flatten all lessons
  const allLessons = useMemo(
    () => course?.modules.flatMap(m => m.lessons) || [],
    [course]
  );

  const allLessonIds = useMemo(() => allLessons.map(l => l.id), [allLessons]);
  const { data: progressMap = {} } = useLessonProgress(user?.id, allLessonIds);

  const currentIndex = allLessons.findIndex(l => l.id === lessonId);
  const lesson = allLessons[currentIndex];
  const currentModule = course?.modules.find(m => m.lessons.some(l => l.id === lessonId));

  const completedCount = Object.values(progressMap).filter(p => p.status === 'completed').length;
  const progressPercent = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

  const isCompleted = progressMap[lessonId || '']?.status === 'completed';

  const handleMarkComplete = async () => {
    if (!user?.id || !lessonId) return;
    try {
      await markComplete.mutateAsync({ userId: user.id, lessonId });
      toast.success('Урок отмечен как пройденный!');
    } catch {
      toast.error('Не удалось сохранить прогресс');
    }
  };

  const goToLesson = (idx: number) => {
    const target = allLessons[idx];
    if (target) navigate(`/course/${courseSlug}/lesson/${target.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 space-y-4">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!lesson || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Урок не найден</h2>
          <Button onClick={() => navigate(`/course/${courseSlug}`)}>К курсу</Button>
        </div>
      </div>
    );
  }

  const content = lesson.content_json as LessonContentJson;

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Nav bar */}
        <LessonNavBar
          currentIndex={currentIndex}
          totalLessons={allLessons.length}
          onBack={() => navigate(`/course/${courseSlug}`)}
          onPrev={() => goToLesson(currentIndex - 1)}
          onNext={() => goToLesson(currentIndex + 1)}
          hasPrev={currentIndex > 0}
          hasNext={currentIndex < allLessons.length - 1}
        />

        {/* Progress bar */}
        <Progress value={progressPercent} className="h-1.5 mb-6" />

        {/* Module & Lesson title */}
        <div className="mb-6">
          {currentModule && (
            <p className="text-xs text-muted-foreground mb-1">
              Модуль {currentModule.order_index}. {currentModule.title}
            </p>
          )}
          <h1 className="text-xl lg:text-2xl font-bold text-foreground mb-2">{lesson.title}</h1>
          <div className="flex items-center gap-2">
            {content.duration && (
              <Badge variant="outline" className="text-xs">{content.duration}</Badge>
            )}
            {isCompleted && (
              <Badge variant="accent" className="text-xs gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Пройден
              </Badge>
            )}
          </div>
        </div>

        {/* Content - two column on desktop for practice lessons */}
        <div className={`${lesson.lesson_type === 'practice' ? 'lg:grid lg:grid-cols-5 lg:gap-8' : ''}`}>
          {/* Main content */}
          <div className={lesson.lesson_type === 'practice' ? 'lg:col-span-3' : ''}>
            {content.blocks && <TheoryBlock blocks={content.blocks} />}
          </div>

          {/* Sidebar: homework + tools */}
          {(content.homework || (content.tools && content.tools.length > 0)) && (
            <div className={`${lesson.lesson_type === 'practice' ? 'lg:col-span-2' : ''} mt-8 lg:mt-0 space-y-5`}>
              {content.homework && (
                <div className="p-5 rounded-2xl border border-primary-orange/20 bg-primary-orange/5">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    📝 {content.homework.title}
                  </h3>
                  <ul className="space-y-2">
                    {content.homework.tasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary-orange font-bold mt-0.5">{i + 1}.</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {content.tools && content.tools.length > 0 && (
                <div className="p-5 rounded-2xl border border-sky-blue/20 bg-sky-blue/5">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-sky-blue" />
                    Инструменты
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {content.tools.map((tool, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{tool}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {content.goal && (
                <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50">
                  <h3 className="text-sm font-semibold text-foreground mb-1">🎯 Цель</h3>
                  <p className="text-sm text-muted-foreground">{content.goal}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/40">
          {!isCompleted ? (
            <Button
              onClick={handleMarkComplete}
              disabled={markComplete.isPending || !user}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {markComplete.isPending ? 'Сохраняю...' : 'Отметить как пройденный'}
            </Button>
          ) : (
            <span className="text-sm text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Урок пройден
            </span>
          )}

          {currentIndex < allLessons.length - 1 && (
            <Button variant="outline" onClick={() => goToLesson(currentIndex + 1)}>
              Следующий урок
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
