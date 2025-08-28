# API Documentation

Complete API documentation for the Node.js Database Connection Manager with exhaustive tests and usage examples.

## Base URL

```
http://localhost:3000
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## 1. AUTHENTICATION APIs

### 1.1 Login

**Endpoint:** `POST /api/auth/login`  
**Description:** Authenticate user and receive JWT tokens  
**Authentication:** Not required

#### Request Body:

```json
{
  "username": "string",
  "password": "string"
}
```

#### Success Response (200):

```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2025-08-19T10:18:48.000Z",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

#### Error Responses:

- **401 Unauthorized:** Invalid credentials

```json
{
  "error": "Invalid credentials"
}
```

- **400 Bad Request:** Missing fields

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Password is required",
      "path": "password",
      "location": "body"
    }
  ]
}
```

#### Test Examples:

```bash
# Valid login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Invalid password
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrongpass"}'

# Non-existent user
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"nonexistent","password":"pass123"}'

# Missing password field
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin"}'
```

---

### 1.2 Refresh Token

**Endpoint:** `POST /api/auth/refresh`  
**Description:** Get new access token using refresh token  
**Authentication:** Not required

#### Request Body:

```json
{
  "refreshToken": "string"
}
```

#### Success Response (200):

```json
{
  "message": "Token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2025-08-19T10:19:07.000Z"
}
```

#### Error Responses:

- **401 Unauthorized:** Invalid token

```json
{
  "error": "Invalid refresh token"
}
```

- **400 Bad Request:** Missing token

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Refresh token is required",
      "path": "refreshToken",
      "location": "body"
    }
  ]
}
```

#### Test Examples:

```bash
# Valid refresh token
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"your-refresh-token-here"}'

# Invalid token
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"invalid.token.here"}'

# Missing token
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

### 1.3 Logout

**Endpoint:** `POST /api/auth/logout`  
**Description:** Logout current user  
**Authentication:** Optional

#### Success Response (200):

```json
{
  "message": "Logout successful"
}
```

#### Test Examples:

```bash
# Logout with token
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer your-access-token"

# Logout without token (still succeeds)
curl -X POST http://localhost:3000/api/auth/logout
```

---

## 2. USER MANAGEMENT APIs

### 2.1 Get All Users

**Endpoint:** `GET /api/users`  
**Description:** Retrieve all users  
**Authentication:** Required

#### Success Response (200):

```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "created_at": "2025-08-19 10:11:54",
    "updated_at": "2025-08-19 10:11:54"
  }
]
```

#### Error Response:

- **401 Unauthorized:** No token provided

```json
{
  "error": "Access token required"
}
```

#### Test Examples:

```bash
# Get all users with valid token
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer your-access-token"

# Try without token
curl -X GET http://localhost:3000/api/users
```

---

### 2.2 Get User by ID

**Endpoint:** `GET /api/users/:id`  
**Description:** Get specific user details  
**Authentication:** Required

#### URL Parameters:

- `id` (integer): User ID

#### Success Response (200):

```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "created_at": "2025-08-19 10:11:54",
  "updated_at": "2025-08-19 10:11:54"
}
```

#### Error Response:

- **404 Not Found:** User not found

```json
{
  "error": "User not found"
}
```

#### Test Examples:

```bash
# Get existing user
curl -X GET http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer your-access-token"

# Get non-existent user
curl -X GET http://localhost:3000/api/users/999 \
  -H "Authorization: Bearer your-access-token"
```

---

### 2.3 Get Current User

**Endpoint:** `GET /api/users/me`  
**Description:** Get current authenticated user  
**Authentication:** Required

#### Success Response (200):

```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "created_at": "2025-08-19 10:11:54",
  "updated_at": "2025-08-19 10:11:54"
}
```

#### Test Example:

```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer your-access-token"
```

---

### 2.4 Create User

**Endpoint:** `POST /api/users`  
**Description:** Create a new user  
**Authentication:** Required

#### Request Body:

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Success Response (201):

```json
{
  "message": "User created successfully",
  "user": {
    "id": 2,
    "username": "testuser",
    "email": "testuser@example.com",
    "created_at": "2025-08-19 10:15:03"
  }
}
```

#### Error Responses:

- **400 Bad Request:** Validation errors
- **409 Conflict:** Username already exists

#### Test Examples:

```bash
# Create valid user
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer your-access-token" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "SecurePass123"
  }'

# Try duplicate username
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer your-access-token" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "another@example.com",
    "password": "Pass123"
  }'
```

---

### 2.5 Update User

**Endpoint:** `PUT /api/users/:id`  
**Description:** Update user information  
**Authentication:** Required

#### URL Parameters:

- `id` (integer): User ID

#### Request Body (all fields optional):

```json
{
  "email": "string",
  "username": "string"
}
```

#### Success Response (200):

```json
{
  "message": "User updated successfully",
  "user": {
    "id": 2,
    "username": "testuser",
    "email": "updated@example.com"
  }
}
```

#### Test Example:

```bash
curl -X PUT http://localhost:3000/api/users/2 \
  -H "Authorization: Bearer your-access-token" \
  -H "Content-Type: application/json" \
  -d '{"email": "newemail@example.com"}'
```

---

### 2.6 Delete User

**Endpoint:** `DELETE /api/users/:id`  
**Description:** Delete a user  
**Authentication:** Required

#### URL Parameters:

- `id` (integer): User ID

#### Success Response (200):

```json
{
  "message": "User deleted successfully"
}
```

#### Test Example:

```bash
curl -X DELETE http://localhost:3000/api/users/2 \
  -H "Authorization: Bearer your-access-token"
```

---

## 3. DATABASE CONNECTION APIs

### 3.1 Get All Connections

**Endpoint:** `GET /api/connections`  
**Description:** List all database connections  
**Authentication:** Required

#### Success Response (200):

```json
[
  {
    "id": 1,
    "name": "Test PostgreSQL",
    "type": "postgres",
    "host": "host.docker.internal",
    "port": 5432,
    "database": "testdb",
    "username": "testuser",
    "max_connections": 10,
    "connection_timeout": 30000,
    "enable_ssl": 0,
    "is_active": 1,
    "last_connected_at": "2025-08-19 10:30:00",
    "created_at": "2025-08-19 10:27:24",
    "updated_at": "2025-08-19 10:27:24"
  }
]
```

#### Test Example:

```bash
curl -X GET http://localhost:3000/api/connections \
  -H "Authorization: Bearer your-access-token"
