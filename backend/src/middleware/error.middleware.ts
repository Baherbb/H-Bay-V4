import { Request, Response, NextFunction } from 'express';

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
