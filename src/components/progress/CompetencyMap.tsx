import { useState } from 'react';
import { directions, trajectories } from '@/data/competencyMap';
import { CoreSkillsCard } from './CoreSkillsCard';
import { DirectionCard } from './DirectionCard';
import { TrajectorySection } from './TrajectorySection';

export const CompetencyMap = () => {
  const [activeTrajectory, setActiveTrajectory] = useState<string | null>(null);

  const highlightedDirections = activeTrajectory
    ? trajectories.find(t => t.id === activeTrajectory)?.directions.map(d => d.directionId) ?? []
    : [];

  return (
    <div className="space-y-6">
      {/* Core Skills */}
      <CoreSkillsCard />

      {/* 9 Directions */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-3">9 направлений развития</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {directions.map((dir) => (
            <DirectionCard
              key={dir.id}
              direction={dir}
              highlighted={highlightedDirections.includes(dir.id)}
            />
          ))}
        </div>
      </div>

      {/* Trajectories */}
      <TrajectorySection activeTrajectory={activeTrajectory} onSelect={setActiveTrajectory} />

      {/* Footer stats */}
      <div className="rounded-2xl bg-muted/50 p-4 text-center">
        <p className="text-xs text-muted-foreground">
          На основе 7 глобальных исследований 2025-2026 • 15,000+ респондентов • 1M+ корпоративных клиентов
        </p>
      </div>
    </div>
  );
};