```

---

### 3.2 Get Connection by ID

**Endpoint:** `GET /api/connections/:id`  
**Description:** Get specific connection details  
**Authentication:** Required

#### URL Parameters:

- `id` (integer): Connection ID

#### Success Response (200):

```json
{
  "id": 1,
  "name": "Test PostgreSQL",
  "type": "postgres",
  "host": "host.docker.internal",
  "port": 5432,
  "database": "testdb",
  "username": "testuser",
  "max_connections": 10,
  "connection_timeout": 30000,
  "enable_ssl": 0,
  "is_active": 1,
  "options": null,
  "last_connected_at": "2025-08-19 10:30:00",
  "created_at": "2025-08-19 10:27:24",
  "updated_at": "2025-08-19 10:27:24"
}
```

#### Test Example:

```bash
curl -X GET http://localhost:3000/api/connections/1 \
  -H "Authorization: Bearer your-access-token"
```

---

### 3.3 Create Connection

**Endpoint:** `POST /api/connections`  
**Description:** Create a new database connection  
**Authentication:** Required

#### Request Body:

```json
{
  "name": "string",
  "type": "postgres|mysql|mssql",
  "host": "string",
  "port": "integer",
  "database": "string",
  "username": "string",
  "password": "string",
  "max_connections": "integer (optional, default: 10)",
  "connection_timeout": "integer (optional, default: 30000)",
  "enable_ssl": "boolean (optional, default: false)",
  "options": "object (optional)"
}
```

#### Success Response (201):

```json
{
  "message": "Connection created successfully",
  "connection": {
    "id": 1,
    "name": "Test PostgreSQL",
    "type": "postgres",
    "host": "host.docker.internal",
    "port": 5432,
    "database": "testdb",
    "username": "testuser",
    "max_connections": 10,
    "connection_timeout": 30000,
    "enable_ssl": 0,
    "is_active": 1,
    "options": null,
    "last_connected_at": null,
    "created_at": "2025-08-19 10:27:24",
    "updated_at": "2025-08-19 10:27:24"
  }
}
```

#### Error Responses:

- **400 Bad Request:** Validation errors

```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid_type",
      "msg": "Database type must be mssql, postgres, or mysql",
      "path": "type",
      "location": "body"
    }
  ]
}
```

#### Test Examples:

```bash
# Create PostgreSQL connection
curl -X POST http://localhost:3000/api/connections \
  -H "Authorization: Bearer your-access-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production PostgreSQL",
    "type": "postgres",
    "host": "host.docker.internal",
    "port": 5432,
    "database": "proddb",
    "username": "dbuser",
    "password": "securepass"
  }'

# Create MySQL connection
curl -X POST http://localhost:3000/api/connections \
  -H "Authorization: Bearer your-access-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Analytics MySQL",
    "type": "mysql",
    "host": "mysql.example.com",
    "port": 3306,
    "database": "analytics",
    "username": "analyst",
    "password": "pass123"
  }'

# Create SQL Server connection
curl -X POST http://localhost:3000/api/connections \
  -H "Authorization: Bearer your-access-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Legacy MSSQL",
    "type": "mssql",
    "host": "10.0.0.5",
    "port": 1433,
    "database": "LegacyDB",
    "username": "sa",
    "password": "SqlPass@123"
  }'

# Invalid connection type
curl -X POST http://localhost:3000/api/connections \
  -H "Authorization: Bearer your-access-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid DB",
    "type": "oracle",
    "host": "localhost",
    "port": 1521
  }'
```

---

### 3.4 Update Connection

**Endpoint:** `PUT /api/connections/:id`  
**Description:** Update connection details  
**Authentication:** Required

#### URL Parameters:

- `id` (integer): Connection ID

#### Request Body (all fields optional):

```json
{
  "name": "string",
  "host": "string",
  "port": "integer",
  "database": "string",
  "username": "string",
  "password": "string",
  "max_connections": "integer",
  "connection_timeout": "integer",
  "enable_ssl": "boolean",
  "options": "object"
}
```

#### Success Response (200):

```json
{
  "message": "Connection updated successfully",
  "connection": {
    "id": 1,
    "name": "Updated PostgreSQL",
    "type": "postgres",
    "host": "new-host.docker.internal",
    "port": 5432,
    "database": "testdb",
    "username": "testuser",
    "max_connections": 20,
    "connection_timeout": 30000,
    "enable_ssl": 0,
    "is_active": 1,
    "options": null,
    "last_connected_at": "2025-08-19 10:30:00",
    "created_at": "2025-08-19 10:27:24",
    "updated_at": "2025-08-19 10:35:00"
  }
}
```

#### Test Example:

```bash
curl -X PUT http://localhost:3000/api/connections/1 \
  -H "Authorization: Bearer your-access-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Connection Name",
    "max_connections": 25,
    "enable_ssl": true
  }'
```

---

### 3.5 Delete Connection

**Endpoint:** `DELETE /api/connections/:id`  
**Description:** Delete a database connection  
**Authentication:** Required

#### URL Parameters:

- `id` (integer): Connection ID

#### Success Response (200):

```json
{
  "message": "Connection deleted successfully"
}
```

#### Test Example:

```bash
curl -X DELETE http://localhost:3000/api/connections/1 \
  -H "Authorization: Bearer your-access-token"
```

---

### 3.6 Test Connection

**Endpoint:** `POST /api/connections/:id/test`  
**Description:** Test if a database connection is working  
**Authentication:** Required

#### URL Parameters:

- `id` (integer): Connection ID

#### Success Response (200):

```json
{
  "success": true,
  "status": "connected",
  "name": "Test PostgreSQL",
  "message": "Connection successful",
  "version": {
    "version": "PostgreSQL 16.10 on aarch64-unknown-linux-musl, compiled by gcc (Alpine 14.2.0) 14.2.0, 64-bit"
  }
}
```

#### Error Response:

```json
{
  "success": false,
  "status": "failed",
  "name": "Test PostgreSQL",
  "message": "Connection failed",
  "error": "password authentication failed for user \"testuser\""
}
```

#### Test Examples:

```bash
# Test working connection
curl -X POST http://localhost:3000/api/connections/1/test \
  -H "Authorization: Bearer your-access-token"

# Test with wrong credentials (after update)
curl -X PUT http://localhost:3000/api/connections/1 \
  -H "Authorization: Bearer your-access-token" \
  -H "Content-Type: application/json" \
  -d '{"password": "wrongpassword"}'

curl -X POST http://localhost:3000/api/connections/1/test \
  -H "Authorization: Bearer your-access-token"
