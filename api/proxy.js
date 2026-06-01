// api/proxy.js
// ==========================================
// HeaNg[Black-Cyber] - Advanced Security System
// ==========================================
// Vercel Serverless Function with:
// - DDoS Protection
// - Rate Limiting (multiple levels)
// - Spam Detection
// - User-Agent Validation
// - SQL Injection Prevention
// - XSS Prevention
// - Request Validation

// ==================== Rate Limiting ====================
// Advanced rate limiting with sliding window algorithm
const rateLimitMap = new Map();
const suspiciousIPMap = new Map();
const spamPatternCache = new Map();

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  perMinute: 20,          // 20 requests per minute per IP
  perHour: 200,           // 200 requests per hour per IP
  perDay: 2000,           // 2000 requests per day per IP
  windowMs: 60 * 1000,    // 1 minute window
  blockDurationMs: 3600000, // 1 hour block
};

// Enhanced rate limiting with sliding window
function isRateLimited(ip) {
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;
  const oneHourAgo = now - 60 * 60 * 1000;
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  // Initialize if not exists
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { requests: [now], blocked: false, blockUntil: 0 });
    return false;
  }

  const record = rateLimitMap.get(ip);

  // Check if IP is temporarily blocked
  if (record.blocked && now < record.blockUntil) {
    return true;
  }
  
  if (record.blocked && now >= record.blockUntil) {
    record.blocked = false;
    record.blockUntil = 0;
    record.requests = [];
  }

  // Clean old requests
  record.requests = record.requests.filter(time => time > oneDayAgo);

  // Check limits
  const lastMinute = record.requests.filter(time => time > oneMinuteAgo).length;
  const lastHour = record.requests.filter(time => time > oneHourAgo).length;
  const lastDay = record.requests.length;

  if (lastMinute >= RATE_LIMIT_CONFIG.perMinute ||
      lastHour >= RATE_LIMIT_CONFIG.perHour ||
      lastDay >= RATE_LIMIT_CONFIG.perDay) {
    
    // Block this IP
    record.blocked = true;
    record.blockUntil = now + RATE_LIMIT_CONFIG.blockDurationMs;
    console.warn(`🚨 Rate limit exceeded for IP: ${ip}`);
    return true;
  }

  record.requests.push(now);
  return false;
}

