import { ReactNode, useState, useEffect } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { TopHeader } from './TopHeader';
import { GuestBanner } from './GuestBanner';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  const [isBannerCollapsed, setIsBannerCollapsed] = useState(() => {
    return localStorage.getItem('guestBannerCollapsed') === 'true';
  });

  useEffect(() => {
    const checkBannerState = () => {
      setIsBannerCollapsed(localStorage.getItem('guestBannerCollapsed') === 'true');
    };
    window.addEventListener('storage', checkBannerState);
    const interval = setInterval(checkBannerState, 100);
    return () => {
      window.removeEventListener('storage', checkBannerState);
      clearInterval(interval);
    };
  }, []);

  const showBanner = !user && !isBannerCollapsed;
  const mainPadding = showBanner ? 'pt-36' : 'pt-28';

  return (
    <>
      {!user && <GuestBanner />}
      <TopHeader />
      <main className={`pb-28 ${mainPadding} transition-all duration-300`}>
        {children}
      </main>
      <BottomNavigation />
    </>
  );
};