```

---

## 4. DATABASE QUERY EXECUTION API

### 4.1 Execute Query

**Endpoint:** `POST /api/connections/query`  
**Description:** Execute SQL queries on connected databases  
**Authentication:** Required

#### Request Body:

```json
{
  "connectionId": "integer",
  "query": "string",
  "parameters": "array (optional)"
}
```

#### Success Response (200):

```json
{
  "success": true,
  "connection": {
    "id": 1,
    "name": "Test PostgreSQL",
    "type": "postgres"
  },
  "result": {
    "rows": [...],
    "rowCount": 2,
    "fields": ["column1", "column2"],
    "executionTime": "23ms"
  }
}
```

#### Error Response:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Stack trace"
}
```

---

## 5. COMPREHENSIVE QUERY EXAMPLES

### 5.1 PostgreSQL Queries

#### Create Table

```bash
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 1,
    "query": "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE, age INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
  }'
```

#### Insert Data (with parameters)

```bash
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 1,
    "query": "INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *",
    "parameters": ["John Doe", "john@example.com", 30]
  }'
```

#### Select Data

```bash
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 1,
    "query": "SELECT * FROM users WHERE age > $1 ORDER BY created_at DESC",
    "parameters": [25]
  }'
```

#### Update Data

```bash
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 1,
    "query": "UPDATE users SET age = age + 1 WHERE email = $1 RETURNING *",
    "parameters": ["john@example.com"]
  }'
```

#### Delete Data

```bash
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 1,
    "query": "DELETE FROM users WHERE id = $1 RETURNING name, email",
    "parameters": [1]
  }'
```

#### Complex Queries

```bash
# Join query
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 1,
    "query": "SELECT u.name, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.id, u.name"
  }'

# Transaction example (multiple statements)
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 1,
    "query": "BEGIN; UPDATE accounts SET balance = balance - 100 WHERE id = 1; UPDATE accounts SET balance = balance + 100 WHERE id = 2; COMMIT;"
  }'
```

### 5.2 MySQL Queries

#### Create Table

```bash
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 2,
    "query": "CREATE TABLE IF NOT EXISTS products (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), price DECIMAL(10,2), stock INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
  }'
```

#### Insert Data (with parameters)

```bash
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 2,
    "query": "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)",
    "parameters": ["Laptop", 999.99, 10]
  }'
```

#### Select with JOIN

```bash
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 2,
    "query": "SELECT p.*, c.name as category_name FROM products p INNER JOIN categories c ON p.category_id = c.id WHERE p.price BETWEEN ? AND ?",
    "parameters": [100, 1000]
  }'
```

#### Update with LIMIT

```bash
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 2,
    "query": "UPDATE products SET stock = stock - 1 WHERE name = ? AND stock > 0 LIMIT 1",
    "parameters": ["Laptop"]
  }'
```

#### Delete with Subquery

```bash
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 2,
    "query": "DELETE FROM products WHERE id IN (SELECT id FROM (SELECT id FROM products WHERE stock = 0 AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)) AS tmp)"
  }'
```

### 5.3 SQL Server Queries

#### Create Table

```bash
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 3,
    "query": "IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='orders' AND xtype='U') CREATE TABLE orders (id INT IDENTITY(1,1) PRIMARY KEY, customer_name NVARCHAR(100), product NVARCHAR(100), quantity INT, total_amount DECIMAL(10,2), order_date DATETIME DEFAULT GETDATE())"
  }'
```

#### Insert with OUTPUT clause

```bash
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 3,
    "query": "INSERT INTO orders (customer_name, product, quantity, total_amount) OUTPUT INSERTED.* VALUES ('Alice Johnson', 'Laptop', 2, 1999.98)"
  }'
```

#### Select with TOP and ORDER BY

```bash
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 3,
    "query": "SELECT TOP 10 * FROM orders WHERE total_amount > 500 ORDER BY order_date DESC"
  }'
```

#### Update with OUTPUT

```bash
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 3,
    "query": "UPDATE orders SET quantity = quantity + 1 OUTPUT INSERTED.*, DELETED.quantity as old_quantity WHERE customer_name = 'Alice Johnson'"
  }'
```

#### Delete with OUTPUT

```bash
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 3,
    "query": "DELETE FROM orders OUTPUT DELETED.* WHERE order_date < DATEADD(day, -30, GETDATE())"
  }'
```

#### Common Table Expression (CTE)

```bash
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 3,
    "query": "WITH OrderSummary AS (SELECT customer_name, SUM(total_amount) as total_spent, COUNT(*) as order_count FROM orders GROUP BY customer_name) SELECT * FROM OrderSummary WHERE total_spent > 1000"
  }'
```

### 5.4 Advanced Query Examples

#### Aggregation Queries

```bash
# PostgreSQL - Window Functions
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 1,
    "query": "SELECT name, age, AVG(age) OVER (PARTITION BY department) as dept_avg_age, ROW_NUMBER() OVER (ORDER BY age DESC) as age_rank FROM employees"
  }'

# MySQL - Group By with HAVING
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 2,
    "query": "SELECT category_id, COUNT(*) as product_count, AVG(price) as avg_price FROM products GROUP BY category_id HAVING COUNT(*) > 5"
  }'

# SQL Server - PIVOT
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 3,
    "query": "SELECT * FROM (SELECT customer_name, MONTH(order_date) as month, total_amount FROM orders) AS SourceTable PIVOT (SUM(total_amount) FOR month IN ([1], [2], [3], [4], [5], [6])) AS PivotTable"
  }'
```

#### Schema Queries

```bash
# PostgreSQL - List all tables
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 1,
    "query": "SELECT table_name, table_type FROM information_schema.tables WHERE table_schema = 'public'"
  }'

# MySQL - Show table structure
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 2,
    "query": "DESCRIBE products"
  }'

# SQL Server - List columns
curl -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 3,
    "query": "SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'orders'"
  }'
```

### 5.5 Best Practices for Query Execution

#### 1. Use Parameterized Queries

**Good:**

```json
{
  "query": "SELECT * FROM users WHERE email = $1",
  "parameters": ["user@example.com"]
}
```

**Bad (SQL Injection Risk):**

```json
{
  "query": "SELECT * FROM users WHERE email = 'user@example.com'"
}
```

#### 2. Limit Result Sets

```json
{
  "query": "SELECT * FROM large_table LIMIT 100"
}
```

#### 3. Use Transactions for Multiple Operations

```json
{
  "query": "BEGIN; INSERT INTO audit_log ...; UPDATE records ...; COMMIT;"
}
```

#### 4. Handle Errors Gracefully

```javascript
const executeQuery = async (connectionId, query, parameters) => {
  try {
    const response = await fetch('/api/connections/query', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ connectionId, query, parameters }),
    })

    const result = await response.json()

    if (!result.success) {
      console.error('Query failed:', result.error)
      // Handle error appropriately
    }

    return result
  } catch (error) {
    console.error('Network error:', error)
    // Handle network error
  }
}
```

