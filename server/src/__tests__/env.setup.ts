process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
process.env.JWT_SECRET = 'test-jwt-secret-min-16-chars';
process.env.JWT_EXPIRES_IN = '7d';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX = '1000';
