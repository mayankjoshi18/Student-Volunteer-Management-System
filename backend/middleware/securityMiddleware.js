const cors = require('cors');
const helmet = require('helmet');

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const setupSecurity = (app) => {
  // CORS Configuration
  app.use(cors(corsOptions));

  // Helmet Security Headers (adjusted to allow loading of cross-origin assets like unsplash images)
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: false, // Turn off CSP temporarily for local sandbox images to load
    })
  );
};

module.exports = { setupSecurity };
