const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Database connection with better error handling
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-saathi';
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB Connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('\n📋 To fix this:');
    console.error('   1. Make sure MongoDB is installed and running');
    console.error('   2. OR use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas');
    console.error('   3. Update MONGODB_URI in backend/.env file\n');
    process.exit(1);
  }
};

// Connect to database before starting server
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/users', require('./routes/users'));
app.use('/api/scams', require('./routes/scams'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/investments', require('./routes/investments'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Digital Saathi API is running' });
});

// Use port 5001 if 5000 is in use (macOS AirPlay uses 5000)
const PORT = process.env.PORT || 5001;

// Start server only after MongoDB connection is established
mongoose.connection.once('open', () => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    console.log(`💚 Health check: http://localhost:${PORT}/api/health\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use.`);
      console.error(`   Please kill the process using port ${PORT} or use a different port.`);
      console.error(`   To kill: lsof -ti:${PORT} | xargs kill -9`);
      process.exit(1);
    } else {
      throw err;
    }
  });
});