// ==================== Spam Detection ====================
function detectSpamPattern(content) {
  if (!content || typeof content !== 'string') return false;

  const patterns = [
    { regex: /(.)\1{25,}/gi, weight: 5, name: 'Repeated chars' },
    { regex: /(http|https):\/\/.*?(http|https):\/\//gi, weight: 4, name: 'Multiple URLs' },
    { regex: /[^a-zA-Z0-9\s\.\,\!\?\-]{40,}/gi, weight: 4, name: 'Excessive special chars' },
    { regex: /(\b\w+\b)(\s+\1){15,}/gi, weight: 5, name: 'Repeated words' },
    { regex: /\b(viagra|casino|lottery|click|buy|free)\b/gi, weight: 3, name: 'Spam keywords' },
    { regex: /<script|javascript:|on\w+=/gi, weight: 10, name: 'Script injection' },
    { regex: /union\s+select|drop\s+table|delete\s+from|insert\s+into/gi, weight: 10, name: 'SQL injection' },
  ];

  let spamScore = 0;
  const detected = [];

  patterns.forEach(({ regex, weight, name }) => {
    const matches = content.match(regex);
    if (matches) {
      spamScore += matches.length * weight;
      detected.push(name);
    }
  });

  if (detected.length > 0) {
    console.warn(`⚠️ Spam patterns detected: ${detected.join(', ')} (score: ${spamScore})`);
  }

  return spamScore > 10;
}

// ==================== User-Agent Validation ====================
function validateUserAgent(userAgent) {
  if (!userAgent) return false;

  // Reject known malicious user agents
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

  // Allow specific bots
  const allowedBots = [/googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i];

  for (const bot of allowedBots) {
    if (bot.test(userAgent)) return true;
  }

  for (const blacklist of blacklisted) {
    if (blacklist.test(userAgent)) {
      console.warn(`🚨 Malicious User-Agent blocked: ${userAgent}`);
      return false;
    }
  }

  return true;
}

// ==================== Clean up rate limit map ====================
setInterval(() => {
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  
  for (const [ip, record] of rateLimitMap.entries()) {
    // Keep only requests from the last day
    record.requests = record.requests.filter(time => time > oneDayAgo);
    
    // Remove if no requests and not blocked
    if (record.requests.length === 0 && !record.blocked) {
      rateLimitMap.delete(ip);
    }
  }

  // Clean suspicious IP map
  for (const [ip, data] of suspiciousIPMap.entries()) {
    if (now > data.expiresAt) {
      suspiciousIPMap.delete(ip);
    }
  }
}, 60 * 60 * 1000); // Every hour

// ==================== Main Request Handler ====================
export default async function handler(req, res) {
  // Get client IP (supporting proxies)
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 
             req.headers['x-real-ip'] ||
             req.socket?.remoteAddress ||
             'unknown';

  // ==================== Phase 1: Initial Validation ====================
  
  // Validate User-Agent
  const userAgent = req.headers['user-agent'] || 'unknown';
  if (!validateUserAgent(userAgent)) {
    return res.status(403).json({ 
      error: 'Access denied',
      code: 'INVALID_USER_AGENT'
    });
  }

  // Rate limiting check
  if (isRateLimited(ip)) {
    console.warn(`⏱️ Rate limit exceeded for IP: ${ip}`);
    return res.status(429).json({ 
      error: 'Too many requests. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: 60 
    });
  }

  // ==================== Phase 2: Security Headers ====================
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline';");
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || 'https://heang-ai.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-Token');
  
  // Rate limit info headers
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT_CONFIG.perMinute.toString());
  res.setHeader('X-RateLimit-Window', '60');

  // ==================== Phase 3: Handle Preflight ====================
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  try {
    // ==================== Phase 4: Validate Request Body ====================
    
    const { messages, model, temperature, stream } = req.body;

    // Validate messages parameter
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid messages format',
        code: 'INVALID_MESSAGES'
      });
    }

    // Validate message count
    if (messages.length > 50) {
      return res.status(400).json({ 
        error: 'Too many messages. Maximum 50 allowed.',
        code: 'MESSAGE_COUNT_EXCEEDED'
      });
    }

    // ==================== Phase 5: Content Validation & Security ====================

    // Check each message for spam and security issues
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];

      if (!msg.content || typeof msg.content !== 'string') {
        return res.status(400).json({ 
          error: `Invalid message format at index ${i}`,
          code: 'INVALID_MESSAGE_FORMAT'
        });
      }

      const content = msg.content;

      // Validate content length
      if (content.length > 5000) {
        return res.status(400).json({ 
          error: `Message too long at index ${i}. Maximum 5000 characters per message.`,
          code: 'MESSAGE_TOO_LONG'
        });
      }

      // Detect spam patterns
      if (detectSpamPattern(content)) {
        console.warn(`🚨 Spam detected from IP: ${ip}`);
        return res.status(400).json({ 
          error: 'Message contains spam or malicious content',
          code: 'SPAM_DETECTED'
        });
      }

      // Validate role
      if (msg.role && !['user', 'assistant', 'system'].includes(msg.role)) {
        return res.status(400).json({ 
          error: `Invalid role at index ${i}`,
          code: 'INVALID_ROLE'
        });
      }
    }

    // Total content length check
    const totalLength = messages.reduce((sum, m) => sum + (m.content?.length || 0), 0);
    if (totalLength > 15000) {
      return res.status(400).json({ 
        error: 'Total message content too long. Maximum 15000 characters.',
        code: 'TOTAL_LENGTH_EXCEEDED'
      });
    }

    // ==================== Phase 6: Model & Parameter Validation ====================

    // Whitelist models
    const allowedModels = [
      'deepseek/deepseek-v4-flash',
      'deepseek/deepseek-chat',
      'meta-llama/llama-3-8b-instruct',
      'mistral/mistral-small',
    ];

    const selectedModel = model || 'deepseek/deepseek-v4-flash';
    if (!allowedModels.includes(selectedModel)) {
      console.warn(`⚠️ Unauthorized model requested: ${selectedModel} by IP: ${ip}`);
      return res.status(400).json({ 
        error: 'Model not allowed',
        code: 'INVALID_MODEL'
      });
    }

    // Validate temperature
    const validTemperature = Math.min(Math.max(parseFloat(temperature) || 0.75, 0), 2);

    // ==================== Phase 7: Build & Send Request ====================

    const requestBody = {
      model: selectedModel,
      messages: messages.slice(-20), // Limit context to last 20 messages for safety
      temperature: validTemperature,
      stream: stream === true,
    };

    console.log(`✅ [${ip}] Request to OpenRouter - Model: ${selectedModel}`);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'https://heang-ai.vercel.app',
        'X-Title': 'HeaNg Black-Cyber AI',
        'User-Agent': 'HeaNg-AI/1.5 (+https://heang-ai.vercel.app)',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ OpenRouter API error: ${response.status} - ${errorText.substring(0, 200)}`);
      return res.status(response.status).json({ 
        error: `API error: ${response.status}`,
        code: 'API_ERROR',
        details: errorText.substring(0, 200)
      });
    }

    // ==================== Phase 8: Stream or Return Response ====================

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
        res.end();
      } catch (streamError) {
        console.error('Streaming error:', streamError);
        res.end();
      }
    } else {
      const data = await response.json();
      res.status(200).json(data);
    }

  } catch (error) {
    console.error('🔴 Proxy error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'An error occurred' : error.message
    });
  }
}