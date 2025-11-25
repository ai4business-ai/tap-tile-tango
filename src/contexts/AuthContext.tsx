import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, setUserEnvironment } from '@/integrations/supabase/client';
import { getCurrentEnvironment } from '@/lib/environment';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Initialize user_skills for new users
        if (session?.user && event === 'SIGNED_IN') {
          await initializeUserSkills(session.user.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const initializeUserSkills = async (userId: string) => {
    try {
      const currentEnvironment = getCurrentEnvironment();
      
      // Call setUserEnvironment in background, don't block main logic
      setUserEnvironment(userId).catch(err => {
        console.warn('Non-critical: Failed to set user environment:', err);
      });
      
      // Check if user_skills already exist for this environment
      const { data } = await supabase
        .from('user_skills')
        .select('id')
        .eq('user_id', userId)
        .eq('environment', currentEnvironment)
        .limit(1);
      
      if (!data || data.length === 0) {
        await supabase.rpc('initialize_user_skills', {
          p_user_id: userId,
          p_environment: currentEnvironment
        });
      }
    } catch (error) {
      console.error('Error initializing user skills:', error);
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });
    return { error };
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
