import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  TrendingUp,
  ClipboardList,
  PlayCircle,
  BookOpen,
  User
} from 'lucide-react';
import { ExpandableTabs } from '@/components/ui/expandable-tabs';
import { useNextAssignment } from '@/hooks/useNextAssignment';
import { useAuth } from '@/hooks/useAuth';

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getNextTaskPath } = useNextAssignment();
  const { user } = useAuth();
  const [selected, setSelected] = useState<number | null>(null);

  const tabs = [
    { title: "Прогресс", icon: TrendingUp, path: "/my-progress" },
    { title: "Задания", icon: ClipboardList, path: "/tasks" },
    { title: "Промпты", icon: BookOpen, path: "/prompts" },
    { title: "Следующее", icon: PlayCircle, path: "next" },
    { title: "Профиль", icon: User, path: user ? "/my-progress" : "/auth" },
  ];

  useEffect(() => {
    // Determine active tab based on current path
    const currentPath = location.pathname;
    const index = tabs.findIndex(tab => 
      tab.path !== "next" && currentPath === tab.path
    );
    setSelected(index !== -1 ? index : null);
  }, [location.pathname]);

  const handleChange = (index: number | null) => {
    if (index !== null) {
      setSelected(index);
      
      if (tabs[index].path === "next") {
        // Handle "Next Assignment" action
        const nextPath = getNextTaskPath();
        navigate(nextPath);
      } else {
        navigate(tabs[index].path);
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bottom-navigation pb-4 px-4">
      <div className="max-w-2xl mx-auto">
        <ExpandableTabs
          tabs={tabs}
          onChange={handleChange}
          activeColor="text-primary-orange"
          className="glass-card border-white/60 shadow-2xl"
        />
      </div>
    </div>
  );
};
