// api/logs.js
// Security logs endpoint (development/admin access)

const requestLogs = [];
const blockedIPs = new Map();

export default async function handler(req, res) {
  // Set headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Security check - only allow in development
    if (process.env.NODE_ENV === 'production') {
      // In production, require authentication
      const sessionToken = req.headers['x-session-token'];
      if (!sessionToken) {
        return res.status(403).json({ error: 'Not authorized' });
      }
    }

    const limit = Math.min(parseInt(req.query.limit) || 100, 500);
    const type = req.query.type; // Filter by type

    let logs = [...requestLogs];

    // Filter by type if specified
    if (type) {
      logs = logs.filter(log => log.type === type);
    }

    // Get recent logs
    const recentLogs = logs.slice(-limit);

    return res.status(200).json({
      totalLogs: logs.length,
      recentLogs,
      blockedIPs: Array.from(blockedIPs.entries()).map(([ip, data]) => ({
        ip,
        ...data,
      })),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return res.status(500).json({ error: 'Failed to fetch logs' });
  }
}

// Helper function to record logs
export function recordLog(ip, data) {
  requestLogs.push({
    ip,
    timestamp: new Date().toISOString(),
    ...data,
  });

  // Keep only last 1000 logs
  if (requestLogs.length > 1000) {
    requestLogs.shift();
  }
}
