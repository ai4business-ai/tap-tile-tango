import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const GuestBanner = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('guestBannerCollapsed') === 'true';
  });

  const handleCollapse = () => {
    setIsCollapsed(true);
    localStorage.setItem('guestBannerCollapsed', 'true');
  };

  const handleExpand = () => {
    setIsCollapsed(false);
    localStorage.setItem('guestBannerCollapsed', 'false');
  };

  return (
    <div className="sticky top-0 z-40">
      <AnimatePresence mode="wait">
        {isCollapsed ? (
          <motion.div
            key="collapsed"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div 
              onClick={handleExpand}
              className="h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 cursor-pointer hover:h-1.5 transition-all"
              title="Нажмите, чтобы развернуть"
            />
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 backdrop-blur-md border-b border-orange-500/20">
              <div className="max-w-2xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3 flex-1">
                    <Lock className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-semibold text-foreground">Гостевой режим</span>
                      <span className="text-sm text-muted-foreground">
                        Ваш прогресс сохраняется локально. Зарегистрируйтесь, чтобы не потерять данные!
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => navigate('/auth')}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/20"
                    >
                      Зарегистрироваться
                    </Button>
                    <button
                      onClick={handleCollapse}
                      className="p-2 hover:bg-orange-500/10 rounded-xl transition-colors"
                      title="Свернуть баннер"
                    >
                      <X className="w-5 h-5 text-orange-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
