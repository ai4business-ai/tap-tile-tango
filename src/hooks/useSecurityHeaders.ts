import { useEffect } from 'react';

/**
 * Hook to apply security headers and CSP to the document
 */
export const useSecurityHeaders = () => {
  useEffect(() => {
    // Apply Content Security Policy meta tag if not already present
    const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!existingCSP) {
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://esm.sh https://cdn.jsdelivr.net",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: https:",
        "font-src 'self' data: https://fonts.gstatic.com",
        "connect-src 'self' https://nhxrajtfxavkkzqyfrok.supabase.co https://api.openai.com wss://nhxrajtfxavkkzqyfrok.supabase.co",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; ');
      document.head.appendChild(cspMeta);
    }

    // Apply additional security meta tags
    const securityTags = [
      { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
      { httpEquiv: 'X-XSS-Protection', content: '1; mode=block' },
      { httpEquiv: 'Permissions-Policy', content: 'geolocation=(), microphone=(), camera=()' }
    ];

    securityTags.forEach(tag => {
      const identifier = tag.name || tag.httpEquiv;
      const existing = document.querySelector(`meta[name="${identifier}"], meta[http-equiv="${identifier}"]`);
      if (!existing) {
        const meta = document.createElement('meta');
        if (tag.name) meta.name = tag.name;
        if (tag.httpEquiv) meta.httpEquiv = tag.httpEquiv;
        meta.content = tag.content;
        document.head.appendChild(meta);
      }
    });

    // Remove any potentially dangerous inline scripts
    const inlineScripts = document.querySelectorAll('script:not([src])');
    inlineScripts.forEach(script => {
      const content = script.textContent || '';
      if (content.includes('eval(') || content.includes('Function(') || content.includes('setTimeout(')) {
        console.warn('[SECURITY] Removing potentially dangerous inline script');
        script.remove();
      }
    });
  }, []);
};