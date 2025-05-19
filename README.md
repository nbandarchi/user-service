# User Management Service

A modern, type-safe user management service built with Node.js, TypeScript, and PostgreSQL. This service provides essential user management functionality including authentication, profile management, and access control.

## 🚀 Getting Started

### Key Features

- **Type-Safe CRUD Operations** with the generic `BaseService` class
- **Simplified Route Registration** with type-safe route helpers
- **Consistent API Schemas** with the schema builder utility
- **Comprehensive Test Coverage** with Vitest and type-safe fixtures

### Prerequisites

- Node.js 18 or later
- PostgreSQL 14 or later
- npm or yarn
- Docker (optional, for containerized database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/user-service.git
   cd user-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the database**
   ```bash
   # Using Docker (recommended)
   docker-compose up -d
   
   # Or start your local PostgreSQL instance
   # Make sure to update .env with your connection details
   ```

5. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`

## 🛠 Development

### Architecture

This service follows a layered architecture pattern:

1. **Routes Layer** - HTTP endpoints using Fastify with type-safe route registration
2. **Service Layer** - Business logic implemented with the `BaseService` for common CRUD operations
3. **Data Layer** - Database access using Drizzle ORM for type-safe queries
4. **Schema Layer** - Data validation using Zod with the `SchemaBuilder` for consistent API schemas

### Available Scripts

- `npm run dev` - Start development server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run db:studio` - Launch database GUI (DBeaver/BeeKeeper)
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Project Structure

```
.
├── src/                    # Source code
│   ├── db/                # Database configuration and migrations
│   ├── lib/               # Core library code
│   │   ├── base-service.ts # Generic CRUD service implementation
│   │   ├── route-helper.ts # Type-safe route registration
│   │   └── schema-builder.ts # API schema generation utilities
│   ├── plugins/           # Fastify plugins
│   ├── routes/            # API routes
│   └── test-utils/        # Testing utilities
├── test/                  # Test files
├── .env                   # Environment variables
└── package.json           # Project configuration
```

## 📚 API Documentation

Once the server is running, you can access:

- **API Documentation**: `http://localhost:3000/api-docs` (Swagger UI)
- **Health Check**: `http://localhost:3000/health`
