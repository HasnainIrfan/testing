# Onsite Local

A monorepo containing frontend, admin panel, and backend applications.

## Project Structure

```
.
├── apps/                # Application packages
│   ├── web/            # Main frontend application (Next.js)
│   ├── admin/          # Admin panel application (Next.js)
│   └── api/            # Backend API (Node.js/Express)
│
```

## Getting Started

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Start development servers:

   ```bash
   # Frontend (localhost:3000)
   yarn web:dev

   # Admin Panel (localhost:3001)
   yarn admin:dev

   # Backend API (localhost:4000)
   yarn api:dev
   ```

## Available Scripts

- `yarn web:dev` - Start frontend development server
- `yarn admin:dev` - Start admin panel development server
- `yarn api:dev` - Start backend API development server
- `yarn build:all` - Build all applications
- `yarn lint` - Run linting for all packages
- `yarn test` - Run tests for all packages

## Requirements

- Node.js >= 22.0.0
- Yarn >= 1.22.0
