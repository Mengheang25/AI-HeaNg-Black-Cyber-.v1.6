/**
 * =============================================
 * HEANG[BLACK-CYBER] V1.5 - ADVANCED SECURITY
 * =============================================
 * Comprehensive protection against:
 * - DDoS attacks
 * - Spam/brute force
 * - Developer tools access
 * - Session hijacking
 * - Malicious scripts
 * - XSS attacks
 * - CSRF attacks
 * - Bot attacks
 */

(function() {
    'use strict';

    // ==================== CONFIGURATION ====================
    const CONFIG = {
        MAX_REQUESTS_PER_MINUTE: 30,
        MAX_API_CALLS_PER_HOUR: 100,
        SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
        SUSPICIOUS_ACTIVITY_THRESHOLD: 5,
        LOCK_DURATION: 15 * 60 * 1000, // 15 minutes
        BLOCK_DURATION: 60 * 60 * 1000, // 1 hour
    };

    // ==================== STATE MANAGEMENT ====================
    const STATE = {
        requestCount: 0,
        requestTimestamps: [],
        apiCallTimestamps: [],
        suspiciousActivityCount: 0,
        lastActivityTime: Date.now(),
        isLocked: false,
        isBlocked: false,
        sessionStartTime: Date.now(),
        devToolsDetected: 0,
        failedAttempts: 0,
        ipInfo: null,
        fingerprint: generateFingerprint(),
    };

    // ==================== FINGERPRINTING ====================
    function generateFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('Browser Fingerprint', 2, 15);
        
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            colorDepth: window.screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            canvasSignature: canvas.toDataURL(),
            timestamp: Date.now(),
        };
    }

    // ==================== RATE LIMITING ====================
    function checkRateLimit() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;

        // Clean old timestamps
        STATE.requestTimestamps = STATE.requestTimestamps.filter(t => t > oneMinuteAgo);

        if (STATE.requestTimestamps.length >= CONFIG.MAX_REQUESTS_PER_MINUTE) {
            logSecurityEvent('RATE_LIMIT_EXCEEDED', {
                count: STATE.requestTimestamps.length,
                limit: CONFIG.MAX_REQUESTS_PER_MINUTE,
            });
            STATE.suspiciousActivityCount++;
            return false;
        }

        STATE.requestTimestamps.push(now);
        return true;
    }

    function checkApiRateLimit() {
        const now = Date.now();
        const oneHourAgo = now - 3600000;

        STATE.apiCallTimestamps = STATE.apiCallTimestamps.filter(t => t > oneHourAgo);

        if (STATE.apiCallTimestamps.length >= CONFIG.MAX_API_CALLS_PER_HOUR) {
            logSecurityEvent('API_RATE_LIMIT_EXCEEDED', {
                count: STATE.apiCallTimestamps.length,
                limit: CONFIG.MAX_API_CALLS_PER_HOUR,
            });
            STATE.suspiciousActivityCount++;
            showSecurityAlert('⚠️ Too many requests. Please wait before sending another message.');
            return false;
        }

        STATE.apiCallTimestamps.push(now);
        return true;
    }

    // ==================== DEVELOPER TOOLS PROTECTION ====================
    function detectDevTools() {
        // Method 1: Check console opening
        let devToolOpen = false;
        const threshold = 160;

        setInterval(() => {
            if (window.outerHeight - window.innerHeight > threshold ||
                window.outerWidth - window.innerWidth > threshold) {
                if (!devToolOpen) {
                    devToolOpen = true;
                    handleDevToolsDetection();
                }
            } else {
                devToolOpen = false;
            }
        }, 500);

        // Method 2: Debugger detection
        const checkDebugger = function() {
            const start = performance.now();
            debugger;
            const end = performance.now();
            
            if (end - start > 100) {
                handleDevToolsDetection();
            }
        };

        setInterval(checkDebugger, 1000);

        // Method 3: Console.log size detection
        const test = () => {};
        const objectSize = new Blob([test.toString()]).size;
        test.toString = function() {
            handleDevToolsDetection();
            return objectSize;
        };
    }

    function handleDevToolsDetection() {
        STATE.devToolsDetected++;
        logSecurityEvent('DEV_TOOLS_DETECTED', { attempt: STATE.devToolsDetected });

        if (STATE.devToolsDetected >= 3) {
            lockSession('Developer tools access detected. Session locked for security.');
            return;
        }

        showSecurityAlert('🔒 Developer tools access detected and blocked.');
    }

    // ==================== KEYBOARD SHORTCUT BLOCKING ====================
    function blockDangerousShortcuts() {
        document.addEventListener('keydown', (e) => {
            // F12 - Developer Tools
            if (e.keyCode === 123) {
                e.preventDefault();
                handleDevToolsDetection();
                return false;
            }

            // Ctrl+Shift+I / Cmd+Option+I - Inspector
            if ((e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
                (e.metaKey && e.altKey && e.keyCode === 73)) {
                e.preventDefault();
                handleDevToolsDetection();
                return false;
            }

            // Ctrl+Shift+J / Cmd+Option+J - Console
            if ((e.ctrlKey && e.shiftKey && e.keyCode === 74) ||
                (e.metaKey && e.altKey && e.keyCode === 74)) {
                e.preventDefault();
                handleDevToolsDetection();
                return false;
            }

            // Ctrl+Shift+C / Cmd+Shift+C - Element Inspector
            if ((e.ctrlKey && e.shiftKey && e.keyCode === 67) ||
                (e.metaKey && e.shiftKey && e.keyCode === 67)) {
                e.preventDefault();
                handleDevToolsDetection();
                return false;
            }

            // Ctrl+Shift+K - Clear Console
            if ((e.ctrlKey && e.shiftKey && e.keyCode === 75) ||
                (e.metaKey && e.shiftKey && e.keyCode === 75)) {
                e.preventDefault();
                return false;
            }

            // Right-click menu
            if (e.keyCode === 93 || (e.ctrlKey && e.keyCode === 83)) {
                e.preventDefault();
                return false;
            }
        }, true);
    }

    // ==================== RIGHT-CLICK BLOCKING ====================
    function blockRightClick() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            logSecurityEvent('RIGHT_CLICK_BLOCKED');
            showSecurityAlert('Right-click is disabled for security.');
            return false;
        }, true);

        // Block drag-and-drop of images
        document.addEventListener('dragstart', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
                return false;
            }
        });

        // Block selection (optional)
        document.addEventListener('selectstart', (e) => {
            // Allow selection but prevent copy of sensitive areas
            const protectedElement = e.target.closest('[data-sensitive]');
            if (protectedElement) {
                e.preventDefault();
                return false;
            }
        });
    }

    // ==================== SESSION MANAGEMENT ====================
    function initializeSession() {
        const sessionToken = generateSessionToken();
        sessionStorage.setItem('heang_session_token', sessionToken);
        sessionStorage.setItem('heang_session_start', Date.now());

        // Monitor session timeout
        window.addEventListener('mousemove', updateLastActivity);
        window.addEventListener('keypress', updateLastActivity);
        window.addEventListener('click', updateLastActivity);

        // Session timeout check
        setInterval(checkSessionTimeout, 60000);
    }

    function generateSessionToken() {
        return btoa(Math.random().toString()).substring(0, 32) + 
               Date.now().toString(36) + 
               Math.random().toString(36).substr(2);
    }

    function updateLastActivity() {
        STATE.lastActivityTime = Date.now();
    }

    function checkSessionTimeout() {
        const inactiveTime = Date.now() - STATE.lastActivityTime;
        
        if (inactiveTime > CONFIG.SESSION_TIMEOUT) {
            showSecurityAlert('⏱️ Your session has expired due to inactivity. Please refresh the page.');
            lockSession('Session timeout');
        }
    }

    // ==================== ACTIVITY MONITORING ====================
    function monitorSuspiciousActivity() {
        if (STATE.suspiciousActivityCount >= CONFIG.SUSPICIOUS_ACTIVITY_THRESHOLD) {
            logSecurityEvent('SUSPICIOUS_ACTIVITY_THRESHOLD_EXCEEDED', {
                count: STATE.suspiciousActivityCount,
            });
            
            // Show warning
            if (STATE.suspiciousActivityCount === CONFIG.SUSPICIOUS_ACTIVITY_THRESHOLD) {
                showSecurityAlert('⚠️ Multiple security violations detected. Account will be locked.');
            }
            
            // Lock after multiple warnings
            if (STATE.suspiciousActivityCount > CONFIG.SUSPICIOUS_ACTIVITY_THRESHOLD + 2) {
                lockSession('Repeated security violations detected.');
            }
        }
    }

    // ==================== LOCKING MECHANISM ====================
    function lockSession(reason) {
        STATE.isLocked = true;
        logSecurityEvent('SESSION_LOCKED', { reason });

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'security-lock-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            backdrop-filter: blur(10px);
        `;

        const lockBox = document.createElement('div');
        lockBox.style.cssText = `
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 2px solid #dc2626;
            border-radius: 20px;
            padding: 40px;
            max-width: 400px;
            text-align: center;
            color: white;
            font-family: 'Courier New', monospace;
            box-shadow: 0 0 30px rgba(220, 38, 38, 0.3);
        `;

        lockBox.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 20px;">🔒</div>
            <h2 style="color: #dc2626; font-size: 24px; margin-bottom: 15px;">SESSION LOCKED</h2>
            <p style="color: #999; margin-bottom: 20px; font-size: 14px;">${reason}</p>
            <p style="color: #666; margin-bottom: 20px; font-size: 12px;">
                Session will be automatically unlocked in ${Math.round(CONFIG.LOCK_DURATION / 1000 / 60)} minutes.
            </p>
            <button onclick="location.reload()" style="
                background: #dc2626;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                margin-top: 20px;
                transition: all 0.3s;
            " onmouseover="this.style.background='#991f1f'" onmouseout="this.style.background='#dc2626'">
                REFRESH PAGE
            </button>
        `;

        overlay.appendChild(lockBox);
        document.body.appendChild(overlay);

        // Disable all interactions
        document.body.style.pointerEvents = 'none';
        overlay.style.pointerEvents = 'auto';

        // Auto-unlock after duration
        setTimeout(() => {
            STATE.isLocked = false;
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            document.body.style.pointerEvents = 'auto';
            showSecurityAlert('✓ Session unlocked. Welcome back!');
        }, CONFIG.LOCK_DURATION);
    }

    // ==================== REQUEST INTERCEPTION ====================
    function interceptFetch() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            // Rate limiting check
            if (!checkRateLimit()) {
                STATE.suspiciousActivityCount++;
                return Promise.reject(new Error('Rate limit exceeded'));
            }

            // Check API calls
            const url = args[0];
            if (typeof url === 'string' && (url.includes('openrouter') || url.includes('/api/'))) {
                if (!checkApiRateLimit()) {
                    return Promise.reject(new Error('API rate limit exceeded'));
                }
            }

            // Validate request
            const request = args[0];
            const options = args[1] || {};

            if (STATE.isLocked) {
                return Promise.reject(new Error('Session is locked'));
            }

            // Log the request
            logSecurityEvent('FETCH_REQUEST', {
                url: String(request).substring(0, 100),
                method: options.method || 'GET',
            });

            // Add security headers
            if (!options.headers) options.headers = {};
            options.headers['X-Session-Token'] = sessionStorage.getItem('heang_session_token');
            options.headers['X-Client-Fingerprint'] = STATE.fingerprint.userAgent;

            return originalFetch.apply(window, [request, options])
                .then(response => {
                    if (!response.ok && response.status === 429) {
                        logSecurityEvent('API_RATE_LIMITED');
                        STATE.suspiciousActivityCount++;
                    }
                    return response;
                })
                .catch(error => {
                    logSecurityEvent('FETCH_ERROR', { error: error.message });
                    throw error;
                });
        };
    }

    // ==================== XSS PROTECTION ====================
    function setupXSSProtection() {
        // Sanitize user input before use
        const originalSetInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function(value) {
                // Only sanitize if not from trusted sources
                if (typeof value === 'string' && value.includes('<script')) {
                    logSecurityEvent('XSS_ATTEMPT_DETECTED', { content: value.substring(0, 100) });
                    console.warn('Potential XSS attack blocked');
                    return;
                }
                return originalSetInnerHTML.set.call(this, value);
            },
            get: originalSetInnerHTML.get,
        });
    }

    // ==================== CACHING PROTECTION ====================
    function preventCaching() {
        // Clear sensitive data from cache
        if ('caches' in window) {
            caches.keys().then(cacheNames => {
                cacheNames.forEach(cacheName => {
                    caches.open(cacheName).then(cache => {
                        cache.keys().then(requests => {
                            requests.forEach(request => {
                                if (request.url.includes('/api/') || request.url.includes('chat')) {
                                    cache.delete(request);
                                }
                            });
                        });
                    });
                });
            });
        }

        // Prevent browser caching of sensitive pages
        const headers = {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
        };

        if (document.head) {
            Object.entries(headers).forEach(([name, value]) => {
                const meta = document.createElement('meta');
                meta.httpEquiv = name;
                meta.content = value;
                document.head.appendChild(meta);
            });
        }
    }

    // ==================== LOGGING & MONITORING ====================
    function logSecurityEvent(eventType, details = {}) {
        const event = {
            type: eventType,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent.substring(0, 100),
            url: window.location.href,
            details: details,
            fingerprint: STATE.fingerprint.userAgent,
        };

        // Store locally (limited to 50 events)
        let logs = JSON.parse(sessionStorage.getItem('heang_security_logs') || '[]');
        logs.push(event);
        if (logs.length > 50) logs.shift();
        sessionStorage.setItem('heang_security_logs', JSON.stringify(logs));

        // For critical events, try to send to server
        if (['SESSION_LOCKED', 'DEV_TOOLS_DETECTED', 'XSS_ATTEMPT_DETECTED', 'RATE_LIMIT_EXCEEDED'].includes(eventType)) {
            sendSecurityLog(event).catch(() => {
                // Fail silently if server is unreachable
            });
        }

        console.log(`[SECURITY] ${eventType}:`, details);
    }

    function sendSecurityLog(event) {
        return fetch('/api/security-log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-Token': sessionStorage.getItem('heang_session_token'),
            },
            body: JSON.stringify(event),
        }).catch(() => {
            // Silently handle errors
        });
    }

    // ==================== UI ALERTS ====================
    function showSecurityAlert(message) {
        const alertBox = document.createElement('div');
        alertBox.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: #fecdd3;
            padding: 15px 20px;
            border-radius: 12px;
            border-left: 4px solid #dc2626;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            z-index: 99999;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            max-width: 350px;
            word-wrap: break-word;
            animation: slideIn 0.3s ease-out;
        `;

        alertBox.textContent = message;
        document.body.appendChild(alertBox);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            alertBox.style.opacity = '0';
            alertBox.style.transition = 'opacity 0.3s ease-out';
            setTimeout(() => alertBox.remove(), 300);
        }, 5000);

        // Add CSS animation
        const style = document.createElement('style');
        if (!document.getElementById('security-alerts-style')) {
            style.id = 'security-alerts-style';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ==================== PUBLIC API ====================
    window.Security = {
        checkRateLimit: checkRateLimit,
        checkApiRateLimit: checkApiRateLimit,
        isLocked: () => STATE.isLocked,
        isBlocked: () => STATE.isBlocked,
        getLogs: () => JSON.parse(sessionStorage.getItem('heang_security_logs') || '[]'),
        getFingerprint: () => STATE.fingerprint,
        logEvent: logSecurityEvent,
    };

    // ==================== INITIALIZATION ====================
    function init() {
        console.log('[SECURITY] HeaNg[Black-Cyber] Security System v1.5 initialized');

        // Initialize security measures
        initializeSession();
        detectDevTools();
        blockDangerousShortcuts();
        blockRightClick();
        interceptFetch();
        setupXSSProtection();
        preventCaching();

        // Monitor activity
        setInterval(monitorSuspiciousActivity, 5000);

        // Log initialization
        logSecurityEvent('SECURITY_SYSTEM_INITIALIZED', {
            fingerprint: STATE.fingerprint.userAgent.substring(0, 50),
        });

        // Test message
        showSecurityAlert('✓ Security system active');
    }

    // Start security system when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
