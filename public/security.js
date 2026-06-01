// ==========================================
// HeaNg[Black-Cyber] - Advanced Security System
// ==========================================

(function() {
  'use strict';

  const SecuritySystem = {
    // ==================== Configuration ====================
    config: {
      enableF12Protection: true,
      enableInspectProtection: true,
      enableContextMenuProtection: true,
      enableSourceMapProtection: true,
      enableDebuggerProtection: true,
      maxRequestsPerMinute: 20,
      maxMessagesPerHour: 100,
      spamDetectionEnabled: true,
      enableUserAgentValidation: true,
      enableXSSProtection: true,
      enableCSRFProtection: true,
    },

    // ==================== Initialization ====================
    init: function() {
      console.log('%c🛡️ HeaNg Security System Initialized', 'color: #00ff00; font-weight: bold; font-size: 14px;');
      
      this.blockDeveloperTools();
      this.blockContextMenu();
      this.preventSourceMapExposure();
      this.implementSpamProtection();
      this.implementInputValidation();
      this.implementXSSProtection();
      this.implementCSRFProtection();
      this.setupSecurityHeaders();
      this.monitorSuspiciousActivity();
      this.disableDangerousMethods();
      this.protectConsole();
      this.setupSecurityListeners();
    },

    // ==================== F12 & Developer Tools Protection ====================
    blockDeveloperTools: function() {
      // Block F12 key
      document.addEventListener('keydown', (e) => {
        // F12
        if (e.keyCode === 123 || e.key === 'F12') {
          e.preventDefault();
          e.stopPropagation();
          this.triggerSecurityAlert('Attempt to open Developer Tools blocked');
          return false;
        }

        // Ctrl+Shift+I (Inspect Element)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 73) {
          e.preventDefault();
          e.stopPropagation();
          this.triggerSecurityAlert('Inspect Element blocked');
          return false;
        }

        // Ctrl+Shift+C (Inspect Element - alternate)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 67) {
          e.preventDefault();
          e.stopPropagation();
          this.triggerSecurityAlert('Inspect Element blocked');
          return false;
        }

        // Ctrl+Shift+J (Console)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 74) {
          e.preventDefault();
          e.stopPropagation();
          this.triggerSecurityAlert('Console access blocked');
          return false;
        }

        // Ctrl+Shift+K (Console - alternate)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 75) {
          e.preventDefault();
          e.stopPropagation();
          this.triggerSecurityAlert('Console access blocked');
          return false;
        }

        // Ctrl+I (Inspector)
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 73) {
          e.preventDefault();
          e.stopPropagation();
          this.triggerSecurityAlert('Inspector blocked');
          return false;
        }

        // Ctrl+S (Save)
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }, true);

      // Detect DevTools opening via window size
      let devtools = { open: false };
      const threshold = 160;
      
      setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold ||
            window.outerWidth - window.innerWidth > threshold) {
          if (!devtools.open) {
            devtools.open = true;
            this.triggerSecurityAlert('Developer Tools detected and blocked');
            this.closeDevTools();
          }
        } else {
          devtools.open = false;
        }
      }, 500);

      // Debugger check
      const checkDebugger = () => {
        const before = new Date();
        debugger;
        const after = new Date();
        if (after - before > 100) {
          this.triggerSecurityAlert('Debugger detected');
          this.closeDevTools();
        }
      };
      
      if (!this.isInProduction()) {
        setTimeout(() => checkDebugger(), 1000);
      }
    },

    // ==================== Context Menu Protection ====================
    blockContextMenu: function() {
      document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.triggerSecurityAlert('Right-click disabled');
        return false;
      }, true);

      // Disable mouse right-click
      document.onmousedown = (e) => {
        if (e.button === 2) {
          this.triggerSecurityAlert('Right-click attempt blocked');
          return false;
        }
      };
    },

    // ==================== Source Map & Debug Protection ====================
    preventSourceMapExposure: function() {
      // Remove source maps references
      const scripts = document.querySelectorAll('script');
      scripts.forEach(script => {
        if (script.src && (script.src.includes('.map') || script.textContent.includes('sourceMap'))) {
          script.remove();
        }
      });

      // Prevent source map access
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        const [resource] = args;
        if (typeof resource === 'string' && resource.includes('.map')) {
          console.warn('Source map access blocked');
          return Promise.reject(new Error('Resource blocked'));
        }
        return originalFetch.apply(this, args);
      };
    },

    // ==================== Spam & Rate Limiting ====================
    spamData: {
      requests: [],
      messages: [],
      ips: new Map(),
    },

    implementSpamProtection: function() {
      // Message rate limiting
      window.checkSpamLimit = (maxPerHour = 100) => {
        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000);
        
        // Clean old entries
        this.spamData.messages = this.spamData.messages.filter(time => time > oneHourAgo);
        
        if (this.spamData.messages.length >= maxPerHour) {
          this.triggerSecurityAlert('Message rate limit exceeded');
          return false;
        }
        
        this.spamData.messages.push(now);
        return true;
      };

      // Request rate limiting
      window.checkRequestLimit = (maxPerMinute = 20) => {
        const now = Date.now();
        const oneMinuteAgo = now - (60 * 1000);
        
        // Clean old entries
        this.spamData.requests = this.spamData.requests.filter(time => time > oneMinuteAgo);
        
        if (this.spamData.requests.length >= maxPerMinute) {
          this.triggerSecurityAlert('Request rate limit exceeded');
          return false;
        }
        
        this.spamData.requests.push(now);
        return true;
      };

      // Spam pattern detection
      window.detectSpamPatterns = (content) => {
        if (!content || typeof content !== 'string') return false;

        const patterns = [
          /(.)\1{20,}/gi,                  // Repeated characters (20+)
          /(http|https):\/\/.*?(http|https):\/\//gi,  // Multiple URLs
          /[^a-zA-Z0-9\s]{30,}/gi,        // Excessive special characters
          /(\b\w+\b)(\s+\1){10,}/gi,      // Repeated words (10+)
          /\b(buy|click|free|win|prize|congratulations)\b/gi,  // Spam keywords (check quantity)
        ];

        let spamScore = 0;
        patterns.forEach(pattern => {
          const matches = content.match(pattern);
          if (matches) spamScore += matches.length;
        });

        // Spam if score > 5
        return spamScore > 5;
      };
    },

    // ==================== Input Validation & Sanitization ====================
    implementInputValidation: function() {
      window.validateInput = (input) => {
        if (typeof input !== 'string') return false;
        
        // Length check
        if (input.length > 10000) {
          this.triggerSecurityAlert('Input exceeds maximum length');
          return false;
        }

        // Spam check
        if (this.detectSpamPatterns(input)) {
          this.triggerSecurityAlert('Spam pattern detected');
          return false;
        }

        // Rate limit check
        if (!window.checkSpamLimit()) {
          return false;
        }

        return true;
      };

      // Sanitize HTML/Script content
      window.sanitizeInput = (input) => {
        if (typeof input !== 'string') return '';
        
        const div = document.createElement('div');
        div.textContent = input;
        let sanitized = div.innerHTML;

        // Remove dangerous protocols
        sanitized = sanitized.replace(/javascript:/gi, '')
                             .replace(/on\w+\s*=/gi, '')
                             .replace(/<script[^>]*>.*?<\/script>/gi, '');

        return sanitized;
      };
    },

    // ==================== XSS Protection ====================
    implementXSSProtection: function() {
      // Content Security Policy (already in meta tag, but enhanced here)
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = "default-src 'self'; script-src 'self' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; img-src 'self' data: https:;";
      document.head.appendChild(meta);

      // Escape HTML special characters
      window.escapeHTML = (text) => {
        const map = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
      };

      // Safe DOM manipulation
      window.safeSetHTML = (element, html) => {
        if (!element) return;
        element.textContent = '';
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        // Only allow safe elements
        const allowedTags = ['p', 'div', 'span', 'strong', 'em', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        const walker = document.createTreeWalker(
          temp,
          NodeFilter.SHOW_ELEMENT,
          null,
          false
        );

        let node;
        while (node = walker.nextNode()) {
          if (!allowedTags.includes(node.tagName.toLowerCase())) {
            node.remove();
          }
        }

        element.appendChild(temp);
      };
    },

    // ==================== CSRF Protection ====================
    implementCSRFProtection: function() {
      // Generate CSRF token
      window.generateCSRFToken = () => {
        const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        sessionStorage.setItem('csrf_token', token);
        return token;
      };

      // Verify CSRF token
      window.verifyCSRFToken = (token) => {
        const stored = sessionStorage.getItem('csrf_token');
        return token === stored;
      };

      // Initialize CSRF token
      if (!sessionStorage.getItem('csrf_token')) {
        window.generateCSRFToken();
      }
    },

    // ==================== Security Headers ====================
    setupSecurityHeaders: function() {
      const headers = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      };

      // Apply headers via fetch interceptor
      const originalFetch = window.fetch;
      window.fetch = function(resource, config = {}) {
        config.headers = {
          ...config.headers,
          'X-CSRF-Token': sessionStorage.getItem('csrf_token') || '',
          'X-Requested-With': 'XMLHttpRequest',
        };
        return originalFetch.apply(this, [resource, config]);
      };
    },

    // ==================== Suspicious Activity Monitoring ====================
    monitorSuspiciousActivity: function() {
      const suspiciousPatterns = {
        consoleAccess: 0,
        errorAccess: 0,
        windowAccess: 0,
        evalAttempts: 0,
      };

      // Monitor console access attempts
      ['log', 'warn', 'error', 'info', 'debug', 'table', 'trace'].forEach(method => {
        const original = console[method];
        console[method] = function(...args) {
          suspiciousPatterns.consoleAccess++;
          if (suspiciousPatterns.consoleAccess > 50) {
            this.triggerSecurityAlert('Excessive console access detected');
          }
          return original.apply(console, args);
        };
      });

      // Block eval and related functions
      const dangerousFunctions = ['eval', 'Function', 'setTimeout', 'setInterval'];
      dangerousFunctions.forEach(func => {
        try {
          window[func] = new Proxy(window[func], {
            apply: () => {
              this.triggerSecurityAlert(`${func} execution blocked`);
              throw new Error(`${func} execution is blocked`);
            }
          });
        } catch (e) {
          // Some functions can't be proxied
        }
      });

      // Monitor localStorage/sessionStorage access
      const monitorStorage = (storage, name) => {
        return new Proxy(storage, {
          get: (target, prop) => {
            if (typeof target[prop] === 'function') {
              return function(...args) {
                suspiciousPatterns.windowAccess++;
                if (suspiciousPatterns.windowAccess > 100) {
                  this.triggerSecurityAlert(`Excessive ${name} access detected`);
                }
                return target[prop].apply(target, args);
              };
            }
            return target[prop];
          }
        });
      };
    },

    // ==================== Disable Dangerous Methods ====================
    disableDangerousMethods: function() {
      // Override dangerous methods
      window.eval = new Proxy(eval, {
        apply: () => {
          throw new Error('eval() is disabled for security reasons');
        }
      });

      // Disable innerHTML assignment with scripts
      const originalSetterHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
      Object.defineProperty(Element.prototype, 'innerHTML', {
        set: function(html) {
          if (/<script[^>]*>.*?<\/script>/i.test(html)) {
            throw new Error('Script injection blocked');
          }
          return originalSetterHTML.call(this, html);
        },
        get: Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').get,
      });
    },

    // ==================== Console Protection ====================
    protectConsole: function() {
      // Prevent console hijacking
      Object.defineProperty(window, 'console', {
        value: console,
        writable: false,
        configurable: false
      });

      // Hide console info
      const originalLog = console.log;
      console.log = function(...args) {
        // Security messages only
        if (args[0] && args[0].includes('🛡️')) {
          originalLog.apply(console, args);
        }
      };
    },

    // ==================== Security Event Listeners ====================
    setupSecurityListeners: function() {
      // Unload event (prevent session hijacking)
      window.addEventListener('beforeunload', (e) => {
        sessionStorage.setItem('last_activity', Date.now());
      });

      // Visibility change (detect tab switching)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          sessionStorage.setItem('tab_hidden', Date.now());
        } else {
          const hiddenTime = sessionStorage.getItem('tab_hidden');
          if (hiddenTime && Date.now() - hiddenTime > 300000) { // 5 minutes
            this.triggerSecurityAlert('Session timeout - please refresh');
          }
        }
      });

      // Block copy/paste in sensitive areas
      document.addEventListener('copy', (e) => {
        if (e.target.classList.contains('no-copy')) {
          e.preventDefault();
          this.triggerSecurityAlert('Copy disabled for this content');
        }
      });

      // Prevent drag/drop of external content
      document.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'none';
      });

      document.addEventListener('drop', (e) => {
        e.preventDefault();
        this.triggerSecurityAlert('File drop disabled');
      });
    },

    // ==================== Close DevTools ====================
    closeDevTools: function() {
      // This is a limitation - we can't actually close devtools from JavaScript
      // But we can make it unusable
      document.body.innerHTML = '';
      window.location.href = 'about:blank';
    },

    // ==================== Alert User ====================
    triggerSecurityAlert: function(message) {
      const timestamp = new Date().toLocaleTimeString();
      console.warn(`[SECURITY] ${timestamp} - ${message}`);
      
      // Store in session for monitoring
      const alerts = JSON.parse(sessionStorage.getItem('security_alerts') || '[]');
      alerts.push({ message, timestamp, date: new Date().toISOString() });
      
      // Keep only last 100 alerts
      if (alerts.length > 100) alerts.shift();
      sessionStorage.setItem('security_alerts', JSON.stringify(alerts));

      // Visual indicator (if element exists)
      if (document.getElementById('security-status')) {
        const status = document.getElementById('security-status');
        status.textContent = `⚠️ ${message}`;
        status.style.background = '#dc2626';
        setTimeout(() => {
          status.textContent = '🛡️ Secure';
          status.style.background = '#16a34a';
        }, 3000);
      }
    },

    // ==================== Production Check ====================
    isInProduction: function() {
      return !location.hostname.includes('localhost') && 
             !location.hostname.includes('127.0.0.1') &&
             !location.hostname.includes('192.168');
    },

    // ==================== Detect Spam Patterns ====================
    detectSpamPatterns: function(content) {
      if (!content || typeof content !== 'string') return false;

      const patterns = [
        { regex: /(.)\1{20,}/gi, weight: 3 },                    // Repeated characters
        { regex: /(http|https):\/\/.*?(http|https):\/\//gi, weight: 2 }, // Multiple URLs
        { regex: /[^a-zA-Z0-9\s]{30,}/gi, weight: 2 },           // Excessive special chars
        { regex: /(\b\w+\b)(\s+\1){10,}/gi, weight: 3 },          // Repeated words
      ];

      let spamScore = 0;
      patterns.forEach(({ regex, weight }) => {
        const matches = content.match(regex);
        if (matches) spamScore += matches.length * weight;
      });

      return spamScore > 5;
    }
  };

  // ==================== Auto-Initialize ====================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SecuritySystem.init());
  } else {
    SecuritySystem.init();
  }

  // Expose security utilities to global scope
  window.Security = {
    validateInput: window.validateInput,
    sanitizeInput: window.sanitizeInput,
    escapeHTML: window.escapeHTML,
    checkSpamLimit: window.checkSpamLimit,
    checkRequestLimit: window.checkRequestLimit,
    generateCSRFToken: window.generateCSRFToken,
    verifyCSRFToken: window.verifyCSRFToken,
  };

})();
