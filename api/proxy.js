// api/proxy.js
// ============================================
// HEANG[BLACK-CYBER] V1.5 - SECURE API PROXY
// ============================================
// Enhanced security features:
// - Advanced rate limiting with multiple layers
// - DDoS protection
// - Spam detection
// - Input validation
// - Request fingerprinting
// - Security logging
// - CORS protection

// ============ RATE LIMITING SYSTEM ============
const rateLimitMap = new Map();
const globalRequestLog = [];
const blockedIPs = new Map();
const suspiciousPatterns = new Map();

const LIMITS = {
  perMinute: 20,
  perHour: 100,
  perDay: 500,
  concurrent: 5,
  messageLength: 10000,
  maxContextMessages: 20,
};

const TIMEOUTS = {
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  tempBan: 15 * 60 * 1000, // 15 minutes
  permanentBan: 24 * 60 * 60 * 1000, // 24 hours
};

function getClientIP(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || req.connection?.remoteAddress || 'unknown';
}

function isIPBlocked(ip) {
  if (!blockedIPs.has(ip)) return false;
  
  const { until, reason } = blockedIPs.get(ip);
  if (Date.now() > until) {
    blockedIPs.delete(ip);
    return false;
  }
  
  return { reason, until };
}

function blockIP(ip, duration, reason) {
  blockedIPs.set(ip, {
    until: Date.now() + duration,
    reason,
    blocked_at: new Date().toISOString(),
  });
  
  console.warn(`[SECURITY] IP BLOCKED: ${ip} - Reason: ${reason} - Duration: ${duration / 1000 / 60} minutes`);
}

function isRateLimited(ip) {
  const now = Date.now();
  const oneMinuteAgo = now - TIMEOUTS.minute;
  const oneHourAgo = now - TIMEOUTS.hour;
  const oneDayAgo = now - TIMEOUTS.day;
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, {
      minute: [],
      hour: [],
      day: [],
      concurrent: 0,
      violations: 0,
    });
  }
  
  const record = rateLimitMap.get(ip);
  
  // Clean old timestamps
  record.minute = record.minute.filter(t => t > oneMinuteAgo);
  record.hour = record.hour.filter(t => t > oneHourAgo);
  record.day = record.day.filter(t => t > oneDayAgo);
  
  // Check per-minute limit
  if (record.minute.length >= LIMITS.perMinute) {
    record.violations++;
    
    if (record.violations > 3) {
      blockIP(ip, TIMEOUTS.tempBan, 'Repeated rate limit violations');
      return { limited: true, reason: 'BLOCKED_TEMP', retryAfter: TIMEOUTS.tempBan / 1000 };
    }
    
    return { limited: true, reason: 'RATE_LIMIT_MINUTE', retryAfter: 60 };
  }
  
  // Check per-hour limit
  if (record.hour.length >= LIMITS.perHour) {
    record.violations++;
    blockIP(ip, TIMEOUTS.tempBan, 'Hourly rate limit exceeded');
    return { limited: true, reason: 'RATE_LIMIT_HOUR', retryAfter: 3600 };
  }
  
  // Check per-day limit
  if (record.day.length >= LIMITS.perDay) {
    record.violations++;
    blockIP(ip, TIMEOUTS.permanentBan, 'Daily rate limit exceeded');
    return { limited: true, reason: 'RATE_LIMIT_DAY', retryAfter: 86400 };
  }
  
  // Record the request
  record.minute.push(now);
  record.hour.push(now);
  record.day.push(now);
  
  return { limited: false };
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  
  // Clean rate limit map
  for (const [ip, record] of rateLimitMap.entries()) {
    record.minute = record.minute.filter(t => t > now - TIMEOUTS.minute);
    record.hour = record.hour.filter(t => t > now - TIMEOUTS.hour);
    record.day = record.day.filter(t => t > now - TIMEOUTS.day);
    
    if (record.minute.length === 0 && record.hour.length === 0 && record.day.length === 0) {
      rateLimitMap.delete(ip);
    }
  }
  
  // Clean blocked IPs
  for (const [ip, data] of blockedIPs.entries()) {
    if (now > data.until) {
      blockedIPs.delete(ip);
    }
  }
  
  // Clean global log (keep only last 1000 entries)
  if (globalRequestLog.length > 1000) {
    globalRequestLog.splice(0, globalRequestLog.length - 1000);
  }
}, TIMEOUTS.hour);

