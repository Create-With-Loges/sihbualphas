const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { ensureDemoUsers } = require('./controllers/authController');

dotenv.config();

// Global Process Error Handlers to prevent abrupt crashes
process.on('uncaughtException', (err) => {
  console.error('[CRITICAL] Uncaught Exception thrown:', err.message);
  console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[CRITICAL] Unhandled Promise Rejection at:', promise, 'reason:', reason);
});

const app = express();
let PORT = parseInt(process.env.PORT, 10) || 5000;

// Connect to MongoDB & Seed demo accounts if empty
connectDB().then(async () => {
  await ensureDemoUsers();
}).catch(err => {
  console.warn('[MongoDB Startup Note]:', err.message);
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger in dev
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (res.statusCode >= 400) {
      console.warn(`[API] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    database: {
      type: 'MongoDB',
      status: mongoStatus
    },
    version: '2.0.0'
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/district-plans', require('./routes/districtRoutes'));
app.use('/api/job-signals', require('./routes/jobSignalRoutes'));
app.use('/api/employer', require('./routes/employerRoutes'));
app.use('/api/candidate', require('./routes/candidateRoutes'));
app.use('/api/ml', require('./routes/mlRoutes'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    platform: 'SkillPulse AI - Labour-Market Intelligence & Curriculum Alignment Platform',
    version: '2.0.0',
    status: 'online',
    endpoints: {
      auth: ['/api/auth/register', '/api/auth/login', '/api/auth/me'],
      users: ['/api/users'],
      analytics: ['/api/analytics/overview', '/api/analytics/query', '/api/analytics/simulate'],
      courses: ['/api/courses', '/api/courses/:id/align-ml'],
      districtPlans: ['/api/district-plans/demands', '/api/district-plans/forecast-ml'],
      jobSignals: ['/api/job-signals'],
      employer: ['/api/employer/surveys'],
      candidate: ['/api/candidate/pathway', '/api/candidate/readiness-ml'],
      ml: ['/api/ml/health', '/api/ml/predict-drift']
    }
  });
});

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found on this server`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Start Server with Graceful Port Collision Recovery
const startServer = (portToTry) => {
  const server = app.listen(portToTry, () => {
    console.log(`[SkillPulse Server] Successfully running on http://127.0.0.1:${portToTry}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[SkillPulse Server] Port ${portToTry} is already in use. Retrying on port ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      console.error('[SkillPulse Server Error]:', err.message);
    }
  });

  const handleShutdown = () => {
    console.log('[SkillPulse Server] Gracefully shutting down...');
    server.close(() => {
      mongoose.connection.close(false, () => {
        console.log('[MongoDB] Connection closed.');
        process.exit(0);
      });
    });
  };

  process.on('SIGTERM', handleShutdown);
  process.on('SIGINT', handleShutdown);
};

startServer(PORT);
