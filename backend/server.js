const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { createConnection, createUsersTable } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json());

// Initialize database (commented out for now)
// createUsersTable().catch(console.error);

// Helper function to generate user ID
const generateUserId = () => {
  return 'USR' + Date.now() + Math.random().toString(36).substr(2, 9);
};

// Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { user_name, email, phone_number, password } = req.body;

    // Validation
    if (!user_name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, email, and password are required' 
      });
    }

    // For now, just return success without database
    console.log('Registration successful for:', user_name);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user_id: `USR${Date.now()}${Math.random().toString(36).substr(2, 9)}`
    });

    // Original database code (commented out for now)
    /*
    const connection = await createConnection();
    await createUsersTable(connection);
    
    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT user_id FROM users WHERE user_name = ? OR email = ?',
      [user_name, email]
    );
    
    if (existingUsers.length > 0) {
      await connection.end();
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate unique user ID
    const user_id = `USR${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    
    // Insert new user
    await connection.execute(
      'INSERT INTO users (user_id, user_name, email, phone_number, password) VALUES (?, ?, ?, ?, ?)',
      [user_id, user_name, email, phone_number || null, hashedPassword]
    );
    
    await connection.end();
    
    console.log('User registered successfully');
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user_id
    });
    */
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { user_name, password } = req.body;

    if (!user_name || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    const connection = await createConnection();

    // Find user by username
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE user_name = ?',
      [user_name]
    );

    if (users.length === 0) {
      await connection.end();
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }

    const user = users[0];

    // Decode and verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await connection.end();
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }

    await connection.end();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id, userName: user.user_name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        email: user.email,
        phone_number: user.phone_number
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Verify token endpoint
app.get('/api/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'No token provided' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      success: true,
      user: decoded
    });
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