### 5.6 Parameter Binding by Database Type

| Database   | Parameter Style      | Example                         |
| ---------- | -------------------- | ------------------------------- |
| PostgreSQL | $1, $2, $3...        | `WHERE id = $1 AND name = $2`   |
| MySQL      | ?                    | `WHERE id = ? AND name = ?`     |
| SQL Server | @p0, @p1... or named | `WHERE id = @p0 AND name = @p1` |

**Note:** SQL Server parameter binding through the API may require adjustments. For complex queries, consider using stored procedures or direct SQL without parameters.

---

## 6. DASHBOARD MANAGEMENT APIs

### 6.1 Create Dashboard

**Endpoint:** `POST /api/dashboards`  
**Description:** Create a new dashboard  
**Authentication:** Required

#### Request Body:

```json
{
  "name": "string (required)",
  "description": "string (optional, max 1000 chars)",
  "configuration": "object (optional)",
  "connection_id": "integer (optional)",
  "is_public": "boolean (optional, default: false)",
  "is_active": "boolean (optional, default: true)"
}
```

#### Success Response (201):

```json
{
  "message": "Dashboard created successfully",
  "dashboard": {
    "id": 1,
    "name": "Sales Dashboard",
    "description": "Monthly sales performance metrics",
    "configuration": {
      "theme": "dark",
      "refresh_interval": 30,
      "widgets": [...]
    },
    "connection_id": 1,
    "created_by": 1,
    "is_public": true,
    "is_active": true,
    "created_at": "2025-08-19 11:11:00",
    "updated_at": "2025-08-19 11:11:00"
  }
}
```

#### Test Examples:

```bash
# Create dashboard with full configuration
curl -X POST http://localhost:3000/api/dashboards \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sales Dashboard",
    "description": "Monthly sales performance metrics",
    "connection_id": 1,
    "is_public": true,
    "configuration": {
      "theme": "dark",
      "refresh_interval": 30,
      "widgets": [
        {
          "id": "w1",
          "type": "chart",
          "title": "Revenue Trend",
          "query": "SELECT date, revenue FROM sales ORDER BY date"
        },
        {
          "id": "w2",
          "type": "table",
          "title": "Top Products",
          "query": "SELECT product, sales FROM products ORDER BY sales DESC LIMIT 10"
        },
        {
          "id": "w3",
          "type": "kpi",
          "title": "Total Revenue",
          "query": "SELECT SUM(revenue) as total FROM sales"
        }
      ]
    }
  }'

# Create minimal dashboard
curl -X POST http://localhost:3000/api/dashboards \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Analytics Dashboard",
    "description": "User behavior analytics"
  }'
```

---

### 6.2 Get All Dashboards

**Endpoint:** `GET /api/dashboards`  
**Description:** Retrieve all dashboards with optional filters  
**Authentication:** Required

#### Query Parameters:

- `is_active` (boolean): Filter by active status
- `is_public` (boolean): Filter by public status
- `created_by` (integer): Filter by creator user ID
- `connection_id` (integer): Filter by connection ID
- `search` (string): Search in name and description

#### Success Response (200):

```json
{
  "count": 2,
  "dashboards": [
    {
      "id": 1,
      "name": "Sales Dashboard",
      "description": "Monthly sales performance metrics",
      "configuration": {...},
      "connection_id": 1,
      "connection_name": "PostgreSQL Test",
      "connection_type": "postgres",
      "created_by": 1,
      "created_by_username": "admin",
      "is_public": true,
      "is_active": true,
      "created_at": "2025-08-19 11:11:00",
      "updated_at": "2025-08-19 11:11:00"
    }
  ]
}
```

#### Test Examples:

```bash
# Get all dashboards
curl -X GET http://localhost:3000/api/dashboards \
  -H "Authorization: Bearer $TOKEN"

# Filter by public dashboards
curl -X GET "http://localhost:3000/api/dashboards?is_public=true" \
  -H "Authorization: Bearer $TOKEN"

# Search dashboards
curl -X GET "http://localhost:3000/api/dashboards?search=Sales" \
  -H "Authorization: Bearer $TOKEN"

# Filter by connection
curl -X GET "http://localhost:3000/api/dashboards?connection_id=1" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 6.3 Get Dashboard by ID

**Endpoint:** `GET /api/dashboards/:id`  
**Description:** Get specific dashboard details  
**Authentication:** Required

#### URL Parameters:

- `id` (integer): Dashboard ID

#### Success Response (200):

```json
{
  "id": 1,
  "name": "Sales Dashboard",
  "description": "Monthly sales performance metrics",
  "configuration": {
    "theme": "dark",
    "refresh_interval": 30,
    "widgets": [...]
  },
  "connection_id": 1,
  "connection_name": "PostgreSQL Test",
  "connection_type": "postgres",
  "connection_host": "host.docker.internal",
  "connection_database": "testdb",
  "created_by": 1,
  "created_by_username": "admin",
  "is_public": true,
  "is_active": true,
  "created_at": "2025-08-19 11:11:00",
  "updated_at": "2025-08-19 11:11:00"
}
```

#### Error Responses:

- **404 Not Found:** Dashboard not found
- **403 Forbidden:** Access denied (private dashboard)

#### Test Example:

```bash
curl -X GET http://localhost:3000/api/dashboards/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 6.4 Update Dashboard

**Endpoint:** `PUT /api/dashboards/:id`  
**Description:** Update dashboard details  
**Authentication:** Required (must be creator)

#### URL Parameters:

- `id` (integer): Dashboard ID

#### Request Body (all fields optional):

```json
{
  "name": "string",
  "description": "string",
  "configuration": "object",
  "connection_id": "integer",
  "is_public": "boolean",
  "is_active": "boolean"
}
```

#### Success Response (200):

```json
{
  "message": "Dashboard updated successfully",
  "dashboard": {...}
}
```

#### Test Examples:

```bash
# Update dashboard details
curl -X PUT http://localhost:3000/api/dashboards/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Sales Dashboard",
    "description": "Quarterly sales metrics with KPIs",
    "is_public": false
  }'

# Change connection
curl -X PUT http://localhost:3000/api/dashboards/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connection_id": 2
  }'
```

---

### 6.5 Update Dashboard Configuration

**Endpoint:** `PATCH /api/dashboards/:id/configuration`  
**Description:** Update only the dashboard configuration/widgets  
**Authentication:** Required

#### URL Parameters:

- `id` (integer): Dashboard ID

#### Request Body:

```json
{
  "configuration": {
    "theme": "string",
    "refresh_interval": "integer",
    "widgets": [
      {
        "id": "string",
        "type": "chart|table|kpi|pie|bar|line",
        "title": "string",
        "query": "string",
        "options": {...}
      }
    ]
  }
}
```

