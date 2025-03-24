import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { config } from '../config/config';


// Create a PostgreSQL pool with SSL configuration
const pool = new Pool({
  ...config.database,
  ssl: false
});

// Test the connection
pool.connect()
  .then(() => {
    console.log('Database connection pool established successfully');
  })
  .catch((error: Error) => {
    console.log('Failed to establish database connection:', error);
    process.exit(1);
  });

// Create and export the drizzle database instance
export const db = drizzle(pool);

// Export pool for direct access if needed
export { pool };