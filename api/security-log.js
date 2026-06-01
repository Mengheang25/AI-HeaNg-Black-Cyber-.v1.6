// api/security-log.js
// Security event logging endpoint for client-side security events

export default async function handler(req, res) {
  // Set security headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Session-Token');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event = req.body;

    if (!event || !event.type) {
      return res.status(400).json({ error: 'Invalid event data' });
    }

    // Log critical security events
    const criticalEvents = [
      'SESSION_LOCKED',
      'DEV_TOOLS_DETECTED',
      'XSS_ATTEMPT_DETECTED',
      'RATE_LIMIT_EXCEEDED',
    ];

    const isCritical = criticalEvents.includes(event.type);

    if (isCritical) {
      console.log(`[SECURITY CLIENT] ${event.type} - IP: ${req.headers['x-forwarded-for']?.split(',')[0] || 'unknown'}`, event.details);
    }

    // Store in database (if configured) or log file
    // For now, just acknowledge receipt
    return res.status(200).json({
      success: true,
      logged: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error logging security event:', error);
    return res.status(500).json({ error: 'Failed to log event' });
  }
}
