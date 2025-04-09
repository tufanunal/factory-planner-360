
# Database Implementation Notes

## Browser vs Server Environment

The Factory Planner application has been designed with two database implementations:

1. **Browser Environment (Development/Testing)**: Uses localStorage for data persistence
   - Automatically used when running in a browser
   - Data is stored in the browser's localStorage
   - No server setup required

2. **Server Environment (Production)**: Uses PostgreSQL for data persistence
   - Requires a Node.js server environment
   - Requires PostgreSQL database setup
   - Provides true data persistence and multi-user support

## Production Setup Instructions

To use PostgreSQL in production:

1. Set up a PostgreSQL database server
2. Run the database setup script from `src/config/database-setup.sql`
3. Update the database configuration in `src/config/database.ts` with your credentials
4. Deploy the application to a Node.js environment (not a static site host)
5. Set the environment variable `USE_POSTGRES=true`

## PostgreSQL Integration Notes

The PostgreSQL client (`pg` package) is designed to run in a Node.js environment, not in browsers. When deploying to production:

1. Move the database connection logic to server-side code
2. Create API endpoints to interact with the database
3. Use the API from the frontend application

Alternatively, you can use a Backend-as-a-Service like Supabase which provides:
- PostgreSQL database
- Authentication
- API with Row Level Security
- Browser-compatible client library

## Development Workflow

During development:
- The application automatically uses localStorage
- Data persists between page refreshes but not between different browsers/computers
- You can clear the database using the debugging tools

For testing PostgreSQL integration:
- Set up a local PostgreSQL server
- Run the application in a Node.js environment, not directly in the browser
- Set environment variables as needed for database connection
