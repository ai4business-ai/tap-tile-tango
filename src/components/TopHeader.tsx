import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export const TopHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isBannerCollapsed, setIsBannerCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkBannerState = () => {
      const collapsed = localStorage.getItem('guestBannerCollapsed') === 'true';
      setIsBannerCollapsed(collapsed);
    };

    checkBannerState();
    window.addEventListener('storage', checkBannerState);
    const interval = setInterval(checkBannerState, 100);

    return () => {
      window.removeEventListener('storage', checkBannerState);
      clearInterval(interval);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const getInitials = () => {
    if (!user) return 'G';
    if (user.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ');
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user.email?.[0].toUpperCase() || 'G';
  };

  const shouldHighlightAvatar = !user && isBannerCollapsed;
  const showBanner = !user && !isBannerCollapsed;
  const topPosition = showBanner ? 'top-[60px]' : 'top-0';

  return (
    <div className={`fixed ${topPosition} left-0 right-0 z-50 top-header transition-all duration-300`}>
      <div className="max-w-md mx-auto px-4 pt-4">
        <div className="glass-header rounded-3xl px-6">
          {/* Main header row */}
          <div className="flex items-center justify-between py-3">
            {/* Left: hakku.ai branding */}
            <div className="flex flex-col">
              <span className="font-source-serif text-base font-semibold text-deep-purple">
                hakku.ai
              </span>
              <span className="text-[10px] text-muted-foreground">
                AI training app
              </span>
            </div>

            {/* Center: Company Logo Placeholder */}
            <div className="absolute left-1/2 -translate-x-1/2 text-center max-w-[100px]">
              <p className="text-[10px] text-muted-foreground font-medium leading-tight">
                Здесь лого<br/>вашей компании
              </p>
            </div>
            
            {/* Right: User Avatar Button */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className={`w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border border-white/40 hover:bg-white/40 transition-all ${
                shouldHighlightAvatar ? 'ring-2 ring-orange-500 animate-pulse' : ''
              }`}
            >
              {user?.user_metadata?.avatar_url ? (
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.user_metadata.avatar_url} alt="User" />
                  <AvatarFallback className="bg-transparent text-deep-purple text-sm font-semibold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <span className="text-deep-purple text-sm font-semibold">
                  {getInitials()}
                </span>
              )}
            </button>
          </div>

          {/* Expanding menu inside header */}
          {menuOpen && (
            <nav className="py-4 space-y-2 border-t border-white/20">
              {user ? (
                <>
                  <div className="pb-2">
                    <p className="text-sm font-medium text-foreground">
                      {user.user_metadata?.full_name || 'Пользователь'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <button 
                    onClick={() => window.open('https://t.me/your_support', '_blank')}
                    className="block w-full text-left px-2 py-2 text-sm hover:bg-white/10 rounded-lg transition-colors"
                  >
                    Поддержка
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="block w-full text-left px-2 py-2 text-sm hover:bg-white/10 rounded-lg transition-colors"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/auth')}
                    className="block w-full text-left px-2 py-2 text-sm hover:bg-white/10 rounded-lg transition-colors"
                  >
                    Войти
                  </button>
                  <button 
                    onClick={() => navigate('/auth')}
                    className="block w-full text-left px-2 py-2 text-sm hover:bg-white/10 rounded-lg transition-colors"
                  >
                    Зарегистрироваться
                  </button>
                  <button 
                    onClick={() => window.open('https://t.me/your_support', '_blank')}
                    className="block w-full text-left px-2 py-2 text-sm hover:bg-white/10 rounded-lg transition-colors"
                  >
                    Поддержка
                  </button>
                </>
              )}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};
