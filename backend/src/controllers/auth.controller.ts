import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { JWT_SECRET, JWT_EXPIRES_IN, FRONTEND_URL } from '../config/constants';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, name, phone } = req.body;

    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({
        status: 'error',
        message: 'Email already registered',
      });
      return;
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name,
      phone,
      user_type: 'customer',
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.status(201).json({
      status: 'success',
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
      return;
    }

    
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
      return;
    }


    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.status(200).json({
      status: 'success',
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.redirect(`${FRONTEND_URL}/auth/error`);
      return;
    }

    const user = req.user as User;

    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    
    res.status(200).json({
      status: 'success',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};