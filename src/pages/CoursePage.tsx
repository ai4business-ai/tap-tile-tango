import { useParams, useNavigate } from 'react-router-dom';
import { useCourseContent } from '@/hooks/useCourseContent';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { useAuth } from '@/hooks/useAuth';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';
import ModuleAccordion from '@/components/course/ModuleAccordion';

export default function CoursePage() {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: course, isLoading } = useCourseContent(courseSlug);

  const allLessonIds = useMemo(
    () => course?.modules.flatMap(m => m.lessons.map(l => l.id)) || [],
    [course]
  );

  const { data: progressMap = {} } = useLessonProgress(user?.id, allLessonIds);

  const completedCount = Object.values(progressMap).filter(p => p.status === 'completed').length;
  const progressPercent = allLessonIds.length > 0 ? Math.round((completedCount / allLessonIds.length) * 100) : 0;

  // Find the first incomplete lesson as "current"
  const currentLessonId = useMemo(() => {
    if (!course) return undefined;
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        if (!progressMap[lesson.id] || progressMap[lesson.id].status !== 'completed') {
          return lesson.id;
        }
      }
    }
    return undefined;
  }, [course, progressMap]);

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 space-y-4">
        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Курс не найден</h2>
          <Button onClick={() => navigate('/catalog')}>Перейти в каталог</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] px-6 pt-6 pb-24 -mt-28 lg:mt-0 lg:rounded-2xl relative">
        <div className="max-w-2xl mx-auto pt-28 lg:pt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-white/70 hover:text-white hover:bg-white/10 mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Назад
          </Button>

          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
            {course.title}
          </h1>
          <p className="text-white/80 text-sm mb-5">{course.description}</p>

          {/* Meta */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5 text-white/70 text-xs">
              <Calendar className="w-3.5 h-3.5" />
              8 недель
            </div>
            <div className="flex items-center gap-1.5 text-white/70 text-xs">
              <BookOpen className="w-3.5 h-3.5" />
              {course.totalLessons} уроков
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3">
            <Progress value={progressPercent} className="h-2 flex-1 bg-white/20" />
            <span className="text-white font-bold text-sm">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Module list */}
      <div className="max-w-2xl mx-auto px-4 -mt-16 relative z-10">
        <ModuleAccordion
          modules={course.modules}
          progressMap={progressMap}
          currentLessonId={currentLessonId}
          onLessonClick={(lessonId) => navigate(`/course/${courseSlug}/lesson/${lessonId}`)}
        />
      </div>
    </div>
  );
}
