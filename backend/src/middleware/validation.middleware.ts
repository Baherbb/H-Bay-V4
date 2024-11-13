import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';

interface ValidationRule {
  value: any;
  rules: {
    required?: boolean;
    type?: string;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean;
  };
  message: string;
}

const validate = (rules: ValidationRule[]): string[] => {
  const errors: string[] = [];
  
  rules.forEach(({ value, rules: validationRules, message }) => {
    if (validationRules.required && !value) {
      errors.push(message);
      return;
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
      
      if (validationRules.custom && !validationRules.custom(value)) {
        errors.push(message);
      }
    }
  });
  
  return errors;
};

export const validateCategory = (req: Request, res: Response, next: NextFunction) => {
  const { name, description, parent_category_id } = req.body;
  
  const validationRules: ValidationRule[] = [
    {
      value: name,
      rules: {
        required: true,
        type: 'string',
        minLength: 2,
        maxLength: 100
      },
      message: 'Name must be between 2 and 100 characters'
    },
    {
      value: description,
      rules: {
        type: 'string'
      },
      message: 'Description must be a string'
    },
    {
      value: parent_category_id,
      rules: {
        custom: (value) => value === null || Number.isInteger(Number(value))
      },
      message: 'Parent category ID must be a valid integer or null'
    }
  ];
  
  const errors = validate(validationRules);
  
  if (errors.length > 0) {
    next(new AppError(errors.join(', '), 400));
    return;
  }
  next();
};

export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, phone } = req.body;
  
  const validationRules: ValidationRule[] = [
    {
      value: name,
      rules: {
        required: true,
        type: 'string',
        minLength: 2,
        maxLength: 100
      },
      message: 'Name must be between 2 and 100 characters'
    },
    {
      value: email,
      rules: {
        required: true,
        type: 'string',
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      },
      message: 'Please provide a valid email address'
    },
    {
      value: password,
      rules: {
        required: true,
        type: 'string',
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
      },
      message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
    },
    {
      value: phone,
      rules: {
        type: 'string',
        pattern: /^\+?[\d\s-]{10,}$/
      },
      message: 'Please provide a valid phone number'
    }
  ];
  
  const errors = validate(validationRules);
  
  if (errors.length > 0) {
    next(new AppError(errors.join(', '), 400));
    return;
  }
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  
  const validationRules: ValidationRule[] = [
    {
      value: email,
      rules: {
        required: true,
        type: 'string',
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      },
      message: 'Please provide a valid email address'
    },
    {
      value: password,
      rules: {
        required: true,
        type: 'string'
      },
      message: 'Password is required'
    }
  ];
  
  const errors = validate(validationRules);
  
  if (errors.length > 0) {
    next(new AppError(errors.join(', '), 400));
    return;
  }
  next();
};