import { ReactNode } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { TopHeader } from './TopHeader';
import { GuestBanner } from './GuestBanner';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();

  return (
    <>
      {!user && <GuestBanner />}
      <TopHeader />
      <main className="pb-28 pt-28">
        {children}
      </main>
      <BottomNavigation />
    </>
  );
};