#### Test Example:

```bash
curl -X PATCH http://localhost:3000/api/dashboards/1/configuration \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "configuration": {
      "theme": "light",
      "refresh_interval": 60,
      "widgets": [
        {
          "id": "w1",
          "type": "chart",
          "title": "Quarterly Revenue",
          "query": "SELECT quarter, revenue FROM quarterly_sales",
          "options": {
            "chartType": "line",
            "colors": ["#3b82f6", "#10b981"]
          }
        },
        {
          "id": "w2",
          "type": "kpi",
          "title": "Total Sales",
          "query": "SELECT SUM(sales) as total FROM sales",
          "options": {
            "format": "currency",
            "prefix": "$"
          }
        }
      ]
    }
  }'
```

---

### 6.6 Delete Dashboard

**Endpoint:** `DELETE /api/dashboards/:id`  
**Description:** Delete or deactivate a dashboard  
**Authentication:** Required (must be creator)

#### URL Parameters:

- `id` (integer): Dashboard ID

#### Query Parameters:

- `soft` (boolean): If true, soft delete (deactivate). Default: true

#### Success Response (200):

```json
{
  "message": "Dashboard deactivated successfully"
}
// or
{
  "message": "Dashboard permanently deleted successfully"
}
```

#### Test Examples:

```bash
# Soft delete (deactivate)
curl -X DELETE "http://localhost:3000/api/dashboards/1?soft=true" \
  -H "Authorization: Bearer $TOKEN"

# Hard delete (permanent)
curl -X DELETE "http://localhost:3000/api/dashboards/1?soft=false" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 6.7 Duplicate Dashboard

**Endpoint:** `POST /api/dashboards/:id/duplicate`  
**Description:** Create a copy of an existing dashboard  
**Authentication:** Required

#### URL Parameters:

- `id` (integer): Dashboard ID to duplicate

#### Request Body:

```json
{
  "name": "string (optional, new name for the copy)"
}
```

#### Success Response (201):

```json
{
  "message": "Dashboard duplicated successfully",
  "dashboard": {
    "id": 3,
    "name": "Sales Dashboard (Copy)",
    "description": "Monthly sales performance metrics",
    "configuration": {...},
    "created_by": 1
  }
}
```

#### Test Example:

```bash
curl -X POST http://localhost:3000/api/dashboards/1/duplicate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sales Dashboard Q2"
  }'
```

---

### 6.8 Get Dashboard Statistics

**Endpoint:** `GET /api/dashboards/statistics`  
**Description:** Get aggregate statistics about dashboards  
**Authentication:** Required

#### Success Response (200):

```json
{
  "statistics": {
    "total": 10,
    "active": 8,
    "public": 3,
    "unique_connections": 5,
    "unique_creators": 4
  }
}
```

#### Test Example:

```bash
curl -X GET http://localhost:3000/api/dashboards/statistics \
  -H "Authorization: Bearer $TOKEN"
```

---

### 6.9 Dashboard Configuration Examples

#### Basic Dashboard Configuration:

```json
{
  "theme": "dark",
  "refresh_interval": 30,
  "layout": "grid",
  "widgets": [
    {
      "id": "widget1",
      "type": "chart",
      "title": "Sales Trend",
      "query": "SELECT date, sales FROM daily_sales ORDER BY date",
      "position": { "x": 0, "y": 0, "w": 6, "h": 4 },
      "options": {
        "chartType": "line",
        "showLegend": true
      }
    }
  ]
}
```

#### Advanced Multi-Widget Dashboard:

```json
{
  "theme": "light",
  "refresh_interval": 60,
  "layout": "responsive",
  "widgets": [
    {
      "id": "kpi1",
      "type": "kpi",
      "title": "Total Revenue",
      "query": "SELECT SUM(revenue) as value FROM sales",
      "position": { "x": 0, "y": 0, "w": 3, "h": 2 },
      "options": {
        "format": "currency",
        "prefix": "$",
        "comparison": {
          "enabled": true,
          "query": "SELECT SUM(revenue) FROM sales WHERE date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)"
        }
      }
    },
    {
      "id": "chart1",
      "type": "bar",
      "title": "Sales by Product",
      "query": "SELECT product, SUM(sales) as total FROM product_sales GROUP BY product ORDER BY total DESC LIMIT 10",
      "position": { "x": 3, "y": 0, "w": 9, "h": 4 },
      "options": {
        "orientation": "horizontal",
        "colors": ["#3b82f6"]
      }
    },
    {
      "id": "table1",
      "type": "table",
      "title": "Recent Orders",
      "query": "SELECT order_id, customer, total, status FROM orders ORDER BY created_at DESC LIMIT 20",
      "position": { "x": 0, "y": 4, "w": 12, "h": 4 },
      "options": {
        "pagination": true,
        "pageSize": 10,
        "sortable": true,
        "filterable": true
      }
    },
    {
      "id": "pie1",
      "type": "pie",
      "title": "Sales by Region",
      "query": "SELECT region, SUM(sales) as total FROM regional_sales GROUP BY region",
      "position": { "x": 0, "y": 8, "w": 4, "h": 4 },
      "options": {
        "showLabels": true,
        "showPercentage": true
      }
    }
  ]
}
```

---

### 6.10 Dashboard Widget Types

| Widget Type | Description          | Query Result Format                     |
| ----------- | -------------------- | --------------------------------------- |
| `chart`     | Line/Area charts     | `[{x: value, y: value}]`                |
| `bar`       | Bar charts           | `[{label: string, value: number}]`      |
| `pie`       | Pie/Donut charts     | `[{label: string, value: number}]`      |
| `table`     | Data tables          | `[{col1: value, col2: value, ...}]`     |
| `kpi`       | Single value metrics | `[{value: number}]`                     |
| `gauge`     | Gauge charts         | `[{value: number, min: 0, max: 100}]`   |
| `map`       | Geographic maps      | `[{location: string, value: number}]`   |
| `heatmap`   | Heat maps            | `[{x: value, y: value, value: number}]` |

---

### 6.11 Dashboard Error Responses

| Error                  | Status Code | Response                                                    |
| ---------------------- | ----------- | ----------------------------------------------------------- |
| Missing required field | 400         | `{"errors": [{"msg": "Name is required", "path": "name"}]}` |
| Dashboard not found    | 404         | `{"error": "Dashboard not found"}`                          |
| Access denied          | 403         | `{"error": "Access denied to this dashboard"}`              |
| Invalid configuration  | 400         | `{"error": "Invalid configuration format"}`                 |
| Unauthorized           | 401         | `{"error": "Access token required"}`                        |

---

## 7. HEALTH CHECK API

### 4.1 Health Status

**Endpoint:** `GET /health`  
**Description:** Check server health status  
**Authentication:** Not required

#### Success Response (200):

```json
{
  "status": "healthy",
  "timestamp": "2025-08-19T10:12:08.616Z"
}
```

#### Test Example:

```bash
curl http://localhost:3000/health
```

---

## ERROR CODES REFERENCE

| Status Code | Description                             |
| ----------- | --------------------------------------- |
| 200         | Success                                 |
| 201         | Created                                 |
| 400         | Bad Request - Validation errors         |
| 401         | Unauthorized - Invalid or missing token |
| 403         | Forbidden - Insufficient permissions    |
| 404         | Not Found - Resource doesn't exist      |
| 409         | Conflict - Resource already exists      |
| 500         | Internal Server Error                   |

---

## AUTHENTICATION FLOW

### 1. Initial Login

```bash
# Step 1: Login to get tokens
RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

