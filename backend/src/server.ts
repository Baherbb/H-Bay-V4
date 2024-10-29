import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import sequelize from './config/database';
import { errorHandler, notFound } from './middleware/error.middleware';



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
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(compression());
        
        if (process.env.NODE_ENV === 'development') {
            this.app.use(morgan('dev'));
        }

        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100 
        });
        this.app.use(limiter);
    }

    private initializeRoutes(): void {
        this.app.get('/health', (req: Request, res: Response) => {
            res.status(200).json({ status: 'ok', timestamp: new Date() });
        });
    }

    private initializeErrorHandling(): void {
        this.app.use(notFound);
        this.app.use(errorHandler);
    }

    private async connectDatabase(): Promise<void> {
        try {
            await sequelize.authenticate();
            console.log('Database Connected Successfully');
            console.log('SUiiii!');
            
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