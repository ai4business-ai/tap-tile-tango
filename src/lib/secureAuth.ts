import { supabase } from '@/integrations/supabase/client';
import { SecurityMonitor } from './security';

/**
 * Enhanced authentication utilities with security monitoring
 */
export class SecureAuth {
  /**
   * Clean up all authentication state
   */
  static cleanupAuthState(): void {
    try {
      // Remove standard auth tokens
      localStorage.removeItem('supabase.auth.token');
      
      // Remove all Supabase auth keys from localStorage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Remove from sessionStorage if in use
      if (typeof sessionStorage !== 'undefined') {
        Object.keys(sessionStorage).forEach((key) => {
          if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
            sessionStorage.removeItem(key);
          }
        });
      }
      
      console.log('[AUTH] Authentication state cleaned up');
    } catch (error) {
      console.error('[AUTH] Failed to cleanup auth state:', error);
      SecurityMonitor.logSecurityEvent('INVALID_AUTH', { 
        error: 'Failed to cleanup auth state',
        details: error 
      }, 'LOW');
    }
  }

  /**
   * Secure sign in with cleanup
   */
  static async signIn(email: string, password: string): Promise<{ error?: string }> {
    try {
      // Clean up existing state first
      this.cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.warn('[AUTH] Global signout failed, continuing:', err);
      }
      
      // Sign in with email/password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        SecurityMonitor.logSecurityEvent('INVALID_AUTH', {
          error: error.message,
          email: email.substring(0, 3) + '***' // Partially mask email
        }, 'MEDIUM');
        return { error: error.message };
      }
      
      if (data.user) {
        SecurityMonitor.logSecurityEvent('INVALID_AUTH', {
          success: true,
          userId: data.user.id
        }, 'LOW');
        
        // Force page reload for clean state
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      }
      
      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      SecurityMonitor.logSecurityEvent('INVALID_AUTH', {
        error: errorMessage,
        email: email.substring(0, 3) + '***'
      }, 'HIGH');
      return { error: errorMessage };
    }
  }

  /**
   * Secure sign out with cleanup
   */
  static async signOut(): Promise<void> {
    try {
      // Clean up auth state first
      this.cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.warn('[AUTH] Global signout failed:', err);
      }
      
      // Force page reload for clean state
      window.location.href = '/auth';
    } catch (error) {
      console.error('[AUTH] Signout failed:', error);
      SecurityMonitor.logSecurityEvent('INVALID_AUTH', {
        error: 'Signout failed',
        details: error
      }, 'MEDIUM');
      
      // Force redirect even if signout fails
      window.location.href = '/auth';
    }
  }

  /**
   * Sign up with enhanced security
   */
  static async signUp(email: string, password: string): Promise<{ error?: string }> {
    try {
      // Clean up existing state first
      this.cleanupAuthState();
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      if (error) {
        SecurityMonitor.logSecurityEvent('INVALID_AUTH', {
          error: error.message,
          email: email.substring(0, 3) + '***',
          action: 'signup'
        }, 'MEDIUM');
        return { error: error.message };
      }
      
      SecurityMonitor.logSecurityEvent('INVALID_AUTH', {
        success: true,
        action: 'signup',
        email: email.substring(0, 3) + '***'
      }, 'LOW');
      
      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      SecurityMonitor.logSecurityEvent('INVALID_AUTH', {
        error: errorMessage,
        email: email.substring(0, 3) + '***',
        action: 'signup'
      }, 'HIGH');
      return { error: errorMessage };
    }
  }

  /**
   * Validate session integrity
   */
  static async validateSession(): Promise<{ valid: boolean; user?: any }> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        SecurityMonitor.logSecurityEvent('INVALID_AUTH', {
          error: error.message,
          action: 'validate_session'
        }, 'MEDIUM');
        return { valid: false };
      }
      
      if (!session) {
        return { valid: false };
      }
      
      // Check if session is expired or will expire soon
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = session.expires_at || 0;
      
      if (expiresAt <= now + 300) { // Expires in 5 minutes or less
        SecurityMonitor.logSecurityEvent('INVALID_AUTH', {
          warning: 'Session expiring soon',
          expiresAt,
          now
        }, 'LOW');
        
        // Attempt to refresh
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          return { valid: false };
        }
      }
      
      return { valid: true, user: session.user };
    } catch (error) {
      SecurityMonitor.logSecurityEvent('INVALID_AUTH', {
        error: 'Session validation failed',
        details: error
      }, 'HIGH');
      return { valid: false };
    }
  }
}