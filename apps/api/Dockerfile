FROM node:20-alpine

WORKDIR /app

# Install build dependencies and curl for healthcheck
RUN apk add --no-cache python3 make g++ curl

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy application code
COPY . .

# Copy and set permissions for entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Create data directory
RUN mkdir -p /app/data

# Volume for persistent SQLite storage
VOLUME ["/app/data"]

# Expose port
EXPOSE 3000

# Use entrypoint script
ENTRYPOINT ["docker-entrypoint.sh"]