# Step 2: Extract tokens
ACCESS_TOKEN=$(echo $RESPONSE | jq -r '.accessToken')
REFRESH_TOKEN=$(echo $RESPONSE | jq -r '.refreshToken')

# Step 3: Use access token for API calls
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### 2. Token Refresh

```bash
# When access token expires, use refresh token
NEW_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}")

# Extract new tokens
NEW_ACCESS_TOKEN=$(echo $NEW_RESPONSE | jq -r '.accessToken')
NEW_REFRESH_TOKEN=$(echo $NEW_RESPONSE | jq -r '.refreshToken')
```

---

## TESTING SCRIPTS

### Complete Test Suite with Query Operations

```bash
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m'

BASE_URL="http://localhost:3000"

echo "=== COMPREHENSIVE API TEST SUITE ==="

# Function to print test results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
    fi
}

# 1. Health Check
echo -e "\n${YELLOW}=== HEALTH CHECK ===${NC}"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/health)
[ "$RESPONSE" = "200" ] && print_result 0 "Health check passed" || print_result 1 "Health check failed"

# 2. Authentication Tests
echo -e "\n${YELLOW}=== AUTHENTICATION ===${NC}"

# Login
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')
[ ! -z "$TOKEN" ] && [ "$TOKEN" != "null" ] && print_result 0 "Login successful" || print_result 1 "Login failed"

# Refresh Token
REFRESH_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.refreshToken')
REFRESH_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}")
NEW_TOKEN=$(echo $REFRESH_RESPONSE | jq -r '.accessToken')
[ ! -z "$NEW_TOKEN" ] && [ "$NEW_TOKEN" != "null" ] && print_result 0 "Token refresh successful" || print_result 1 "Token refresh failed"

# 3. User Management Tests
echo -e "\n${YELLOW}=== USER MANAGEMENT ===${NC}"

# Get Users
USERS=$(curl -s -X GET $BASE_URL/api/users \
  -H "Authorization: Bearer $TOKEN")
USER_COUNT=$(echo $USERS | jq '. | length')
[ "$USER_COUNT" -gt 0 ] && print_result 0 "Get users successful ($USER_COUNT users)" || print_result 1 "Get users failed"

# Create User
NEW_USER=$(curl -s -X POST $BASE_URL/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser'$(date +%s)'",
    "email": "test'$(date +%s)'@example.com",
    "password": "Test@123"
  }')
USER_ID=$(echo $NEW_USER | jq -r '.user.id')
[ ! -z "$USER_ID" ] && [ "$USER_ID" != "null" ] && print_result 0 "Create user successful (ID: $USER_ID)" || print_result 1 "Create user failed"

# 4. Database Connection Tests
echo -e "\n${YELLOW}=== DATABASE CONNECTIONS ===${NC}"

# Create PostgreSQL Connection
PG_CONN=$(curl -s -X POST $BASE_URL/api/connections \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test PostgreSQL",
    "type": "postgres",
    "host": "host.docker.internal",
    "port": 5432,
    "database": "testdb",
    "username": "testuser",
    "password": "testpass123"
  }')
PG_ID=$(echo $PG_CONN | jq -r '.connection.id')
[ ! -z "$PG_ID" ] && [ "$PG_ID" != "null" ] && print_result 0 "PostgreSQL connection created (ID: $PG_ID)" || print_result 1 "PostgreSQL connection failed"

# Test Connection
TEST_RESULT=$(curl -s -X POST $BASE_URL/api/connections/$PG_ID/test \
  -H "Authorization: Bearer $TOKEN" | jq -r '.success')
[ "$TEST_RESULT" = "true" ] && print_result 0 "PostgreSQL connection test passed" || print_result 1 "PostgreSQL connection test failed"

# 5. Query Execution Tests
echo -e "\n${YELLOW}=== QUERY EXECUTION ===${NC}"

# Create Table
CREATE_TABLE=$(curl -s -X POST $BASE_URL/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"connectionId\": $PG_ID,
    \"query\": \"CREATE TABLE IF NOT EXISTS test_table (id SERIAL PRIMARY KEY, name VARCHAR(100), value INT)\"
  }" | jq -r '.success')
[ "$CREATE_TABLE" = "true" ] && print_result 0 "CREATE TABLE successful" || print_result 1 "CREATE TABLE failed"

# Insert Data
INSERT_DATA=$(curl -s -X POST $BASE_URL/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"connectionId\": $PG_ID,
    \"query\": \"INSERT INTO test_table (name, value) VALUES (\\$1, \\$2) RETURNING *\",
    \"parameters\": [\"Test Item\", 42]
  }" | jq -r '.success')
[ "$INSERT_DATA" = "true" ] && print_result 0 "INSERT successful" || print_result 1 "INSERT failed"

# Select Data
SELECT_DATA=$(curl -s -X POST $BASE_URL/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"connectionId\": $PG_ID,
    \"query\": \"SELECT * FROM test_table\"
  }")
ROW_COUNT=$(echo $SELECT_DATA | jq -r '.result.rowCount')
[ "$ROW_COUNT" -gt 0 ] && print_result 0 "SELECT successful ($ROW_COUNT rows)" || print_result 1 "SELECT failed"

# Update Data
UPDATE_DATA=$(curl -s -X POST $BASE_URL/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"connectionId\": $PG_ID,
    \"query\": \"UPDATE test_table SET value = value + 1 WHERE name = \\$1\",
    \"parameters\": [\"Test Item\"]
  }" | jq -r '.success')
[ "$UPDATE_DATA" = "true" ] && print_result 0 "UPDATE successful" || print_result 1 "UPDATE failed"

# Delete Data
DELETE_DATA=$(curl -s -X POST $BASE_URL/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"connectionId\": $PG_ID,
    \"query\": \"DELETE FROM test_table WHERE name = \\$1\",
    \"parameters\": [\"Test Item\"]
  }" | jq -r '.success')
[ "$DELETE_DATA" = "true" ] && print_result 0 "DELETE successful" || print_result 1 "DELETE failed"

# Cleanup
echo -e "\n${YELLOW}=== CLEANUP ===${NC}"
CLEANUP=$(curl -s -X POST $BASE_URL/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"connectionId\": $PG_ID,
    \"query\": \"DROP TABLE IF EXISTS test_table\"
  }" | jq -r '.success')
[ "$CLEANUP" = "true" ] && print_result 0 "Cleanup successful" || print_result 1 "Cleanup failed"

# Delete Connection
DELETE_CONN=$(curl -s -X DELETE $BASE_URL/api/connections/$PG_ID \
  -H "Authorization: Bearer $TOKEN" -o /dev/null -w "%{http_code}")
[ "$DELETE_CONN" = "200" ] && print_result 0 "Connection deleted" || print_result 1 "Connection deletion failed"

# Delete Test User
if [ ! -z "$USER_ID" ] && [ "$USER_ID" != "null" ] && [ "$USER_ID" != "1" ]; then
    DELETE_USER=$(curl -s -X DELETE $BASE_URL/api/users/$USER_ID \
      -H "Authorization: Bearer $TOKEN" -o /dev/null -w "%{http_code}")
    [ "$DELETE_USER" = "200" ] && print_result 0 "Test user deleted" || print_result 1 "User deletion failed"
fi

echo -e "\n${GREEN}=== ALL TESTS COMPLETED ===${NC}"
```

