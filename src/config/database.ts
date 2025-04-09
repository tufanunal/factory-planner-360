
/**
 * Database Configuration
 * Replace these values with your production database credentials
 * 
 * NOTE: This configuration is intended for use in a Node.js environment,
 * not directly in a browser. In a production setup, you would use these
 * values in server-side code.
 */
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'factoryplanner',
  ssl: process.env.DB_SSL === 'true'
};

/**
 * Connection pooling configuration
 */
export const poolConfig = {
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000 // How long to wait for a connection to become available
};

/**
 * BROWSER ENVIRONMENT NOTE:
 * 
 * The PostgreSQL client cannot be used directly in a browser environment
 * as it relies on Node.js specific features. In a production setup,
 * you would need to:
 * 
 * 1. Create a server-side API that connects to the database
 * 2. Deploy the application to a Node.js environment
 * 3. Set up proper authentication and security measures
 * 
 * During development, the application automatically falls back to
 * using localStorage for data persistence.
 */
