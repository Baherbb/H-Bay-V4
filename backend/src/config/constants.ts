export const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
export const JWT_EXPIRES_IN = '24h';
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
export const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
export const SESSION_SECRET = process.env.SESSION_SECRET!;
export const SESSION_MAX_AGE = parseInt(process.env.SESSION_MAX_AGE || '3600000');
