import { ReactNode } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { TopHeader } from './TopHeader';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  // Hide navigation on auth page
  const hideNavigation = location.pathname === '/auth';

  return (
    <>
      {!hideNavigation && <TopHeader />}
      <main className={hideNavigation ? '' : 'pb-28 pt-20'}>
        {children}
      </main>
      {!hideNavigation && <BottomNavigation />}
    </>
  );
};
