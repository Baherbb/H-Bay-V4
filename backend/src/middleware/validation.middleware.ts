import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';
import jwt from 'jsonwebtoken';
import { SortParameters } from '../types/product.types';
import Brand from '../models/brand.model';
import Category from '../models/category.model';
import User from '../models/user.model';
import { JWT_SECRET } from '../config/constants';

interface ValidationRule {
  value: any;
  rules: {
    required?: boolean;
    type?: string;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: ((value: any) => boolean | Promise<boolean>);
    enum?: readonly any[];
    min?: number;
    max?: number;
  };
  message: string;
}

const validate = async (rules: ValidationRule[]): Promise<string[]> => {
  const errors: string[] = [];

  for (const { value, rules: validationRules, message } of rules) {
    if (validationRules.required && !value) {
      errors.push(message);
      continue;
    }

    if (value) {
      if (validationRules.type && typeof value !== validationRules.type) {
        errors.push(message);
      }

      if (validationRules.minLength && String(value).length < validationRules.minLength) {
        errors.push(message);
      }

      if (validationRules.maxLength && String(value).length > validationRules.maxLength) {
        errors.push(message);
      }

      if (validationRules.pattern && !validationRules.pattern.test(String(value))) {
        errors.push(message);
      }

      if (validationRules.custom) {
        const isValid = await Promise.resolve(validationRules.custom(value));
        if (!isValid) {
          errors.push(message);
        }
      }
    }
  }

  return errors;
};

export const validateCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, parent_category_id } = req.body;

  const validationRules: ValidationRule[] = [
    {
      value: name,
      rules: {
        required: true,
        type: 'string',
        minLength: 2,
        maxLength: 100,
      },
      message: 'Name must be between 2 and 100 characters',
    },
    {
      value: description,
      rules: { type: 'string' },
      message: 'Description must be a string',
    },
    {
      value: parent_category_id,
      rules: {
        custom: (value) => value === null || Number.isInteger(Number(value)),
      },
      message: 'Parent category ID must be a valid integer or null',
    },
  ];

  const errors = await validate(validationRules);

  if (errors.length > 0) {
    next(new AppError(errors.join(', '), 400));
    return;
  }
  next();
};

