// api/auth.js
// Authentication API - Sign In / Sign Up

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// In-memory user storage (for demo)
// In production, use a proper database like Supabase, Firebase, or MongoDB
let usersDatabase = [];

// Try to load users from file if it exists
function loadUsers() {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'users.json');
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf-8');
      usersDatabase = JSON.parse(data);
    }
  } catch (error) {
    console.log('Database not found, starting fresh');
    usersDatabase = [];
  }
}

function saveUsers() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(dataDir, 'users.json'),
      JSON.stringify(usersDatabase, null, 2)
    );
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

// Hash password
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Generate JWT-like token
function generateToken(email) {
  const payload = {
    email,
    timestamp: Date.now(),
    random: Math.random().toString(36).substring(2)
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
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

// Sign In Handler
function handleSignIn(email, password) {
  loadUsers();
  
  const user = usersDatabase.find(u => u.email === email);
  
  if (!user) {
    return {
      success: false,
      error: 'Invalid email or password'
    };
  }

  if (user.blocked) {
    return {
      success: false,
      error: 'Your account has been blocked by admin'
    };
  }

  const passwordHash = hashPassword(password);
  if (user.password !== passwordHash) {
    return {
      success: false,
      error: 'Invalid email or password'
    };
  }

  // Update last login
  user.last_login = new Date().toISOString();
  saveUsers();

  // Generate token
  const token = generateToken(user.email);

  return {
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at
    }
  };
}

// Sign Up Handler
function handleSignUp(name, email, password) {
  loadUsers();

  // Check if email already exists
  if (usersDatabase.find(u => u.email === email)) {
    return {
      success: false,
      error: 'Email already registered'
    };
  }

  // Validate input
  if (!name || name.length < 2) {
    return {
      success: false,
      error: 'Name must be at least 2 characters'
    };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      success: false,
      error: 'Invalid email format'
    };
  }

  if (!password || password.length < 6) {
    return {
      success: false,
      error: 'Password must be at least 6 characters'
    };
  }

  // Create new user
  const newUser = {
    id: 'user_' + Date.now(),
    name,
    email,
    password: hashPassword(password),
    created_at: new Date().toISOString(),
    last_login: null,
    blocked: false,
    sessions: []
  };

  usersDatabase.push(newUser);
  saveUsers();

  return {
    success: true,
    message: 'Account created successfully'
  };
}

// Main handler
export default async function handler(req, res) {
  // Security headers
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, email, password, name } = req.body;

    // Validate action
    if (!action || !['signin', 'signup'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid action'
      });
    }

    let result;

    if (action === 'signin') {
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password required'
        });
      }
      result = handleSignIn(email, password);
    } else if (action === 'signup') {
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Name, email, and password required'
        });
      }
      result = handleSignUp(name, email, password);
    }

    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
