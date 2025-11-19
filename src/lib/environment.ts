export type Environment = 'dev' | 'prod';

export function getCurrentEnvironment(): Environment {
  const hostname = window.location.hostname;
  
  if (hostname === 'aitraining.haiku.dev') {
    return 'prod';
  }
  
  // preview--ai-training-beeline.lovable.app или localhost
  return 'dev';
}

export function getEnvironmentLabel(): string {
  return getCurrentEnvironment() === 'prod' ? 'Production' : 'Development';
}

// Для логирования и дебага
export function logEnvironment() {
  console.log(`[Environment] Current: ${getCurrentEnvironment()} (${window.location.hostname})`);
}
