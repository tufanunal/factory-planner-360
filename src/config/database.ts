
/**
 * Database Configuration
 * Replace these values with your production database credentials
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
