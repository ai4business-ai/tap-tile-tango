import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LessonNavBarProps {
  currentIndex: number;
  totalLessons: number;
  onBack: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function LessonNavBar({ currentIndex, totalLessons, onBack, onPrev, onNext, hasPrev, hasNext }: LessonNavBarProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground">
        <ChevronLeft className="w-4 h-4 mr-1" />
        К курсу
      </Button>

      <span className="text-xs text-muted-foreground">
        Урок {currentIndex + 1} из {totalLessons}
      </span>

      <div className="flex gap-1">
        <Button variant="ghost" size="icon" onClick={onPrev} disabled={!hasPrev} className="h-8 w-8">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onNext} disabled={!hasNext} className="h-8 w-8">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
