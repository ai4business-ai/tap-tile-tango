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

  return null;
};
