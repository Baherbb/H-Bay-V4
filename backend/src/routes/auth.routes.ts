import { Router } from 'express';
import passport from 'passport';
import { register, login, logout, googleCallback, facebookCallback, refreshToken } from '../controllers/auth.controller';
import { forgotPassword, resetPassword } from '../controllers/password.controller';
import { validateRegistration, validateLogin } from '../middleware/validation.middleware';
import { AuthenticateOptions } from 'passport';
import { AppError } from '../middleware/error.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

const logRequest = (req: any, res: any, next: any) => {
  console.log('Auth Route:', req.path);
  console.log('Headers:', req.headers);
  next();
};

router.use(logRequest);

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

router.post('/refresh-token', refreshToken);

router.post('/logout', logout);

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

router.get(
  '/facebook',
  (req, res, next) => {
    console.log('Starting Facebook Auth');
    next();
  },
  passport.authenticate('facebook', {
    scope: ['email', 'public_profile'],
    session: false,
  } as AuthenticateOptions)
);

// Facebook callback route
router.get(
  '/facebook/callback',
  (req, res, next) => {
    console.log('Facebook Callback Received');
    next();
  },
  passport.authenticate('facebook', {
    failureRedirect: '/api/auth/error',
    session: false,
  } as AuthenticateOptions),
  (req, res, next) => {
    console.log('Facebook Auth Success');
    next();
  },
  facebookCallback
);


router.get('/error', (req, res) => {
  console.error('Authentication Error:', req.query);
  res.status(401).json({
    status: 'error',
    message: 'Authentication failed',
    details: req.query
  });
});

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;