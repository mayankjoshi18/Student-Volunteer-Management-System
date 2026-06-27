const express = require('express');
const path = require('path');
const { setupSecurity } = require('./middleware/securityMiddleware');
const { apiLimiter } = require('./middleware/rateLimitMiddleware');
const { errorHandler } = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const volunteerHoursRoutes = require('./routes/volunteerHoursRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Set body parser limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Setup Security Headers & CORS
setupSecurity(app);

// Simple Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Apply general API rate limiter
app.use('/api', apiLimiter);

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/hours', volunteerHoursRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/admin', adminRoutes);

// Base route test
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Apex State Student Volunteer Management System APIs',
    status: 'online',
  });
});

// Centralized error handling
app.use(errorHandler);

module.exports = app;
