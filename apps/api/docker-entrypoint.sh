#!/bin/sh
set -e

echo "========================================="
echo "  Node.js Server Starting"
echo "========================================="

# Ensure data directory exists
mkdir -p /app/data

# Check if database file exists
if [ ! -f "$DB_PATH" ]; then
    echo "Creating new SQLite database at $DB_PATH"
    touch "$DB_PATH"
    chmod 666 "$DB_PATH"
fi

echo "Running database migrations..."
npm run migrate

echo "Starting Node.js server on port $PORT..."
exec npm start