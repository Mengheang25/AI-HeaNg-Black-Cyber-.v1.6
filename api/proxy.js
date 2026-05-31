// api/proxy.js
// Vercel Serverless Function with DDoS protection & rate limiting

// Simple in-memory rate limiting (per IP)
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 20; // Max 20 requests per minute per IP
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }
  
  const record = rateLimitMap.get(ip);
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return false;
  }
  
  if (record.count >= maxRequests) {
    return true;
  }
  
  record.count++;
  return false;
}

// Clean up rate limit map every hour
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 60 * 60 * 1000);

export default async function handler(req, res) {
  // Get client IP
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
             req.socket.remoteAddress || 
             'unknown';
  
  // Rate limiting check
  if (isRateLimited(ip)) {
    console.warn(`Rate limit exceeded for IP: ${ip}`);
    return res.status(429).json({ 
      error: 'Too many requests. Please try again later.',
      retryAfter: 60 
    });
  }
  
  // Security headers
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-RateLimit-Limit', '20');
  res.setHeader('X-RateLimit-Window', '60');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Get API key from environment variable (secure)
    const API_KEY = process.env.OPENROUTER_API_KEY;
    
    if (!API_KEY) {
      console.error('OPENROUTER_API_KEY is not set');
      return res.status(500).json({ 
        error: 'API configuration error. Please set OPENROUTER_API_KEY in Vercel environment variables.' 
      });
    }
    
    const { messages, model, temperature, stream } = req.body;
    
    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }
    
    // Validate message content length (prevent abuse)
    const totalLength = messages.reduce((sum, m) => sum + (m.content?.length || 0), 0);
    if (totalLength > 10000) {
      return res.status(400).json({ error: 'Message too long. Maximum 10000 characters.' });
    }
    
    const requestBody = {
      model: model || 'deepseek/deepseek-v4-flash',
      messages: messages.slice(-20), // Limit context to last 20 messages
      temperature: Math.min(Math.max(temperature || 0.75, 0), 1),
      stream: stream || false,
    };
    
    console.log(`[${ip}] Request to OpenRouter with model: ${requestBody.model}`);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'https://heang-ai.vercel.app',
        'X-Title': 'HeaNg Black-Cyber AI'
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter API error: ${response.status} - ${errorText}`);
      return res.status(response.status).json({ 
        error: `API error: ${response.status}`,
        details: errorText.substring(0, 200)
      });
    }
    
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
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}