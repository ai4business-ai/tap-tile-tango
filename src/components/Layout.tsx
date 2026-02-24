import { ReactNode, useState, useEffect } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { TopHeader } from './TopHeader';
import { GuestBanner } from './GuestBanner';
import { DesktopSidebar } from './DesktopSidebar';
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
  const mainPadding = showBanner ? 'pt-40' : 'pt-32';

  return (
    <>
      {/* Desktop sidebar */}
      <DesktopSidebar />

      {/* Mobile-only elements */}
      <div className="lg:hidden">
        {!user && <GuestBanner />}
        <TopHeader />
      </div>

      <main className={`pb-28 lg:pb-8 ${mainPadding} lg:pt-8 transition-all duration-300 lg:ml-60`}>
        <div className="max-w-md lg:max-w-5xl mx-auto px-4 lg:px-8">
          {children}
        </div>
      </main>

      {/* Mobile-only bottom nav */}
      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </>
  );
};
