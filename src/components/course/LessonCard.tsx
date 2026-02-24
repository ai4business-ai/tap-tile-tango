import { CheckCircle2, Circle, PlayCircle, Clock, Wrench, BookOpen, Video, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { CourseLesson } from '@/hooks/useCourseContent';
import type { LessonProgress } from '@/hooks/useLessonProgress';

interface LessonCardProps {
  lesson: CourseLesson;
  progress?: LessonProgress;
  isCurrent: boolean;
  onClick: () => void;
}

const lessonTypeConfig: Record<string, { label: string; icon: React.ReactNode; variant: 'default' | 'secondary' | 'accent' | 'outline' }> = {
  theory: { label: 'Теория', icon: <BookOpen className="w-3 h-3" />, variant: 'secondary' },
  practice: { label: 'Практика', icon: <Wrench className="w-3 h-3" />, variant: 'default' },
  video: { label: 'Видео', icon: <Video className="w-3 h-3" />, variant: 'accent' },
  quiz: { label: 'Квиз', icon: <HelpCircle className="w-3 h-3" />, variant: 'outline' },
  trainer_task: { label: 'Тренажер', icon: <Wrench className="w-3 h-3" />, variant: 'default' },
};

export default function LessonCard({ lesson, progress, isCurrent, onClick }: LessonCardProps) {
  const status = progress?.status || 'not_started';
  const config = lessonTypeConfig[lesson.lesson_type] || lessonTypeConfig.theory;
  const duration = (lesson.content_json as any)?.duration;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200 ${
        isCurrent
          ? 'bg-primary-orange/10 border border-primary-orange/30'
          : status === 'completed'
          ? 'bg-muted/30 hover:bg-muted/50'
          : 'hover:bg-muted/30'
      }`}
    >
      {/* Status icon */}
      <div className="flex-shrink-0">
        {status === 'completed' ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        ) : isCurrent ? (
          <PlayCircle className="w-5 h-5 text-primary-orange" />
        ) : (
          <Circle className="w-5 h-5 text-muted-foreground/40" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${
          status === 'completed' ? 'text-muted-foreground' : 'text-foreground'
        }`}>
          {lesson.title}
        </p>
        {duration && (
          <div className="flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3 text-muted-foreground/60" />
            <span className="text-xs text-muted-foreground/60">{duration}</span>
          </div>
        )}
      </div>

      {/* Type badge */}
      <Badge variant={config.variant} className="flex-shrink-0 gap-1 text-[10px] px-2 py-0.5">
        {config.icon}
        {config.label}
      </Badge>
    </button>
  );
}
