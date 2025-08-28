# Node.js Database Connection Manager

A Node.js server with SQLite for managing connections to external databases (PostgreSQL, MySQL, SQL Server).

## Quick Start (Dead Simple!)

### 1. Start the Node.js Server

```bash
# Start the server (automatic migrations, persistent SQLite storage)
docker-compose up -d

# Check if server is running
curl http://localhost:3000/health
```

That's it! The server is now running on `http://localhost:3000` with:

- ✅ Automatic SQLite database creation
- ✅ Automatic migrations (creates all required tables)
- ✅ Persistent data storage
- ✅ Default admin user created (admin/admin123)

**Database Tables Created Automatically:**

- `users` - User management and authentication
- `connections` - Database connection configurations
- `dashboards` - Dashboard configurations with widgets

### 2. (Optional) Start Test Databases

If you want to test database connections:

```bash
# Start PostgreSQL, MySQL, and SQL Server containers
docker-compose -f docker-compose-databases.yml up -d
```

## Architecture

```
┌─────────────────────────┐
│   Node.js Server        │
│   (Container 1)         │
│   - Express API         │
│   - SQLite (internal)   │
│   - Port: 3000          │
└───────────┬─────────────┘
            │
    Can connect to external
    databases via host network
            │
    ┌───────┴────────┬──────────┬──────────┐
    │                │          │          │
┌───▼────┐    ┌─────▼───┐  ┌───▼────┐  ┌──▼──────┐
│Postgres│    │  MySQL  │  │ MSSQL  │  │ Others  │
│ :5432  │    │  :3306  │  │ :1433  │  │   ...   │
└────────┘    └─────────┘  └────────┘  └─────────┘
```

## Features

- **Isolated Node.js Container**: Runs independently with its own SQLite database
- **Persistent Storage**: SQLite data persists across container restarts
- **External Database Connectivity**: Can connect to databases outside its container
- **Automatic Setup**: Migrations run automatically on startup
- **Health Checks**: Built-in health monitoring
- **JWT Authentication**: Secure API access
- **Dashboard Management**: Create and manage custom dashboards with widgets
- **Query Execution**: Execute SQL queries on connected databases
- **Multi-Database Support**: PostgreSQL, MySQL, and SQL Server

## API Endpoints

### Authentication

```bash
# Login (returns JWT token)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Managing Connections

```bash
# Get token first
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.accessToken')

# Create a connection
curl -X POST http://localhost:3000/api/connections \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My PostgreSQL",
    "type": "postgres",
    "host": "host.docker.internal",  # Use this for localhost databases
    "port": 5432,
    "database": "mydb",
    "username": "user",
    "password": "pass"
  }'

# List all connections
curl -X GET http://localhost:3000/api/connections \
  -H "Authorization: Bearer $TOKEN"

# Test a connection
curl -X POST http://localhost:3000/api/connections/{id}/test \
  -H "Authorization: Bearer $TOKEN"

# Execute a query
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 1,
    "query": "SELECT * FROM users LIMIT 10"
  }'
```

### Managing Dashboards

```bash
# Create a dashboard
curl -X POST http://localhost:3000/api/dashboards \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sales Dashboard",
    "description": "Monthly sales metrics",
    "connection_id": 1,
    "is_public": true,
    "configuration": {
      "theme": "dark",
      "widgets": [
        {
          "id": "w1",
          "type": "chart",
          "title": "Revenue Trend",
          "query": "SELECT date, revenue FROM sales"
        }
      ]
    }
  }'

# List all dashboards
curl -X GET http://localhost:3000/api/dashboards \
  -H "Authorization: Bearer $TOKEN"

# Get dashboard statistics
curl -X GET http://localhost:3000/api/dashboards/statistics \
  -H "Authorization: Bearer $TOKEN"
