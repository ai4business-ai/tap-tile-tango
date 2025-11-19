import { useAuth } from '@/hooks/useAuth';
import { useProgressSync } from '@/hooks/useProgressSync';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { isSyncing } = useProgressSync(user?.id);
  const navigate = useNavigate();

  const getInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  if (!user) {
    return (
      <Button
        onClick={() => navigate('/auth')}
        variant="default"
        size="sm"
        className="gap-2"
      >
        <LogIn className="w-4 h-4" />
        Войти
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {isSyncing && (
        <span className="text-xs text-muted-foreground animate-pulse">Синхронизация...</span>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-12 w-12 rounded-full">
            <Avatar className="h-12 w-12 border-2 border-primary-orange/30">
              <AvatarImage src={user.user_metadata?.avatar_url} alt="User avatar" />
              <AvatarFallback className="bg-gradient-to-br from-primary-orange to-sky-blue text-white font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 glass-card border-white/60" align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold leading-none text-deep-purple">
                {user.user_metadata?.full_name || 'Пользователь'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Выйти</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
