# Database Setup Guide

This project supports connections to PostgreSQL, Microsoft SQL Server, and MySQL databases.

## Quick Start

### 1. Start All Databases

```bash
./start-databases.sh
```

This will start PostgreSQL, SQL Server, and MySQL containers with proper configurations.

### 2. Start Application

```bash
./start.sh
# or
docker-compose up -d
```

## Database Connection Details

### PostgreSQL

- **Host**: `localhost` (from host) or `test-postgres` (from container)
- **Port**: 5432
- **Database**: testdb
- **Username**: testuser
- **Password**: testpass123

### Microsoft SQL Server

- **Host**: `localhost` (from host) or `test-mssql` (from container)
- **Port**: 1433
- **Database**: master
- **Username**: sa
- **Password**: MyPass123

### MySQL

- **Host**: `localhost` (from host) or `test-mysql` (from container)
- **Port**: 3306
- **Database**: testdb
- **Username**: testuser (or root)
- **Password**: testpass123 (or rootpass123 for root)

## Creating Connections via API

First, login to get a JWT token:

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.accessToken')
```

### PostgreSQL Connection

```bash
curl -X POST http://localhost:3000/api/connections \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "PostgreSQL Local",
    "type": "postgres",
    "host": "test-postgres",
    "port": 5432,
    "database": "testdb",
    "username": "testuser",
    "password": "testpass123",
    "max_connections": 10,
    "connection_timeout": 30000,
    "enable_ssl": false
  }'
```

### SQL Server Connection

```bash
curl -X POST http://localhost:3000/api/connections \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "SQL Server Local",
    "type": "mssql",
    "host": "test-mssql",
    "port": 1433,
    "database": "master",
    "username": "sa",
    "password": "MyPass123",
    "max_connections": 10,
    "connection_timeout": 30000,
    "enable_ssl": false
  }'
```

### MySQL Connection

```bash
curl -X POST http://localhost:3000/api/connections \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MySQL Local",
    "type": "mysql",
    "host": "test-mysql",
    "port": 3306,
    "database": "testdb",
    "username": "testuser",
    "password": "testpass123",
    "max_connections": 10,
    "connection_timeout": 30000,
    "enable_ssl": false
  }'
```

## Testing Connections

Test a connection:

```bash
curl -X POST http://localhost:3000/api/connections/{id}/test \
  -H "Authorization: Bearer $TOKEN"
```

Execute a query:

```bash
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 1,
    "query": "SELECT 1 as test",
    "parameters": []
  }'
```

## Docker Compose Files

### Main Application

- `docker-compose.yml` - Main Node.js application

### Databases

- `docker-compose-databases.yml` - PostgreSQL, SQL Server, and MySQL containers

## Management Commands

### Start everything

```bash
# Start databases
./start-databases.sh

# Start application
./start.sh
```

### Stop everything

```bash
# Stop application
docker-compose down

# Stop databases
docker-compose -f docker-compose-databases.yml down
```

### View logs

```bash
# Application logs
docker-compose logs -f app

# Database logs
docker-compose -f docker-compose-databases.yml logs -f
```

### Reset everything

```bash
# Stop and remove all containers and volumes
docker-compose down -v
docker-compose -f docker-compose-databases.yml down -v
rm -rf data/
```

## Troubleshooting

### SQL Server on M1/M2 Macs

SQL Server runs under x86 emulation on ARM-based Macs, which may cause slower performance. The container is configured with `platform: linux/amd64` to ensure compatibility.

### Connection Issues

If containers can't connect to databases:

1. Ensure all containers are on the same network (`node-server_default`)
2. Use container names (e.g., `test-postgres`) instead of `localhost` when connecting from the app container
3. Check that ports are not already in use: `lsof -i :5432` (PostgreSQL), `lsof -i :1433` (SQL Server), `lsof -i :3306` (MySQL)

### Rate Limiting

The API has rate limiting configured:

- Login: 50 attempts per 15 minutes
- API: 1000 requests per 15 minutes

To adjust, modify environment variables in `docker-compose.yml`:

- `RATE_LIMIT_LOGIN_MAX`
- `RATE_LIMIT_API_MAX`
- `RATE_LIMIT_WINDOW_MS`