### Quick Database Test Script

```bash
#!/bin/bash

# Quick script to test all three database types

TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.accessToken')

echo "Testing PostgreSQL..."
curl -s -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 1,
    "query": "SELECT version()"
  }' | jq '.result.rows[0]'

echo "\nTesting MySQL..."
curl -s -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 2,
    "query": "SELECT VERSION()"
  }' | jq '.result.rows[0]'

echo "\nTesting SQL Server..."
curl -s -X POST http://localhost:3000/api/connections/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": 3,
    "query": "SELECT @@VERSION"
  }' | jq '.result.rows[0]'
```

### Dashboard CRUD Test Script

```bash
#!/bin/bash

# Comprehensive Dashboard API Testing Script

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m'

BASE_URL="http://localhost:3000"

echo "=== DASHBOARD API TEST SUITE ==="

# Login
TOKEN=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.accessToken')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
    echo -e "${RED}✗ Failed to obtain auth token${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Authentication successful${NC}"

# 1. CREATE DASHBOARDS
echo -e "\n${YELLOW}=== CREATE OPERATIONS ===${NC}"

# Create dashboard with full configuration
DASH1=$(curl -s -X POST $BASE_URL/api/dashboards \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sales Dashboard",
    "description": "Monthly sales performance metrics",
    "connection_id": 1,
    "is_public": true,
    "configuration": {
      "theme": "dark",
      "refresh_interval": 30,
      "widgets": [
        {
          "id": "w1",
          "type": "chart",
          "title": "Revenue Trend",
          "query": "SELECT date, revenue FROM sales ORDER BY date"
        }
      ]
    }
  }')
DASH1_ID=$(echo $DASH1 | jq -r '.dashboard.id')
[ ! -z "$DASH1_ID" ] && [ "$DASH1_ID" != "null" ] && \
  echo -e "${GREEN}✓ Created dashboard 1 (ID: $DASH1_ID)${NC}" || \
  echo -e "${RED}✗ Failed to create dashboard 1${NC}"

# Create minimal dashboard
DASH2=$(curl -s -X POST $BASE_URL/api/dashboards \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Analytics Dashboard",
    "description": "User behavior analytics"
  }')
DASH2_ID=$(echo $DASH2 | jq -r '.dashboard.id')
[ ! -z "$DASH2_ID" ] && [ "$DASH2_ID" != "null" ] && \
  echo -e "${GREEN}✓ Created dashboard 2 (ID: $DASH2_ID)${NC}" || \
  echo -e "${RED}✗ Failed to create dashboard 2${NC}"

# 2. READ OPERATIONS
echo -e "\n${YELLOW}=== READ OPERATIONS ===${NC}"

# Get all dashboards
COUNT=$(curl -s -X GET $BASE_URL/api/dashboards \
  -H "Authorization: Bearer $TOKEN" | jq -r '.count')
[ "$COUNT" -ge 2 ] && \
  echo -e "${GREEN}✓ Get all dashboards ($COUNT found)${NC}" || \
  echo -e "${RED}✗ Failed to get dashboards${NC}"

# Get specific dashboard
DASH_DETAIL=$(curl -s -X GET $BASE_URL/api/dashboards/$DASH1_ID \
  -H "Authorization: Bearer $TOKEN" | jq -r '.id')
[ "$DASH_DETAIL" = "$DASH1_ID" ] && \
  echo -e "${GREEN}✓ Get dashboard by ID${NC}" || \
  echo -e "${RED}✗ Failed to get dashboard by ID${NC}"

# Filter dashboards
PUBLIC_COUNT=$(curl -s -X GET "$BASE_URL/api/dashboards?is_public=true" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.count')
[ "$PUBLIC_COUNT" -ge 1 ] && \
  echo -e "${GREEN}✓ Filter dashboards (found $PUBLIC_COUNT public)${NC}" || \
  echo -e "${RED}✗ Failed to filter dashboards${NC}"

# Get statistics
STATS=$(curl -s -X GET $BASE_URL/api/dashboards/statistics \
  -H "Authorization: Bearer $TOKEN" | jq -r '.statistics.total')
[ "$STATS" -ge 2 ] && \
  echo -e "${GREEN}✓ Get dashboard statistics (total: $STATS)${NC}" || \
  echo -e "${RED}✗ Failed to get statistics${NC}"

# 3. UPDATE OPERATIONS
echo -e "\n${YELLOW}=== UPDATE OPERATIONS ===${NC}"

# Update dashboard
UPDATE_RESULT=$(curl -s -X PUT $BASE_URL/api/dashboards/$DASH1_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Sales Dashboard",
    "is_public": false
  }' | jq -r '.message')
[ "$UPDATE_RESULT" = "Dashboard updated successfully" ] && \
  echo -e "${GREEN}✓ Update dashboard${NC}" || \
  echo -e "${RED}✗ Failed to update dashboard${NC}"

# Update configuration
CONFIG_RESULT=$(curl -s -X PATCH $BASE_URL/api/dashboards/$DASH1_ID/configuration \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "configuration": {
      "theme": "light",
      "refresh_interval": 60,
      "widgets": [
        {
          "id": "w1",
          "type": "kpi",
          "title": "Total Sales",
          "query": "SELECT SUM(sales) FROM sales"
        }
      ]
    }
  }' | jq -r '.message')
[ "$CONFIG_RESULT" = "Dashboard configuration saved successfully" ] && \
  echo -e "${GREEN}✓ Update dashboard configuration${NC}" || \
  echo -e "${RED}✗ Failed to update configuration${NC}"

# 4. DUPLICATE OPERATION
echo -e "\n${YELLOW}=== DUPLICATE OPERATION ===${NC}"

DUP_RESULT=$(curl -s -X POST $BASE_URL/api/dashboards/$DASH2_ID/duplicate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Analytics Dashboard Copy"}' | jq -r '.dashboard.id')
[ ! -z "$DUP_RESULT" ] && [ "$DUP_RESULT" != "null" ] && \
  echo -e "${GREEN}✓ Duplicate dashboard (new ID: $DUP_RESULT)${NC}" || \
  echo -e "${RED}✗ Failed to duplicate dashboard${NC}"

# 5. DELETE OPERATIONS
echo -e "\n${YELLOW}=== DELETE OPERATIONS ===${NC}"

# Soft delete
SOFT_DELETE=$(curl -s -X DELETE "$BASE_URL/api/dashboards/$DUP_RESULT?soft=true" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.message')
[ "$SOFT_DELETE" = "Dashboard deactivated successfully" ] && \
  echo -e "${GREEN}✓ Soft delete dashboard${NC}" || \
  echo -e "${RED}✗ Failed to soft delete${NC}"

# Hard delete
HARD_DELETE=$(curl -s -X DELETE "$BASE_URL/api/dashboards/$DASH2_ID?soft=false" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.message')
[ "$HARD_DELETE" = "Dashboard permanently deleted successfully" ] && \
  echo -e "${GREEN}✓ Hard delete dashboard${NC}" || \
  echo -e "${RED}✗ Failed to hard delete${NC}"

# 6. ERROR HANDLING
echo -e "\n${YELLOW}=== ERROR HANDLING ===${NC}"

# Test missing required field
ERROR1=$(curl -s -X POST $BASE_URL/api/dashboards \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"description": "Missing name"}' | jq -r '.errors[0].msg')
[ "$ERROR1" = "Name is required" ] && \
  echo -e "${GREEN}✓ Validation error handling${NC}" || \
  echo -e "${RED}✗ Validation error not working${NC}"

# Test non-existent dashboard
ERROR2=$(curl -s -X GET $BASE_URL/api/dashboards/999999 \
  -H "Authorization: Bearer $TOKEN" | jq -r '.error')
[ "$ERROR2" = "Dashboard not found" ] && \
  echo -e "${GREEN}✓ 404 error handling${NC}" || \
  echo -e "${RED}✗ 404 error not working${NC}"

# Test without auth
ERROR3=$(curl -s -X GET $BASE_URL/api/dashboards | jq -r '.error')
[ "$ERROR3" = "Access token required" ] && \
  echo -e "${GREEN}✓ Authentication required${NC}" || \
  echo -e "${RED}✗ Auth check not working${NC}"

# Cleanup
echo -e "\n${YELLOW}=== CLEANUP ===${NC}"
curl -s -X DELETE "$BASE_URL/api/dashboards/$DASH1_ID?soft=false" \
  -H "Authorization: Bearer $TOKEN" > /dev/null
echo -e "${GREEN}✓ Test dashboard cleaned up${NC}"

echo -e "\n${GREEN}=== DASHBOARD TESTS COMPLETED ===${NC}"
```

