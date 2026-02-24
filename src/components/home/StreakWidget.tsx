import { Card, CardContent } from '@/components/ui/card';
import { Flame } from 'lucide-react';

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
// Mock: active days (0-indexed, Mon-Sun)
const ACTIVE_DAYS = [0, 1, 3, 4];

const StreakWidget = () => {
  const activeDaysCount = ACTIVE_DAYS.length;

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-[#F97316] to-[#EC4899] text-white">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-white/80">Активность за неделю</p>
            <p className="text-2xl font-bold">{activeDaysCount}/7 дней</p>
          </div>
        </div>
        <div className="flex justify-between">
          {DAYS.map((day, i) => {
            const isActive = ACTIVE_DAYS.includes(i);
            return (
              <div key={day} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white text-[#F97316] shadow-lg'
                      : 'bg-white/20 text-white/60'
                  }`}
                >
                  {day}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakWidget;
