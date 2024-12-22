import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants';
import User, { UserAttributes, UserType } from '../models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: 'No authorization header found'
      });
      return;
    }

    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Invalid authorization format - must be Bearer token'
      });
      return;
    }

    
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: number;
        email: string;
        user_type: string;
      };

      const user = await User.findByPk(decoded.id);
      
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      req.user = user;
      next();
    } catch (jwtError) {
      console.error('JWT Verification Error:', jwtError);
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const requireRole = (roles: UserType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
      const user = req.user as UserAttributes;
      if (!user || !roles.includes(user.user_type)) {
          return res.status(403).json({
              status: 'error',
              message: 'Unauthorized access'
          });
      }
      next();
  };
};