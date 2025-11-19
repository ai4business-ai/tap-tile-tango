import { ReactNode } from 'react';
import { BottomNavigation } from './BottomNavigation';
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
      <main className={hideNavigation ? '' : 'pb-28'}>
        {children}
      </main>
      {!hideNavigation && <BottomNavigation />}
    </>
  );
};