// ============ SECURITY UTILITIES ============
function sanitizeInput(text) {
  // Remove potentially dangerous content
  return text
    .replace(/[<>]/g, '')
    .substring(0, LIMITS.messageLength);
}

function validateSession(req) {
  const sessionToken = req.headers['x-session-token'];
  const fingerprint = req.headers['x-client-fingerprint'];
  
  if (!sessionToken || !fingerprint) {
    return { valid: false, reason: 'Missing session headers' };
  }
  
  return { valid: true };
}

function detectSuspiciousPatterns(messages) {
  let suspiciousScore = 0;
  
  for (const msg of messages) {
    const content = msg.content?.toLowerCase() || '';
    
    // Check for SQL injection patterns
    if (/(\bselect\b|\bunion\b|\bdrop\b|\binsert\b|\bupdate\b|\bdelete\b).*(from|where|table)/gi.test(content)) {
      suspiciousScore += 20;
    }
    
    // Check for script injection
    if (/<script|javascript:|onerror=/gi.test(content)) {
      suspiciousScore += 30;
    }
    
    // Check for excessive special characters
    if ((content.match(/[^a-zA-Z0-9\s.,!?-]/g) || []).length / content.length > 0.5) {
      suspiciousScore += 10;
    }
    
    // Check for repeated characters (spam pattern)
    if (/(.)\1{10,}/g.test(content)) {
      suspiciousScore += 15;
    }
  }
  
  return suspiciousScore;
}

function logRequest(ip, data) {
  globalRequestLog.push({
    ip,
    timestamp: new Date().toISOString(),
    method: data.method,
    status: data.status,
    model: data.model,
    messageCount: data.messageCount,
    suspicious: data.suspicious,
  });
}

function logSecurityEvent(ip, eventType, details) {
  console.log(`[SECURITY] ${eventType} - IP: ${ip} - Details:`, details);
}

