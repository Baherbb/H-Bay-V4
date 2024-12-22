import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import passport from './config/passport';
import sequelize from './config/database';

import { authMiddleware } from './middleware/auth.middleware';
import { apiLimiter, authLimiter, createAccountLimiter } from './middleware/rate-limit.middleware';
import { errorHandler, notFound } from './middleware/error.middleware';

import { initAssociations } from './models/associations.model';

import routes from './routes/category.routes';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import wishlistRoutes from './routes/wishlist.routes';
import brandRoutes from './routes/brand.routes';
import cartRoutes from './routes/cart.routes';
import userRoutes from './routes/user.routes';
import paymentRoutes from './routes/payment.routes';
import notificationRoutes from './routes/notification.routes';
import orderRoutes from './routes/order.routes';
import path from 'path';


class Server {
    public app: Application;
    private port: number;

    constructor() {
        this.app = express();
        this.port = Number(process.env.PORT) || 3000;
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private initializeMiddlewares(): void {
        this.app.use(helmet());
        this.app.use(cors({
            origin: process.env.FRONTEND_URL || 'http://localhost:3001',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            exposedHeaders: ['Content-Length', 'X-Requested-With'],
            maxAge: 86400,
        }));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(compression());



        this.app.use('/api/', apiLimiter);
        // this.app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
        this.app.use('/api/profile-pictures', express.static(path.join(__dirname, '../../uploads/profile-pictures')));

        this.app.use(session({
            secret: process.env.SESSION_SECRET!,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            }
        }));

        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(cookieParser());
        
        if (process.env.NODE_ENV === 'development') {
            this.app.use(morgan('dev'));
        }
    }


    private initializeRoutes(): void {
        this.app.get('/health', (req: Request, res: Response) => {
            res.status(200).json({ status: 'ok', timestamp: new Date() });
        });
        this.app.use('/api/products', productRoutes);
        this.app.use('/api/categories', routes);
        this.app.use('/api/user', userRoutes);
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/wishlist', wishlistRoutes)
        this.app.use('/api/brands', brandRoutes)
        this.app.use('/api/cart', authMiddleware, cartRoutes);
        this.app.use('/api/payments', paymentRoutes);
        this.app.use('/api/notification', notificationRoutes);
        this.app.use('/api/orders', orderRoutes);    }

    private initializeErrorHandling(): void {
        this.app.use(notFound);
        this.app.use(errorHandler);
    }


    private async connectDatabase(): Promise<void> {
        try {
            await sequelize.authenticate();
            console.log('Database Connected Successfully');
            console.log('SUiiii!');
            initAssociations();

            if (process.env.NODE_ENV === 'development') {
                await sequelize.sync({ alter: true });
                console.log('Database synced successfully.');
            }
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            process.exit(1);
        }
    }

    private setupGracefulShutdown(): void {
        process.on('SIGTERM', () => {
            console.log('SIGTERM received. Shutting down gracefully...');
            sequelize.close().then(() => {
                console.log('Database connection closed.');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            console.log('SIGINT received. Shutting down gracefully...');
            sequelize.close().then(() => {
                console.log('Database connection closed.');
                process.exit(0);
            });
        });
    }

    public async start(): Promise<void> {
        try {
            await this.connectDatabase();
            this.setupGracefulShutdown();

            this.app.listen(this.port, () => {
                console.log(`Server running on port ${this.port}`);
                console.log(`Environment: ${process.env.NODE_ENV}`);
            });
        } catch (error) {
            console.error('Error starting server:', error);
            process.exit(1);
        }
    }
}

const server = new Server();
export default server;