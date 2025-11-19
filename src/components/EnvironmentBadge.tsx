import { getCurrentEnvironment, getEnvironmentLabel } from '@/lib/environment';

export const EnvironmentBadge = () => {
  const env = getCurrentEnvironment();
  
  // Don't show badge on production
  if (env === 'prod') return null;
  
  return (
    <div className="fixed top-2 right-2 z-50">
      <div className="bg-amber-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
        🚧 {getEnvironmentLabel()}
      </div>
    </div>
  );
};
