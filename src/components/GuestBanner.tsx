import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

export const GuestBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-40 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 backdrop-blur-md border-b border-orange-500/20">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-orange-500" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-semibold text-foreground">Гостевой режим</span>
                <span className="text-sm text-muted-foreground">
                  Ваш прогресс сохраняется локально. Зарегистрируйтесь, чтобы не потерять данные!
                </span>
              </div>
            </div>
            <Button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/20"
            >
              Зарегистрироваться
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
