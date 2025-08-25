import React, { createContext, useContext, useEffect, useState } from 'react';
import { SecurityValidator, SecurityMonitor } from '@/lib/security';
import { useSecurityHeaders } from '@/hooks/useSecurityHeaders';

interface SecurityContextType {
  validateInput: (input: string, context?: string) => { isValid: boolean; reason?: string };
  sanitizeInput: (input: string) => string;
  reportSecurityIssue: (type: string, details: Record<string, any>) => void;
  isSecure: boolean;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [isSecure, setIsSecure] = useState(false);
  
  // Apply security headers
  useSecurityHeaders();

  useEffect(() => {
    // Perform security initialization checks
    const initSecurity = async () => {
      try {
        // Check if we're running in a secure context
        const isSecureContext = window.isSecureContext;
        
        // Check for common security indicators
        const hasCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        const hasSecureHeaders = document.querySelector('meta[http-equiv="X-Frame-Options"]');
        
        setIsSecure(Boolean(isSecureContext && hasCSP && hasSecureHeaders));
        
        // Monitor for potential XSS attempts
        const originalConsoleError = console.error;
        console.error = (...args) => {
          const message = args.join(' ');
          if (message.includes('Refused to execute inline script') || 
              message.includes('Content Security Policy')) {
            SecurityMonitor.logSecurityEvent('XSS_ATTEMPT', { message }, 'HIGH');
          }
          originalConsoleError.apply(console, args);
        };
        
        // Monitor for suspicious DOM manipulations
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  const element = node as Element;
                  
                  // Check for suspicious script tags
                  if (element.tagName === 'SCRIPT' && !element.getAttribute('src')) {
                    const content = element.textContent || '';
                    if (SecurityValidator.validateInput(content).isValid === false) {
                      SecurityMonitor.logSecurityEvent('XSS_ATTEMPT', {
                        elementType: 'script',
                        content: content.substring(0, 200)
                      }, 'CRITICAL');
                      element.remove();
                    }
                  }
                  
                  // Check for suspicious attributes
                  Array.from(element.attributes || []).forEach((attr) => {
                    if (attr.name.startsWith('on') || 
                        attr.value.includes('javascript:') || 
                        attr.value.includes('data:text/html')) {
                      SecurityMonitor.logSecurityEvent('XSS_ATTEMPT', {
                        elementType: element.tagName,
                        attribute: attr.name,
                        value: attr.value.substring(0, 200)
                      }, 'HIGH');
                      element.removeAttribute(attr.name);
                    }
                  });
                }
              });
            }
          });
        });
        
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus']
        });
        
        // Cleanup function
        return () => {
          observer.disconnect();
          console.error = originalConsoleError;
        };
      } catch (error) {
        console.error('Security initialization failed:', error);
        setIsSecure(false);
      }
    };

    const cleanup = initSecurity();
    
    return () => {
      if (cleanup instanceof Promise) {
        cleanup.then(fn => fn && fn());
      }
    };
  }, []);

  const validateInput = (input: string, context?: string) => {
    return SecurityValidator.validateInput(input, context);
  };

  const sanitizeInput = (input: string) => {
    return SecurityValidator.sanitizeInput(input);
  };

  const reportSecurityIssue = (type: string, details: Record<string, any>) => {
    SecurityMonitor.logSecurityEvent(type as any, details, 'MEDIUM');
  };

  const contextValue: SecurityContextType = {
    validateInput,
    sanitizeInput,
    reportSecurityIssue,
    isSecure
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};