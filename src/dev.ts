import app from './app';
import { config } from './config/config';
import { pool } from './db';

const startDevServer = async () => {
    try {
        // Verify database connection
        await pool.query('SELECT 1');
        console.log('Database connected successfully');

        // Start express server
        const server = app.listen(3000, '0.0.0.0', () => {
            console.log(`Development server is running at http://0.0.0.0:3000`);
        });

        // Handle graceful shutdown
        const shutdown = async () => {
            server.close(async () => {
                await pool.end();
                console.log('Server and database connections closed');
                process.exit(0);
            });
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    } catch (error) {
        console.log('Failed to start development server:', error);
        process.exit(1);
    }
};

startDevServer();