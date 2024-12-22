import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'ecommerce';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '5432');
const DB_SSL = process.env.DB_SSL === 'true';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    dialectOptions: DB_SSL
        ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            }
        : {},
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

export default sequelize;
