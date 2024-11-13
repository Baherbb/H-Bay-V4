import dotenv from 'dotenv';
dotenv.config();

import server from './server';

server.start().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
