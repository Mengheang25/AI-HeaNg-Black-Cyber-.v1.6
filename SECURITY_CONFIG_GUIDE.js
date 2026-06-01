// =========================================
// 🛡️ SECURITY QUICK CONFIGURATION GUIDE
// =========================================
// Easy-to-modify security settings

// ==========================================
// FILE: api/proxy.js
// ==========================================

// LOCATION: Line ~20
// SECTION: Rate Limiting Configuration
// PURPOSE: Control how many requests are allowed

const RATE_LIMIT_CONFIG = {
  perMinute: 20,              // 👈 Requests allowed per minute per IP
  perHour: 200,               // 👈 Requests allowed per hour per IP
  perDay: 2000,               // 👈 Requests allowed per day per IP
  blockDurationMs: 3600000,   // 👈 Ban duration in milliseconds (3600000 = 1 hour)
};

// EXAMPLES:
// Strict mode:    perMinute: 10, perHour: 100, perDay: 1000
// Moderate mode:  perMinute: 20, perHour: 200, perDay: 2000 (DEFAULT)
// Relaxed mode:   perMinute: 50, perHour: 500, perDay: 5000

// ==========================================

// LOCATION: Line ~90
// SECTION: Spam Detection Patterns
// PURPOSE: Detect and block spam messages

