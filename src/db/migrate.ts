import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { pool } from './index';


const runMigration = async () => {
    try {
        const db = drizzle(pool);

        console.log('Starting database migration...');
        await migrate(db, { migrationsFolder: './drizzle' });
        console.log('Database migration completed successfully');

        await pool.end();
    } catch (error) {
        console.log('Migration failed:', error);
        process.exit(1);
    }
};

runMigration();
