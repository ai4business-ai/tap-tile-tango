import { trajectories, directions } from '@/data/competencyMap';
import { cn } from '@/lib/utils';

interface TrajectorySectionProps {
  activeTrajectory: string | null;
  onSelect: (id: string | null) => void;
}

export const TrajectorySection = ({ activeTrajectory, onSelect }: TrajectorySectionProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-foreground">Траектории развития</h3>
      <p className="text-sm text-muted-foreground">Выберите профиль, чтобы увидеть рекомендованные направления</p>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
        {trajectories.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(activeTrajectory === t.id ? null : t.id)}
            className={cn(
              "rounded-xl p-3 text-left border transition-all",
              activeTrajectory === t.id
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border/50 bg-card hover:border-primary/30"
            )}
          >
            <span className="text-xl">{t.emoji}</span>
            <h4 className="font-semibold text-sm text-foreground mt-1">{t.name}</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{t.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {t.directions.map((d) => {
                const dir = directions.find(dd => dd.id === d.directionId);
                if (!dir) return null;
                return (
                  <span key={d.directionId} className={cn("text-[10px] px-1.5 py-0.5 rounded-full", dir.color, dir.colorAccent)}>
                    #{dir.id} L{d.maxLevel}
                  </span>
                );
              })}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
