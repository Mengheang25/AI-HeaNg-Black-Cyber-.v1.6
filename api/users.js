// api/users.js
// User Management API for Admin Dashboard

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Load users from database
function loadUsers() {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'users.json');
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.log('Database not found');
  }
  return [];
}

function saveUsers(users) {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(dataDir, 'users.json'),
      JSON.stringify(users, null, 2)
    );
    return true;
  } catch (error) {
    console.error('Error saving users:', error);
    return false;
  }
}

// Verify token
function verifyToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    return payload;
  } catch (error) {
    return null;
  }
}

// Check if user is admin
function isAdmin(email) {
  return email === 'mengheangkh25@gmail.com';
}

// GET users - List all users
function handleGetUsers(email) {
  if (!isAdmin(email)) {
    return {
      success: false,
      error: 'Unauthorized - Admin access required'
    };
  }

  const users = loadUsers();
  
  // Don't expose passwords
  const safeUsers = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    created_at: u.created_at,
    last_login: u.last_login,
    blocked: u.blocked
  }));

  return {
    success: true,
    users: safeUsers
  };
}

// PUT users - Block/Unblock user
function handleUpdateUser(email, action, targetEmail) {
  if (!isAdmin(email)) {
    return {
      success: false,
      error: 'Unauthorized - Admin access required'
    };
  }

  if (!['block', 'unblock'].includes(action)) {
    return {
      success: false,
      error: 'Invalid action'
    };
  }

  // Can't block yourself
  if (email === targetEmail) {
    return {
      success: false,
      error: 'Cannot block yourself'
    };
  }

  const users = loadUsers();
  const userIndex = users.findIndex(u => u.email === targetEmail);

  if (userIndex === -1) {
    return {
      success: false,
      error: 'User not found'
    };
  }

  users[userIndex].blocked = action === 'block';
  
  if (saveUsers(users)) {
    return {
      success: true,
      message: `User ${action}ed successfully`
    };
  } else {
    return {
      success: false,
      error: 'Failed to update user'
    };
  }
}

// Main handler
export default async function handler(req, res) {
  // Security headers
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verify token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Missing or invalid authorization'
    });
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  if (!payload || !payload.email) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }

  try {
    if (req.method === 'GET') {
      const result = handleGetUsers(payload.email);
      res.status(result.success ? 200 : 403).json(result);
    } else if (req.method === 'PUT') {
      const { action, email: targetEmail } = req.body;

      if (!action || !targetEmail) {
        return res.status(400).json({
          success: false,
          error: 'Action and email required'
        });
      }

      const result = handleUpdateUser(payload.email, action, targetEmail);
      res.status(result.success ? 200 : 400).json(result);
    } else {
      res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }
  } catch (error) {
    console.error('User API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
