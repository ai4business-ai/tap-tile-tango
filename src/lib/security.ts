// Enhanced security utilities
export class SecurityValidator {
  private static readonly DANGEROUS_PATTERNS = [
    // Enhanced prompt injection patterns
    /ignore\s+previous\s+instructions?/i,
    /act\s+as\s+(?:a\s+)?(?:different|new|another)/i,
    /system\s*:\s*/i,
    /assistant\s*:\s*/i,
    /pretend\s+to\s+be/i,
    /jailbreak/i,
    /DAN\s+mode/i,
    /override\s+your\s+instructions/i,
    /forget\s+your\s+role/i,
    /ignore\s+your\s+guidelines/i,
    /tell\s+me\s+your\s+prompt/i,
    /what\s+are\s+your\s+instructions/i,
    /show\s+me\s+your\s+system\s+prompt/i,
    /bypass\s+your\s+restrictions/i,
    /you\s+are\s+now\s+(?:a|an)/i,
    /from\s+now\s+on\s+you\s+are/i,
    // Advanced injection techniques
    /<!--[\s\S]*?-->/,
    /<script[\s\S]*?>[\s\S]*?<\/script>/i,
    /javascript\s*:/i,
    /data\s*:\s*text\/html/i,
    /vbscript\s*:/i,
    /on\w+\s*=/i,
    /expression\s*\(/i,
    // SQL injection patterns
    /union\s+select/i,
    /drop\s+table/i,
    /delete\s+from/i,
    /insert\s+into/i,
    /update\s+set/i,
    // Command injection
    /\|\s*(?:ls|cat|curl|wget|nc|netcat)/i,
    /;\s*(?:rm|mv|cp|chmod)/i,
    /`[^`]*`/,
    /\$\([^)]*\)/,
  ];

  private static readonly SUSPICIOUS_URLS = [
    /^https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/i,
    /^ftp:\/\//i,
    /^file:\/\//i,
    /^ssh:\/\//i,
    /^sftp:\/\//i,
  ];

  private static readonly MAX_INPUT_LENGTH = 10000;
  private static readonly MAX_URL_LENGTH = 2048;

  /**
   * Comprehensive input validation
   */
  static validateInput(input: string, context?: string): { isValid: boolean; reason?: string } {
    if (!input) {
      return { isValid: false, reason: 'Input cannot be empty' };
    }

    if (input.length > this.MAX_INPUT_LENGTH) {
      return { isValid: false, reason: `Input too long (max ${this.MAX_INPUT_LENGTH} characters)` };
    }

    // Check for dangerous patterns
    for (const pattern of this.DANGEROUS_PATTERNS) {
      if (pattern.test(input)) {
        return { isValid: false, reason: 'Input contains potentially harmful content' };
      }
    }

    // Check for excessive special characters (possible encoding attacks)
    const specialCharCount = (input.match(/[^\w\s\p{L}\p{N}\p{P}\p{M}]/gu) || []).length;
    if (specialCharCount > input.length * 0.1) {
      return { isValid: false, reason: 'Input contains too many special characters' };
    }

    // Context-specific validation
    if (context === 'url') {
      return this.validateUrl(input);
    }

    return { isValid: true };
  }

  /**
   * URL validation with SSRF protection
   */
  static validateUrl(url: string): { isValid: boolean; reason?: string } {
    if (url.length > this.MAX_URL_LENGTH) {
      return { isValid: false, reason: 'URL too long' };
    }

    try {
      const urlObj = new URL(url);
      
      // Check for suspicious protocols and internal networks
      for (const pattern of this.SUSPICIOUS_URLS) {
        if (pattern.test(url)) {
          return { isValid: false, reason: 'URL not allowed' };
        }
      }

      // Only allow HTTP/HTTPS
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { isValid: false, reason: 'Only HTTP/HTTPS URLs are allowed' };
      }

      return { isValid: true };
    } catch {
      return { isValid: false, reason: 'Invalid URL format' };
    }
  }

  /**
   * Sanitize HTML content to prevent XSS
   */
  static sanitizeHtml(html: string): string {
    return html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
      .replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, '')
      .replace(/<embed[\s\S]*?>[\s\S]*?<\/embed>/gi, '')
      .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
      .replace(/on\w+\s*=\s*'[^']*'/gi, '')
      .replace(/javascript\s*:/gi, '')
      .replace(/vbscript\s*:/gi, '')
      .replace(/data\s*:\s*text\/html/gi, '');
  }

  /**
   * Sanitize user input
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
      .trim()
      .substring(0, this.MAX_INPUT_LENGTH);
  }

  /**
   * Generate Content Security Policy headers
   */
  static getCSPHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://esm.sh https://cdn.jsdelivr.net",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self' https://nhxrajtfxavkkzqyfrok.supabase.co https://api.openai.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; '),
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };
  }

  /**
   * Rate limiting utility
   */
  static createRateLimiter(maxRequests: number, windowMs: number) {
    const requests = new Map<string, { count: number; resetTime: number }>();

    return {
      check(identifier: string): { allowed: boolean; resetTime?: number; remaining: number } {
        const now = Date.now();
        const record = requests.get(identifier);

        if (!record || now > record.resetTime) {
          requests.set(identifier, { count: 1, resetTime: now + windowMs });
          return { allowed: true, remaining: maxRequests - 1 };
        }

        if (record.count >= maxRequests) {
          return { allowed: false, resetTime: record.resetTime, remaining: 0 };
        }

        record.count++;
        return { allowed: true, remaining: maxRequests - record.count };
      },

      reset(identifier: string) {
        requests.delete(identifier);
      }
    };
  }

  /**
   * CSRF token generation and validation
   */
  static generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static validateCSRFToken(token: string, expectedToken: string): boolean {
    if (!token || !expectedToken) return false;
    return token === expectedToken;
  }
}

/**
 * Security monitoring and logging
 */
export class SecurityMonitor {
  private static readonly LOG_URL = '/api/security-log';

  static async logSecurityEvent(
    eventType: 'PROMPT_INJECTION' | 'XSS_ATTEMPT' | 'SSRF_ATTEMPT' | 'RATE_LIMIT_EXCEEDED' | 'INVALID_AUTH' | 'SUSPICIOUS_ACTIVITY',
    details: Record<string, any>,
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM'
  ) {
    try {
      const event = {
        type: eventType,
        severity,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
        url: typeof window !== 'undefined' ? window.location.href : 'server',
        details: this.sanitizeLogDetails(details)
      };

      console.warn(`[SECURITY] ${eventType}:`, event);
      
      // In production, send to logging service
      if (typeof fetch !== 'undefined') {
        fetch(this.LOG_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event)
        }).catch(() => {
          // Silently fail logging to avoid cascading errors
        });
      }
    } catch (error) {
      console.error('Security logging failed:', error);
    }
  }

  private static sanitizeLogDetails(details: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(details)) {
      if (typeof value === 'string') {
        // Truncate long strings and remove sensitive patterns
        sanitized[key] = value
          .substring(0, 1000)
          .replace(/[^\x20-\x7E]/g, '?'); // Replace non-printable chars
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = '[OBJECT]';
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
}