export const validateRegistration = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, phone } = req.body;

  const validationRules: ValidationRule[] = [
    {
      value: name,
      rules: {
        required: true,
        type: 'string',
        minLength: 2,
        maxLength: 100,
      },
      message: 'Name must be between 2 and 100 characters',
    },
    {
      value: email,
      rules: {
        required: true,
        type: 'string',
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      message: 'Please provide a valid email address',
    },
    {
      value: password,
      rules: {
        required: true,
        type: 'string',
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*]{8,}$/,
      },
      message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
    },
    {
      value: phone,
      rules: {
        type: 'string',
        pattern: /^\+?[\d\s-]{10,}$/,
      },
      message: 'Please provide a valid phone number',
    },
  ];

  const errors = await validate(validationRules);

  if (errors.length > 0) {
    next(new AppError(errors.join(', '), 400));
    return;
  }
  next();
};

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({
        status: 'error',
        message: 'No token provided'
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
      const user = await User.findByPk(decoded.id);

      if (!user) {
        res.status(401).json({
          status: 'error',
          message: 'User not found'
        });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          status: 'error',
          message: 'Token expired'
        });
      } else {
        res.status(401).json({
          status: 'error',
          message: 'Invalid token'
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

export const validateLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const validationRules: ValidationRule[] = [
    {
      value: email,
      rules: {
        required: true,
        type: 'string',
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      message: 'Please provide a valid email address',
    },
    {
      value: password,
      rules: {
        required: true,
        type: 'string',
      },
      message: 'Password is required',
    },
  ];

  const errors = await validate(validationRules);

  if (errors.length > 0) {
    next(new AppError(errors.join(', '), 400));
    return;
  }
  next();
};

export const validateSortParameters = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { sortBy = 'created_at', sortOrder = 'DESC' } = req.query;

  const allowedSortFields = ['name', 'price', 'created_at', 'tech_category', 'release_date'];
  const allowedSortOrders = ['ASC', 'DESC'];

  if (!allowedSortFields.includes(sortBy.toString())) {
    res.status(400).json({
      error: `Invalid sortBy parameter. Allowed values: ${allowedSortFields.join(', ')}`,
    });
    return; 
  }

  const normalizedSortOrder = sortOrder.toString().toUpperCase();
  if (!allowedSortOrders.includes(normalizedSortOrder)) {
    res.status(400).json({
      error: 'Invalid sortOrder parameter. Allowed values: ASC, DESC',
    });
    return; 
  }

  (req as Request & { sortParams: SortParameters }).sortParams = {
    sortBy: sortBy.toString(),
    sortOrder: normalizedSortOrder as 'ASC' | 'DESC',
  };

  next(); 
};

export const validateWishlist = (req: Request, res: Response, next: NextFunction) => {
  const { name, is_public } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return next(new AppError('Wishlist name is required', 400));
  }
  
  if (is_public !== undefined && typeof is_public !== 'boolean') {
      return next(new AppError('is_public must be a boolean', 400));
  }
  
  next();
};


export const validateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const validationRules: Record<string, ValidationRule> = {
    name: {
      value: req.body.name,
      rules: {
        required: true,
        minLength: 2,
        maxLength: 255,
      },
      message: 'Name must be between 2 and 255 characters',
    },
    description: {
      value: req.body.description,
      rules: {
        maxLength: 1000,
      },
      message: 'Description cannot exceed 1000 characters',
    },
    price: {
      value: req.body.price,
      rules: {
        required: true,
        type: 'number',
        min: 0,
      },
      message: 'Price must be a positive number',
    },
    // category_id: {
    //   value: req.body.category_id,
    //   rules: {
    //     required: true,
    //     type: 'number',
    //     custom: async (value) => {
    //       const category = await Category.findByPk(value);
    //       return !!category;
    //     },
    //   },
    //   message: 'Invalid category ID',
    // },
    // brand_id: {
    //   value: req.body.brand_id,
    //   rules: {
    //     required: true,
    //     type: 'number',
    //     custom: async (value) => {
    //       const brand = await Brand.findByPk(value);
    //       return !!brand;
    //     },
    //   },
    //   message: 'Invalid brand ID',
    // },
    // tech_category: {
    //   value: req.body.tech_category,
    //   rules: {
    //     enum: ['Electronics', 'Computers', 'Smartphones', 'Accessories'],
    //   },
    //   message: 'Invalid tech category',
    // },
    model_number: {
      value: req.body.model_number,
      rules: {
        maxLength: 100,
      },
      message: 'Model number cannot exceed 100 characters',
    },
    release_date: {
      value: req.body.release_date,
      rules: {
        custom: (value) => {
          if (!value) return true;
          const date = new Date(value);
          return !isNaN(date.getTime()) && date <= new Date();
        },
      },
      message: 'Invalid release date',
    },
    weight: {
      value: req.body.weight,
      rules: {
        type: 'number',
        min: 0,
      },
      message: 'Weight must be a positive number',
    },
  };

  const errors: string[] = [];

  for (const [field, rule] of Object.entries(validationRules)) {
    const { value, rules, message } = rule;

    if (rules.required && (value === undefined || value === null)) {
      errors.push(`${field} is required`);
      continue;
    }

    if (value === undefined || value === null) continue;

    if (rules.type && typeof value !== rules.type) {
      errors.push(`${field} must be of type ${rules.type}`);
    }

    if (rules.minLength && value.length < rules.minLength) {
      errors.push(message);
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(message);
    }

    if (rules.min !== undefined && value < rules.min) {
      errors.push(message);
    }

    if (rules.max !== undefined && value > rules.max) {
      errors.push(message);
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(message);
    }

    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(message);
    }

    if (rules.custom) {
      const isValid = await rules.custom(value);
      if (!isValid) {
        errors.push(message);
      }
    }
  }

  if (errors.length > 0) {
    next(new AppError(errors.join(', '), 400));
    return;
  }

  next();
};
