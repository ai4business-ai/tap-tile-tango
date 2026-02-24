import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ClipboardList, TrendingUp, BookOpen, PlayCircle, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNextAssignment } from '@/hooks/useNextAssignment';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navItems = [
  { title: 'Главная', icon: Home, path: '/' },
  { title: 'Задания', icon: ClipboardList, path: '/tasks' },
  { title: 'Прогресс', icon: TrendingUp, path: '/my-progress' },
  { title: 'Теория', icon: BookOpen, path: '/webinar-records' },
];

export const DesktopSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { getNextTaskPath } = useNextAssignment();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const getInitials = () => {
    if (!user) return 'G';
    if (user.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ');
      return names.map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user.email?.[0].toUpperCase() || 'G';
  };

  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen fixed left-0 top-0 z-40 glass-strong border-r border-border/50 py-6 px-4">
      {/* Logo */}
      <div className="mb-8 px-2">
        <span className="text-lg font-semibold text-deep-purple">hakku.ai</span>
        <p className="text-[10px] text-muted-foreground">AI training app</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary-orange border border-primary/20'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.title}
            </button>
          );
        })}

        {/* Next Assignment Button */}
        <button
          onClick={async () => {
            const nextPath = await getNextTaskPath();
            navigate(nextPath);
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-primary-orange to-sky-blue text-white mt-4 shadow-md hover:shadow-lg transition-all"
        >
          <PlayCircle className="w-5 h-5" />
          Следующее задание
        </button>
      </nav>

      {/* User Block */}
      <div className="mt-auto pt-4 border-t border-border/50">
        {user ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-2">
              <Avatar className="h-9 w-9">
                {user.user_metadata?.avatar_url && (
                  <AvatarImage src={user.user_metadata.avatar_url} alt="User" />
                )}
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/auth')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all"
          >
            <LogIn className="w-4 h-4" />
            Войти
          </button>
        )}
      </div>
    </aside>
  );
};
