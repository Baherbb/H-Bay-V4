import { Router } from 'express';
import passport from 'passport';
import { register, login, googleCallback } from '../controllers/auth.controller';
import { validateRegistration, validateLogin } from '../middleware/validation.middleware';
import { AppError } from '../middleware/error.middleware';

const router = Router();

// Add logging middleware for debugging
const logRequest = (req: any, res: any, next: any) => {
  console.log('Auth Route:', req.path);
  console.log('Headers:', req.headers);
  next();
};

router.use(logRequest);

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);


router.get(
  '/google',
  (req, res, next) => {
    console.log('Starting Google Auth');
    next();
  },
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    prompt: 'select_account'
  })
);

router.get(
  '/google/callback',
  (req, res, next) => {
    console.log('Google Callback Received');
    next();
  },
  passport.authenticate('google', {
    failureRedirect: '/api/auth/error',
    session: false
  }),
  (req, res, next) => {
    console.log('Google Auth Success');
    next();
  },
  googleCallback
);


router.get('/error', (req, res) => {
  console.error('Authentication Error:', req.query);
  res.status(401).json({
    status: 'error',
    message: 'Authentication failed',
    details: req.query
  });
});

export default router;