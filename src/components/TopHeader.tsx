import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export const TopHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isBannerCollapsed, setIsBannerCollapsed] = useState(false);

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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 top-header">
      <div className="max-w-md mx-auto px-4 pt-4">
        <div className="glass-header rounded-3xl px-6 py-3 flex items-center justify-between">
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
          <p className="text-xs text-muted-foreground font-medium absolute left-1/2 -translate-x-1/2">
            Здесь лого вашей компании
          </p>
          
          {/* Right: User Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
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
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md z-[70]">
              {user ? (
                <>
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-foreground">
                      {user.user_metadata?.full_name || 'Пользователь'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Выйти
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => navigate('/auth')}>
                    Войти
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/auth')}>
                    Зарегистрироваться
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