---

## RATE LIMITING

The API implements rate limiting to prevent abuse:

- **Login endpoint:** 50 requests per 15 minutes per IP
- **Other API endpoints:** 1000 requests per 15 minutes per IP

When rate limit is exceeded:

```json
{
  "error": "Too many requests, please try again later"
}
```

---

## ENVIRONMENT VARIABLES

Configure the server using these environment variables:

| Variable             | Description            | Default                              |
| -------------------- | ---------------------- | ------------------------------------ |
| PORT                 | Server port            | 3000                                 |
| DB_PATH              | SQLite database path   | /app/data/database.sqlite            |
| JWT_SECRET           | JWT signing secret     | your-secret-key-change-in-production |
| JWT_ACCESS_EXPIRY    | Access token expiry    | 5m                                   |
| JWT_REFRESH_EXPIRY   | Refresh token expiry   | 7d                                   |
| RATE_LIMIT_WINDOW_MS | Rate limit window      | 900000 (15 min)                      |
| RATE_LIMIT_LOGIN_MAX | Max login attempts     | 50                                   |
| RATE_LIMIT_API_MAX   | Max API requests       | 1000                                 |
| DEFAULT_USER         | Default admin username | admin                                |
| DEFAULT_PASSWORD     | Default admin password | admin123                             |

---

## POSTMAN COLLECTION

Import this collection to Postman for easy testing:

```json
{
  "info": {
    "name": "Node.js DB Manager API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{access_token}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000"
    },
    {
      "key": "access_token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"admin\",\n  \"password\": \"admin123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": "{{base_url}}/api/auth/login"
          }
        }
      ]
    }
  ]
}
```

---

## TROUBLESHOOTING

### Common Issues and Solutions

#### 1. "Access token required"

**Solution:** Include Authorization header with valid JWT token

#### 2. "Token expired"

**Solution:** Use refresh token to get new access token

#### 3. "Connection failed"

**Solution:**

- Check database is running
- Verify credentials
- For Docker: use `host.docker.internal` instead of `localhost`

#### 4. "Rate limit exceeded"

**Solution:** Wait 15 minutes or reduce request frequency

#### 5. "Invalid database type"

**Solution:** Use only: `postgres`, `mysql`, or `mssql`

---

## SECURITY BEST PRACTICES

1. **Change default credentials** immediately in production
2. **Use strong JWT secrets** - generate with: `openssl rand -base64 32`
3. **Enable SSL** for database connections in production
4. **Implement IP whitelisting** for sensitive operations
5. **Regular security audits** of dependencies: `npm audit`
6. **Use environment variables** for all sensitive configuration
7. **Enable CORS** only for trusted domains
8. **Implement request logging** for audit trails

---

## VERSION HISTORY

- **v1.0.0** - Initial release with basic CRUD operations
- Supports PostgreSQL, MySQL, and SQL Server
- JWT authentication
- Rate limiting
- Docker support
