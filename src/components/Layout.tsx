import { ReactNode } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { TopHeader } from './TopHeader';
import { GuestBanner } from './GuestBanner';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Hide navigation on auth page
  const hideNavigation = location.pathname === '/auth';

  return (
    <>
      {!hideNavigation && !user && <GuestBanner />}
      {!hideNavigation && <TopHeader />}
      <main className={hideNavigation ? '' : 'pb-28 pt-20'}>
        {children}
      </main>
      {!hideNavigation && <BottomNavigation />}
    </>
  );
};
