const path = require('path');
const dotenv = require('dotenv');

// Load environment variables - silent in production
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '.env') });
  console.log('Environment loaded in development mode');
} else {
  dotenv.config();
  console.log('Running in production mode');
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express app first
const app = express();

// Then set properties on the app
app.set('trust proxy', 1);

// Configure CORS for deployment
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',');
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.indexOf(origin + '/') !== -1) {
      return callback(null, true);
    } else {
      console.log(`Origin ${origin} not allowed by CORS`);
      return callback(null, true); // Allow all origins temporarily for debugging
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add database connection status middleware
// Remove the database check middleware as we'll handle connection before starting the server

// Add security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// Ensure MongoDB is connected before processing API requests
app.use(async (req, res, next) => {
  // Skip this middleware for non-API routes or health checks
  if (req.path === '/' || req.path === '/api/health') {
    return next();
  }
  
  // Ensure MongoDB is connected
  if (mongoose.connection.readyState !== 1) {
    try {
      console.log('MongoDB not connected, attempting to connect before proceeding...');
      await connectDB();
      if (mongoose.connection.readyState !== 1) {
        return res.status(500).json({ message: 'Database connection not ready. Please try again.' });
      }
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
      return res.status(500).json({ message: 'Failed to connect to database. Please try again.' });
    }
  }
  next();
});

// MongoDB connection with better error handling and retries
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('FATAL: MongoDB URI is not defined. Set MONGODB_URI environment variable.');
  process.exit(1);
}

// Global variable to cache the database connection
let cachedDb = null;

// Connect to MongoDB with retry logic
const connectDB = async (retries = 5) => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('Using cached database connection');
    return true;
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(mongoUri, options);
    cachedDb = mongoose.connection;
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} attempts remaining)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return connectDB(retries - 1);
    }
    throw error;
  }

  try {
    // Close previous connection if exists but in wrong state
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // Increased timeout for serverless
      // For serverless environments, we need to buffer commands until connection is complete
      bufferCommands: true, // Changed to true to buffer commands until connection is established
      socketTimeoutMS: 45000, // Increased timeout for serverless
      family: 4, // Force IPv4
      connectTimeoutMS: 15000, // Increased connection timeout for serverless
      maxPoolSize: 10, // Increased for better performance
    });
    
    cachedDb = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return false;
  }
};

// Health check and debug routes
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'success',
    message: 'EduForge API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.status(200).json({
      status: 'success',
      message: 'API health check passed',
      environment: process.env.NODE_ENV,
      database: dbStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'API health check failed',
      error: error.message 
    });
  }
});

// Main application routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/contact', require('./routes/contact'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).json({ 
    status: 'error',
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

app.use((err, req, res, next) => {
  // Log error but avoid leaking sensitive details
  console.error(`Error: ${err.message}`);
  console.error(`Stack: ${err.stack}`);
  
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({ 
    status: 'error',
    message: process.env.NODE_ENV === 'production' ? 'Server error' : err.message,
    path: req.originalUrl,
    // Only include stack trace in development
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  
  // Connect to DB and start server
  connectDB().then((connected) => {
    if (connected) {
      const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });

      // Handle unhandled promise rejections
      process.on('unhandledRejection', (err) => {
        console.log(`Error: ${err.message}`);
        // Close server & exit process
        server.close(() => process.exit(1));
      });
    } else {
      console.error('Failed to connect to MongoDB. Server not started.');
      process.exit(1);
    }
  });
} else {
  // For Vercel serverless environment
  let connectionPromise = null;

  // Connection initializer function
  const initializeConnection = async () => {
    if (!connectionPromise) {
      console.log('Initializing new MongoDB connection');
      connectionPromise = connectDB();
    }
    return connectionPromise;
  };

  // Middleware to ensure DB connection for each request
  app.use(async (req, res, next) => {
    try {
      await initializeConnection();
      next();
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      res.status(503).json({ message: 'Database connection failed. Please try again.' });
    }
  });

  // Initialize connection on cold start
  initializeConnection()
    .then(() => console.log('MongoDB connection initialized for serverless environment'))
    .catch(err => console.error('MongoDB connection failed in serverless environment:', err.message));
}

// Properly handle uncaught errors in serverless environment
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  // Don't exit process in serverless environment
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  // Don't exit process in serverless environment
});

// Set MongoDB connection options for serverless environment
const serverlessMongoOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 30000,
  connectTimeoutMS: 10000
};

// Export the Express app for Vercel
module.exports = app;
