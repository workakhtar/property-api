import app from './app';
import { config } from './config/config';
import { pool } from './db';

// Start express server after ensuring database connection
const startServer = async () => {
  try {
    // Verify database connection
    await pool.query('SELECT 1');
    console.log('Database connected successfully');

    // Start express server
    const server = app.listen(config.port, '0.0.0.0', () => {
      console.log(`Server is running at http://0.0.0.0:${config.port}`);
    });

    // Graceful shutdown handling
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received. Closing HTTP server');
      server.close(async () => {
        await pool.end();
        console.log('Database pool & HTTP server closed');
        process.exit(0);
      });
    });

    process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
      console.log('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (error: Error) => {
      console.log('Uncaught Exception:', error);
      server.close(async () => {
        await pool.end();
        process.exit(1);
      });
    });
  } catch (error: unknown) {
    console.log('Failed to start server:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
};

// Start the server
startServer();