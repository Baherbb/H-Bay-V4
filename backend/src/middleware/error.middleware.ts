import { Request, Response, NextFunction } from 'express';
import { FRONTEND_URL } from '../config/constants';

export class AppError extends Error {
    statusCode: number;
    errors: any[];

    constructor(message: string, statusCode: number, errors: any[] = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err.stack);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const errors = err.errors || [];
    console.error('Full Error:', err);
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    console.error('Error Details:', err.errors);
    res.status(statusCode).json({
        status: 'error',
        message,
        errors: errors.length > 0 ? errors : undefined,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
    next(error);
};

export const handleSocialAuthError = (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
        const { error, error_description, provider } = req.query;
        
        console.error('Social Authentication Error:', {
        provider,
        error,
        description: error_description
        });
    
        res.redirect(
        `${FRONTEND_URL}/auth/error?` +
        `provider=${provider}&` +
        `error=${encodeURIComponent(error as string)}&` +
        `error_description=${encodeURIComponent(error_description as string)}`
        );
};