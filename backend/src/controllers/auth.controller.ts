import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import Cart from '../models/cart.model';
import { RolePermissions } from '../middleware/permissions';
import { JWT_SECRET, JWT_EXPIRES_IN, FRONTEND_URL, REFRESH_TOKEN_SECRET } from '../config/constants';
import Wishlist from '../models/wishlist.model';

interface TokenPayload {
  id: number;
  email: string;
  user_type: string;
  permissions: string[];
}

const generateTokens = (user: any) => {
  const userPermissions = RolePermissions[user.user_type as keyof typeof RolePermissions];
  
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
      permissions: userPermissions
    } as TokenPayload,
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    
    await Cart.create({ 
      user_id: user.id 
    });
    await Wishlist.create({ 
      user_id: user.id 
    });

    const { accessToken, refreshToken } = generateTokens(user);

    const { password: _, ...userWithoutPassword } = user.toJSON();

    const userPermissions = RolePermissions[user.user_type as keyof typeof RolePermissions];
  
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          ...userWithoutPassword,
          permissions: userPermissions
        },
        token: accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({
        status: 'error',
        message: 'No refresh token provided'
      });
      return;
    }

    try {
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { id: number };
      const user = await User.findByPk(decoded.id);

      if (!user) {
        res.status(401).json({
          status: 'error',
          message: 'User not found'
        });
        return;
      }

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
      const userPermissions = RolePermissions[user.user_type as keyof typeof RolePermissions];

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        status: 'success',
        data: {
          token: accessToken,
          permissions: userPermissions
        }
      });
    } catch (error) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid refresh token'
      });
    }
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

    const { accessToken, refreshToken } = generateTokens(user);
    const { password: _, ...userWithoutPassword } = user.toJSON();


    const userPermissions = RolePermissions[user.user_type as keyof typeof RolePermissions];

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          ...userWithoutPassword,
          permissions: userPermissions
        },
        token: accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(200).json({
      success: true,
      message: 'Successfully logged out'
    });
  } catch (error) {
    next(error); 
  }
};


export const handleSocialAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
  provider: 'google' | 'facebook'
): Promise<void> => {
  try {
    if (!req.user) {
      res.redirect(`${FRONTEND_URL}/auth/callback?error=authentication_failed&provider=${provider}`);
      return;
    }

    const user = req.user as User;
    const { accessToken, refreshToken } = generateTokens(user);
    const userPermissions = RolePermissions[user.user_type as keyof typeof RolePermissions];

    
    const [cart, wishlist] = await Promise.all([
      Cart.findOne({ where: { user_id: user.id } }),
      Wishlist.findOne({ where: { user_id: user.id } })
    ]);

    if (!cart) {
      await Cart.create({ 
        user_id: user.id 
      });
    }

    if (!wishlist) {
      await Wishlist.create({ 
        user_id: user.id 
      });
    }

    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.redirect(
      `${FRONTEND_URL}/auth/callback?token=${accessToken}&provider=${provider}&permissions=${JSON.stringify(userPermissions)}`
    );
  } catch (error) {
    next(error);
  }
};
export const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  await handleSocialAuth(req, res, next, 'google');
};

export const facebookCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  await handleSocialAuth(req, res, next, 'facebook');
};