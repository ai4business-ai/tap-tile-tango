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

export const TopHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 top-header">
      <div className="max-w-md mx-auto px-4 pt-4">
        <div className="glass-header rounded-3xl px-6 py-3 flex items-center justify-between">
          {/* Company Logo Placeholder */}
          <p className="text-xs text-muted-foreground font-medium">
            Здесь лого вашей компании
          </p>
          
          {/* User Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border border-white/40 hover:bg-white/40 transition-colors">
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
            <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md">
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
