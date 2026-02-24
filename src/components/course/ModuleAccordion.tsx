import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, Circle } from 'lucide-react';
import LessonCard from './LessonCard';
import type { CourseModule } from '@/hooks/useCourseContent';
import type { LessonProgress } from '@/hooks/useLessonProgress';

interface ModuleAccordionProps {
  modules: CourseModule[];
  progressMap: Record<string, LessonProgress>;
  currentLessonId?: string;
  onLessonClick: (lessonId: string) => void;
}

export default function ModuleAccordion({ modules, progressMap, currentLessonId, onLessonClick }: ModuleAccordionProps) {
  // Find module with current lesson to default-open it
  const defaultModule = modules.find(m =>
    m.lessons.some(l => l.id === currentLessonId)
  ) || modules.find(m =>
    m.lessons.some(l => !progressMap[l.id] || progressMap[l.id].status !== 'completed')
  ) || modules[0];

  const getModuleProgress = (mod: CourseModule) => {
    const completed = mod.lessons.filter(l => progressMap[l.id]?.status === 'completed').length;
    return { completed, total: mod.lessons.length };
  };

  return (
    <Accordion type="single" collapsible defaultValue={defaultModule?.id} className="space-y-3">
      {modules.map((mod, idx) => {
        const { completed, total } = getModuleProgress(mod);
        const isModuleComplete = completed === total && total > 0;

        return (
          <AccordionItem
            key={mod.id}
            value={mod.id}
            className="border border-border/40 rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm px-2"
          >
            <AccordionTrigger className="hover:no-underline px-2 py-3">
              <div className="flex items-center gap-3 text-left flex-1 min-w-0">
                {isModuleComplete ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-primary-orange/50 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-primary-orange">{idx}</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{mod.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {completed}/{total} уроков
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-1 pb-3">
              <div className="space-y-1">
                {mod.lessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    progress={progressMap[lesson.id]}
                    isCurrent={lesson.id === currentLessonId}
                    onClick={() => onLessonClick(lesson.id)}
                  />
                ))}
              </div>
              {mod.description && (
                <p className="text-xs text-muted-foreground mt-3 px-4 italic">{mod.description}</p>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