const patterns = [
  { regex: /(.)\1{25,}/gi, weight: 5, name: 'Repeated chars' },      // 👈 Repeated characters
  { regex: /(http|https):\/\/.*?(http|https):\/\//gi, weight: 4, name: 'Multiple URLs' },
  { regex: /[^a-zA-Z0-9\s\.\,\!\?\-]{40,}/gi, weight: 4, name: 'Excessive special chars' },
  { regex: /(\b\w+\b)(\s+\1){15,}/gi, weight: 5, name: 'Repeated words' },
  { regex: /\b(viagra|casino|lottery|click|buy|free)\b/gi, weight: 3, name: 'Spam keywords' },
  { regex: /<script|javascript:|on\w+=/gi, weight: 10, name: 'Script injection' },
  { regex: /union\s+select|drop\s+table|delete\s+from|insert\s+into/gi, weight: 10, name: 'SQL injection' },
];

// TO ADD A NEW SPAM PATTERN:
// 1. Find the pattern that matches your criteria
// 2. Add a new line:
// { regex: /your-pattern-here/gi, weight: 3, name: 'Pattern Name' },
// 3. Weight: Higher = More important (1-10 range)

// EXAMPLE: Block all-caps messages (weight 3)
// { regex: /^[A-Z\s\.\,\!\?]+$/gm, weight: 3, name: 'All caps' },

// ==========================================

// LOCATION: Line ~110
// SECTION: User-Agent Blocking
// PURPOSE: Block malicious bots and tools

const blacklisted = [
  /curl/i,
  /wget/i,
  /scrapy/i,
  /bot/i,
  /spider/i,
  /crawler/i,
  /sqlmap/i,
  /nikto/i,
  /nmap/i,
];

// TO ADD A BLOCKED USER-AGENT:
// 1. Find the line with blacklisted patterns
// 2. Add: /your-agent-here/i,
// 3. The /i flag makes it case-insensitive

// EXAMPLE: Block all Metasploit requests
// /metasploit/i,

// ==========================================

// LOCATION: Line ~125
// SECTION: Allowed Bots
// PURPOSE: Whitelist legitimate crawlers

const allowedBots = [
  /googlebot/i,
  /bingbot/i,
  /slurp/i,
  /duckduckbot/i,
];

// TO ADD AN ALLOWED BOT:
// 1. Find the allowedBots array
// 2. Add: /bot-name/i,

// EXAMPLE: Allow Yandex crawler
// /yandexbot/i,

// ==========================================

// LOCATION: Line ~220
// SECTION: Allowed AI Models
// PURPOSE: Control which AI models can be used

const allowedModels = [
  'deepseek/deepseek-v4-flash',
  'deepseek/deepseek-chat',
  'meta-llama/llama-3-8b-instruct',
  'mistral/mistral-small',
];

// TO ADD A NEW MODEL:
// 1. Get the model ID from OpenRouter
// 2. Add to array: 'model-owner/model-name',

// EXAMPLE: Add Claude from Anthropic
// 'anthropic/claude-3-sonnet',

// TO DISABLE A MODEL:
// 1. Remove the entire line or comment it out
// // 'mistral/mistral-small',

// ==========================================

// LOCATION: Line ~190
// SECTION: CORS Configuration
// PURPOSE: Control allowed origins

res.setHeader('Access-Control-Allow-Origin', 
  process.env.ALLOWED_ORIGIN || 'https://heang-ai.vercel.app'
);

// TO ALLOW MULTIPLE ORIGINS (not recommended):
// const origin = req.headers.origin;
// const allowedOrigins = [
//   'https://heang-ai.vercel.app',
//   'https://yourdomain.com'
// ];
// if (allowedOrigins.includes(origin)) {
//   res.setHeader('Access-Control-Allow-Origin', origin);
// }

// ==========================================

// ==========================================
// FILE: public/security.js
// ==========================================

// LOCATION: Line ~10
// SECTION: Security Features Toggle
// PURPOSE: Enable/disable specific protections

const config = {
  enableF12Protection: true,              // 👈 Block F12 key
  enableInspectProtection: true,          // 👈 Block Ctrl+Shift+I
  enableContextMenuProtection: true,      // 👈 Block right-click
  enableSourceMapProtection: true,        // 👈 Block .map files
  enableDebuggerProtection: true,         // 👈 Detect debugger
  maxRequestsPerMinute: 20,               // 👈 Client-side rate limit
  maxMessagesPerHour: 100,                // 👈 Messages per hour
  spamDetectionEnabled: true,             // 👈 Enable spam detection
  enableUserAgentValidation: true,        // 👈 Validate browser
  enableXSSProtection: true,              // 👈 Prevent XSS
  enableCSRFProtection: true,             // 👈 CSRF token protection
};

// TO DISABLE A PROTECTION (for development):
// Set the value to false
// enableF12Protection: false,

// ==========================================

// LOCATION: Line ~450 (detectSpamPatterns function)
// SECTION: Client-Side Spam Detection
// PURPOSE: Detect spam before sending to server

const patterns = [
  { regex: /(.)\1{20,}/gi, weight: 3 },                    // Repeated characters
  { regex: /(http|https):\/\/.*?(http|https):\/\//gi, weight: 2 }, // Multiple URLs
  { regex: /[^a-zA-Z0-9\s]{30,}/gi, weight: 2 },           // Excessive special chars
  { regex: /(\b\w+\b)(\s+\1){10,}/gi, weight: 3 },          // Repeated words
];

// TO ADJUST SENSITIVITY:
// 1. Change the spam threshold (currently > 5)
// 2. Modify the pattern regex values
// 3. Adjust weights (higher = more strict)

// ==========================================

// ==========================================
// FILE: index.html
// ==========================================

// LOCATION: Line ~312
// SECTION: Content Security Policy
// PURPOSE: Control what resources can be loaded

<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://cdn.tailwindcss.com 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
  img-src 'self' data: https:;
  font-src 'self' https://cdnjs.cloudflare.com;
  connect-src 'self' https://*;
">

// TO ALLOW NEW DOMAINS:
// 1. Find the CSP meta tag
// 2. Add domain to appropriate directive
// 3. Example: Allow new API endpoint
// connect-src 'self' https://* https://your-api.com;

// ==========================================

// ==========================================
// ENVIRONMENT VARIABLES (.env.local)
// ==========================================

// Required variables:
OPENROUTER_API_KEY=your_api_key_here
ALLOWED_ORIGIN=https://your-domain.com
NODE_ENV=production

// Optional variables:
DEBUG=false
LOG_LEVEL=info

// ==========================================

// ==========================================
// COMMON CUSTOMIZATIONS
// ==========================================

// 1. INCREASE RATE LIMITS FOR HEAVY TRAFFIC
// In api/proxy.js, modify:
const RATE_LIMIT_CONFIG = {
  perMinute: 50,      // Doubled from 20
  perHour: 500,       // Doubled from 200
  perDay: 5000,       // Doubled from 2000
};

// 2. BLOCK ADDITIONAL BOTS
// In api/proxy.js, add to blacklisted:
/custombot/i,
/mybot/i,
/scrapetool/i,

// 3. DISABLE F12 BLOCKING (for development)
// In public/security.js, change:
enableF12Protection: false,

// 4. ADD NEW ALLOWED MODEL
// In api/proxy.js, add to allowedModels:
'grok/grok-2',

// 5. BLOCK MORE SPAM KEYWORDS
// In api/proxy.js, modify spam keywords pattern:
/\b(viagra|casino|lottery|click|buy|free|win|prize)\b/gi,

// 6. ADJUST SPAM DETECTION SENSITIVITY
// In api/proxy.js, change detection threshold:
return spamScore > 15;  // Stricter: spamScore > 10
                        // Looser: spamScore > 20

// 7. ALLOW ADDITIONAL DOMAINS IN CSP
// In index.html, modify connect-src:
connect-src 'self' https://* https://api.example.com;

// ==========================================

// ==========================================
// TESTING YOUR CHANGES
// ==========================================

// 1. Test rate limiting
// Send 25 requests in 60 seconds - expect 429 on 21-25

// 2. Test spam detection
// Send: "aaaaaaaaaaaaaaaaaaaaaaaaaaaa" - should be blocked

// 3. Test new model
// Send request with new model name - should work or be blocked

// 4. Test CSP
// Open DevTools (if enabled) - check for CSP violations

// 5. Monitor logs
// Run: npm run dev
// Watch for security alerts

// ==========================================

// ==========================================
// SECURITY MONITORING
// ==========================================

// In browser console, check:
JSON.parse(sessionStorage.getItem('security_alerts'))

// In server logs, look for:
// ✅ [IP] Request to OpenRouter
// ⏱️ Rate limit exceeded
// 🚨 Spam detected
// ❌ Error occurred

// ==========================================

// ==========================================
// SUPPORT & RESOURCES
// ==========================================

// Documentation:
// - SECURITY_DOCUMENTATION.md (full guide)
// - README.md (overview)

// API Providers:
// - OpenRouter: https://openrouter.ai

// Security Standards:
// - OWASP Top 10: https://owasp.org/Top10/
// - MDN Web Security: https://developer.mozilla.org/en-US/docs/Web/Security

// ==========================================
