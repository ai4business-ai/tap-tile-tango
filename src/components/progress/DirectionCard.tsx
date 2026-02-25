import { useState } from 'react';
import type { Direction } from '@/data/competencyMap';
import { cn } from '@/lib/utils';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';

interface DirectionCardProps {
  direction: Direction;
  highlighted?: boolean;
}

export const DirectionCard = ({ direction, highlighted = false }: DirectionCardProps) => {
  const [open, setOpen] = useState(false);
  const Icon = direction.icon;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "w-full text-left rounded-2xl p-4 border transition-all hover:shadow-lg",
          highlighted
            ? "border-primary shadow-md ring-2 ring-primary/20"
            : "border-border/50 bg-card shadow-sm hover:border-primary/30"
        )}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", direction.color)}>
            <Icon className={cn("w-5 h-5", direction.colorAccent)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">#{direction.id}</span>
              <h4 className="font-semibold text-sm text-foreground truncate">{direction.name}</h4>
            </div>
            <p className="text-xs text-muted-foreground truncate">{direction.subtitle}</p>
          </div>
        </div>

        {/* Level steps */}
        <div className="space-y-1.5">
          {direction.levels.map((level) => (
            <div key={level.level} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-muted flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-muted-foreground">{level.level}</span>
              </div>
              <span className="text-xs text-muted-foreground truncate">{level.title}</span>
            </div>
          ))}
        </div>
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="overflow-y-auto bg-background">
          <SheetHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", direction.color)}>
                <Icon className={cn("w-6 h-6", direction.colorAccent)} />
              </div>
              <div>
                <SheetTitle className="text-foreground">{direction.name}</SheetTitle>
                <SheetDescription>{direction.subtitle}</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-6 mt-2">
            {direction.levels.map((level) => (
              <div key={level.level} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs",
                    direction.color, direction.colorAccent
                  )}>
                    L{level.level}
                  </div>
                  <h4 className="font-semibold text-foreground">{level.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{level.description}</p>
                <ul className="space-y-1 pl-1">
                  {level.skills.map((skill, i) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                      {skill}
                    </li>
                  ))}
                </ul>
                {level.source && (
                  <p className="text-xs text-muted-foreground italic pl-1">📊 {level.source}</p>
                )}
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