```

## Database Connection Examples

### Connect to Databases on Host Machine

Use `host.docker.internal` as the hostname:

```json
{
  "host": "host.docker.internal",
  "port": 5432
}
```

### Connect to Databases in Other Containers

Use the container name or IP:

```json
{
  "host": "test-postgres", // Container name
  "port": 5432
}
```

### Connect to Remote Databases

Use the actual hostname/IP:

```json
{
  "host": "db.example.com",
  "port": 5432
}
```

## Default Credentials

### Test Databases (from docker-compose-databases.yml)

| Database   | Username | Password    | Database | Port |
| ---------- | -------- | ----------- | -------- | ---- |
| PostgreSQL | testuser | testpass123 | testdb   | 5432 |
| MySQL      | testuser | testpass123 | testdb   | 3306 |
| SQL Server | sa       | MyPass123   | master   | 1433 |

### API Admin User

- Username: `admin`
- Password: `admin123`

## Management Commands

```bash
# View logs
docker-compose logs -f

# Stop the server
docker-compose down

# Stop and remove data
docker-compose down -v

# Rebuild after code changes
docker-compose build --no-cache
docker-compose up -d

# Check container status
docker ps

# Execute commands in container
docker exec -it nodejs-server sh
```

## Environment Variables

You can customize these in `docker-compose.yml`:

- `PORT`: Server port (default: 3000)
- `DB_PATH`: SQLite database path
- `JWT_SECRET`: JWT signing secret
- `DEFAULT_USER`: Default admin username
- `DEFAULT_PASSWORD`: Default admin password

## Troubleshooting

### Server not starting?

```bash
docker-compose logs app
```

### Can't connect to external database?

1. Check if database is running: `telnet <host> <port>`
2. Verify credentials
3. For localhost databases, use `host.docker.internal`

### Data not persisting?

Check volume is created:

```bash
docker volume ls | grep nodejs-server-sqlite
```

## Database Schema

### Tables Created on Startup

1. **users**

   - `id` (INTEGER, Primary Key)
   - `username` (VARCHAR, Unique)
   - `email` (VARCHAR, Unique)
   - `password` (VARCHAR, Hashed)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

2. **connections**

   - `id` (INTEGER, Primary Key)
   - `name` (VARCHAR)
   - `type` (VARCHAR: postgres/mysql/mssql)
   - `host` (VARCHAR)
   - `port` (INTEGER)
   - `database` (VARCHAR)
   - `username` (VARCHAR)
   - `password` (VARCHAR, Encrypted)
   - `max_connections` (INTEGER)
   - `is_active` (BOOLEAN)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

3. **dashboards**
   - `id` (INTEGER, Primary Key)
   - `name` (VARCHAR)
   - `description` (TEXT)
   - `configuration` (TEXT, JSON)
   - `connection_id` (INTEGER, Foreign Key)
   - `created_by` (INTEGER, Foreign Key)
   - `is_public` (BOOLEAN)
   - `is_active` (BOOLEAN)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

## Development

### Local Development (without Docker)

```bash
# Install dependencies
npm install

# Run migrations
npm run migrate

# Start server
npm start
```

### Running Tests

```bash
# Start all services
docker-compose up -d
docker-compose -f docker-compose-databases.yml up -d

# Test all APIs (from API_DOCUMENTATION.md)
curl -s https://raw.githubusercontent.com/your-repo/main/test-suite.sh | bash

# Or run individual test scripts
./test-connections.sh
./test-dashboards.sh
```

### API Documentation

For complete API documentation with all endpoints and examples, see:

- `API_DOCUMENTATION.md` - Comprehensive API reference
- Includes test scripts for all endpoints
- Examples for CRUD operations on all databases

## Migrations

Migrations run automatically when the container starts. The following migrations are executed in order:

1. `20250118_create_users_table.js` - Creates users table with authentication fields
2. `20250119_create_connections_table.js` - Creates connections table for database configs
3. `20250120_create_dashboards_table.js` - Creates dashboards table for dashboard management

To add new migrations:

1. Create a new file in `src/migrations/` with format `YYYYMMDD_description.js`
2. Export `up` and `down` functions
3. Rebuild the container: `docker-compose build --no-cache && docker-compose up -d`

## Security Notes

⚠️ **For production use:**

- Change JWT_SECRET and JWT_REFRESH_SECRET
- Use strong passwords
- Enable SSL for database connections
- Use environment-specific .env files
- Never commit secrets to repository
- Passwords in connections table are encrypted
- Dashboard access control based on user ownership

## License

MIT
