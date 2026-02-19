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

// Initialize database
createUsersTable().catch(console.error);

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
      console.log('Validation failed: missing required fields');
      return res.status(400).json({ 
        success: false, 
        message: 'User name, email, and password are required' 
      });
    }

    if (password.length < 6) {
      console.log('Validation failed: password too short');
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      });
    }

    console.log('Attempting to connect to database...');
    const connection = await createConnection();

    // Check if user already exists
    console.log('Checking if user already exists...');
    const [existingUsers] = await connection.execute(
      'SELECT * FROM users WHERE email = ? OR user_name = ?',
      [email, user_name]
    );

    if (existingUsers.length > 0) {
      console.log('User already exists');
      await connection.end();
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email or username already exists' 
      });
    }

    // Encode password
    console.log('Hashing password...');
    const saltRounds = 10;
    const encodedPassword = await bcrypt.hash(password, saltRounds);

    // Generate user ID
    const userId = generateUserId();
    console.log('Generated user ID:', userId);

    // Insert new user
    console.log('Inserting new user...');
    await connection.execute(
      'INSERT INTO users (user_id, user_name, email, phone_number, password) VALUES (?, ?, ?, ?, ?)',
      [userId, user_name, email, phone_number || null, encodedPassword]
    );

    await connection.end();
    console.log('User registered successfully');

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user_id: userId
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error: ' + error.message 
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
