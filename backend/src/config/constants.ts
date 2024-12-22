import Joi from 'joi';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = Joi.object({
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().default('24h'),
    GOOGLE_CLIENT_ID: Joi.string().required(),
    GOOGLE_CLIENT_SECRET: Joi.string().required(),
    GOOGLE_CALLBACK_URL: Joi.string().default('http://localhost:3000/api/auth/google/callback'),
    FRONTEND_URL: Joi.string().default('http://localhost:3000'),
    SESSION_SECRET: Joi.string().required(),
    SESSION_MAX_AGE: Joi.number().default(3600000),
    FACEBOOK_APP_ID: Joi.string().required(),
    FACEBOOK_APP_SECRET: Joi.string().required(),
    FACEBOOK_CALLBACK_URL: Joi.string().default('http://localhost:3000/api/auth/facebook/callback'),
    REFRESH_TOKEN_SECRET: Joi.string().required(),
    SMTP_HOST: Joi.string().default('smtp.gmail.com'),
    SMTP_PORT: Joi.number().default(587),
    SMTP_USER: Joi.string().required(),
    SMTP_PASS: Joi.string().required(),
    SUPER_ADMIN_EMAIL: Joi.string().email().required(),
    SUPER_ADMIN_PASSWORD: Joi.string().min(8).required(),
}).unknown(); // Allow unknown environment variables 


const { error, value: env } = envSchema.validate(process.env);

if (error) {
    console.error('Environment variable validation failed:', error.message);
    process.exit(1); 
}

export const {
    JWT_SECRET,
    JWT_EXPIRES_IN,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
    FRONTEND_URL,
    SESSION_SECRET,
    SESSION_MAX_AGE,
    FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET,
    FACEBOOK_CALLBACK_URL,
    REFRESH_TOKEN_SECRET,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD,
    REDIS_URL,
    USE_REDIS,
} = env;