// ============ MAIN HANDLER ============
export default async function handler(req, res) {
  const ip = getClientIP(req);
  const now = new Date().toISOString();

  // ========== SECURITY HEADERS ==========
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Session-Token, X-Client-Fingerprint');
  
  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ========== IP BLOCKING CHECK ==========
  const blocked = isIPBlocked(ip);
  if (blocked) {
    logSecurityEvent(ip, 'IP_BLOCKED', blocked);
    res.setHeader('Retry-After', Math.ceil((blocked.until - Date.now()) / 1000));
    return res.status(429).json({
      error: 'Access denied',
      reason: blocked.reason,
      retryAfter: Math.ceil((blocked.until - Date.now()) / 1000),
    });
  }

  // ========== RATE LIMITING CHECK ==========
  const rateLimitCheck = isRateLimited(ip);
  if (rateLimitCheck.limited) {
    logSecurityEvent(ip, 'RATE_LIMIT_EXCEEDED', rateLimitCheck);
    res.setHeader('X-RateLimit-Limit', LIMITS.perMinute);
    res.setHeader('X-RateLimit-Remaining', '0');
    res.setHeader('X-RateLimit-Reset', new Date(Date.now() + TIMEOUTS.minute).toISOString());
    res.setHeader('Retry-After', rateLimitCheck.retryAfter);
    return res.status(429).json({
      error: 'Too many requests',
      reason: rateLimitCheck.reason,
      retryAfter: rateLimitCheck.retryAfter,
    });
  }

  // ========== METHOD VALIDATION ==========
  if (req.method !== 'POST') {
    logSecurityEvent(ip, 'INVALID_METHOD', { method: req.method });
    return res.status(405).json({ error: 'Method not allowed. Only POST is supported.' });
  }

  try {
    // ========== SESSION VALIDATION ==========
    const sessionValid = validateSession(req);
    if (!sessionValid.valid) {
      logSecurityEvent(ip, 'INVALID_SESSION', sessionValid);
      return res.status(401).json({ error: sessionValid.reason });
    }

    // ========== REQUEST BODY VALIDATION ==========
    const { messages, model, temperature, stream } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      logSecurityEvent(ip, 'INVALID_MESSAGES', {});
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Check message count
    if (messages.length > LIMITS.maxContextMessages) {
      return res.status(400).json({
        error: `Too many messages. Maximum ${LIMITS.maxContextMessages} allowed.`,
      });
    }

    // ========== CONTENT VALIDATION ==========
    const totalLength = messages.reduce((sum, m) => sum + (m.content?.length || 0), 0);
    if (totalLength > LIMITS.messageLength) {
      logSecurityEvent(ip, 'MESSAGE_TOO_LONG', { length: totalLength });
      return res.status(400).json({
        error: `Message too long. Maximum ${LIMITS.messageLength} characters.`,
      });
    }

    // ========== SPAM & PATTERN DETECTION ==========
    const suspiciousScore = detectSuspiciousPatterns(messages);
    if (suspiciousScore > 50) {
      logSecurityEvent(ip, 'SUSPICIOUS_PATTERN_DETECTED', { score: suspiciousScore });
      
      // Increment violations for repeated suspicious activity
      const record = rateLimitMap.get(ip);
      if (record) record.violations++;

      return res.status(400).json({
        error: 'Request contains suspicious content',
        details: 'Your request has been flagged for security review.',
      });
    }

    // ========== API KEY VALIDATION ==========
    const API_KEY = process.env.OPENROUTER_API_KEY;
    if (!API_KEY) {
      console.error('[SECURITY] OPENROUTER_API_KEY is not configured');
      return res.status(500).json({
        error: 'Server configuration error',
      });
    }

    // ========== PREPARE REQUEST ==========
    const sanitizedMessages = messages.map(m => ({
      ...m,
      content: sanitizeInput(m.content),
    })).slice(-LIMITS.maxContextMessages);

    const requestBody = {
      model: model || 'deepseek/deepseek-v4-flash',
      messages: sanitizedMessages,
      temperature: Math.min(Math.max(temperature || 0.75, 0), 1),
      stream: stream || false,
    };

    console.log(`[${ip}] ✓ Request validated - Model: ${requestBody.model} - Messages: ${messages.length}`);

    // ========== API REQUEST ==========
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'https://heang-ai.vercel.app',
        'X-Title': 'HeaNg Black-Cyber AI',
        'User-Agent': 'HeaNg-BlackCyber-Secure-Client/1.5',
      },
      body: JSON.stringify(requestBody),
      timeout: 30000,
    });

    // ========== RESPONSE HANDLING ==========
    if (!response.ok) {
      const errorText = await response.text();
      logSecurityEvent(ip, 'API_ERROR', {
        status: response.status,
        statusText: response.statusText,
      });

      console.error(`[OpenRouter API] ${response.status} - ${errorText.substring(0, 200)}`);

      return res.status(response.status).json({
        error: `API error: ${response.status}`,
        message: 'Unable to process your request. Please try again.',
      });
    }

    // ========== STREAMING RESPONSE ==========
    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          res.write(chunk);
        }

        logRequest(ip, {
          method: 'POST',
          status: 200,
          model: requestBody.model,
          messageCount: messages.length,
          suspicious: suspiciousScore > 0,
        });

        res.end();
      } catch (streamError) {
        console.error('[Stream Error]:', streamError.message);
        logSecurityEvent(ip, 'STREAM_ERROR', { error: streamError.message });
        res.end();
      }
    } else {
      // ========== JSON RESPONSE ==========
      const data = await response.json();

      logRequest(ip, {
        method: 'POST',
        status: 200,
        model: requestBody.model,
        messageCount: messages.length,
        suspicious: suspiciousScore > 0,
      });

      res.status(200).json(data);
    }
  } catch (error) {
    logSecurityEvent(ip, 'HANDLER_ERROR', { error: error.message });
    console.error('[Proxy Error]:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred. Please try again.',
    });
  }
}

// ============ ADDITIONAL ENDPOINTS ============
// Handle security logs endpoint (for debugging)
if (process.env.NODE_ENV !== 'production') {
  export async function logs(req, res) {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const limit = parseInt(req.query.limit) || 100;
    return res.status(200).json({
      totalRequests: globalRequestLog.length,
      recentRequests: globalRequestLog.slice(-limit),
      blockedIPs: Array.from(blockedIPs.entries()),
      timestamp: new Date().toISOString(),
    });
  }
}