import { useState } from 'react';
import { Brain, MessageSquare, CheckCircle2, Settings2, ShieldCheck, GraduationCap } from 'lucide-react';
import { coreSkills } from '@/data/competencyMap';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const skillIcons = [MessageSquare, CheckCircle2, Settings2, ShieldCheck, GraduationCap];

export const CoreSkillsCard = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-secondary/90 to-secondary/70 p-6 shadow-xl text-secondary-foreground">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Базовое ядро</h3>
          <p className="text-sm opacity-80">Обязательный фундамент для всех</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {coreSkills.map((skill, idx) => {
          const Icon = skillIcons[idx];
          const isExpanded = expandedId === skill.id;

          return (
            <div key={skill.id} className="w-full">
              <button
                onClick={() => setExpandedId(isExpanded ? null : skill.id)}
                className={cn(
                  "flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 rounded-xl transition-all",
                  isExpanded
                    ? "bg-white/20 shadow-inner"
                    : "bg-white/10 hover:bg-white/15"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0 opacity-80" />
                <span className="text-sm font-medium">{skill.name}</span>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pt-2 pb-3 space-y-3">
                      <p className="text-sm opacity-80">{skill.description}</p>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1.5">Что нужно уметь</p>
                        <ul className="space-y-1">
                          {skill.whatToLearn.map((item, i) => (
                            <li key={i} className="text-sm opacity-80 flex items-start gap-1.5">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1.5">Почему критично</p>
                        <ul className="space-y-1">
                          {skill.whyCritical.map((item, i) => (
                            <li key={i} className="text-xs opacity-70 italic">{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
