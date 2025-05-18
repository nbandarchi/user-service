# User Service

A robust user management microservice built with Node.js, TypeScript, and PostgreSQL. This service handles user authentication, profile management, and related operations.

## Tech Stack

### Core
- **Runtime**: Node.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **API Framework**: Fastify
- **API Style**: RESTful

### Development Tools
- **Testing**: Vitest
- **Test Coverage**: v8
- **Code Quality**: ESLint, Prettier
- **Containerization**: Docker
- **CI/CD**: GitHub Actions

### Key Dependencies
- `fastify`: High-performance web framework
- `@fastify/swagger`: OpenAPI documentation
- `@fastify/type-provider-typebox`: TypeScript integration
- `drizzle-orm`: Type-safe SQL query builder
- `drizzle-zod`: Zod schema integration with Drizzle
- `zod`: Schema validation
- `dotenv`: Environment variable management
- `vitest`: Testing framework

## Project Structure

```
.
├── src/
│   ├── db/                 # Database configuration and schema
│   ├── routes/
│   │   └── user/          # User-related routes and services
│   │       ├── tests/     # Route and service tests
│   │       ├── user.routes.ts  # Fastify route definitions
│   │       ├── user.schema.ts  # Data models and validation
│   │       └── user.service.ts # Business logic
│   ├── server.ts          # Fastify server configuration
│   ├── index.ts           # Application entry point
│   └── utils/             # Utility functions and helpers
│   └── test-utils/        # Testing utilities and fixtures
├── test/
│   └── setup.ts           # Test environment setup
├── .env                    # Environment variables
├── .env.test               # Test environment variables
├── package.json
└── tsconfig.json
```

## Major Milestones

### ✅ Initial Setup
- Project initialization with TypeScript
- Database connection setup with Drizzle ORM
- Basic user schema definition
- Environment configuration

### ✅ Core User Management
- User CRUD operations
- Authentication integration
- Input validation with Zod
- Comprehensive test coverage

### ✅ Testing Infrastructure
- Unit tests with Vitest
- Integration tests
- Test coverage reporting
- Test fixtures and utilities

## Current Status

The service currently provides:
- User creation, retrieval, update, and deletion
- Authentication via Auth0
- Input validation with Zod schemas
- Fastify route implementation with TypeBox schema validation
- API documentation with Swagger/OpenAPI
- Health check endpoint
- Comprehensive test coverage for services and routes
- Type-safe database operations with Drizzle ORM

## Next Steps

### Short-term
- [x] Add API documentation with Swagger/OpenAPI
- [ ] Implement rate limiting
- [x] Add request validation using Fastify schemas
- [x] Set up logging with Fastify's built-in logger
- [x] Add health check endpoints
- [ ] Implement generic base service for CRUD operations

### Medium-term
- [ ] Implement user roles and permissions
- [ ] Add user profile management
- [ ] Set up email verification
- [ ] Implement password reset flow
- [ ] Add audit logging

### Long-term
- [ ] Add GraphQL API layer
- [ ] Implement caching with Redis
- [ ] Set up distributed tracing
- [ ] Add multi-tenancy support
- [ ] Implement API versioning

## Development

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure
4. Start the database: `docker-compose up -d`
5. Run migrations: `npm run db:migrate`
6. Start the server: `npm run dev`

### Testing
- Run tests: `npm test`
- Run tests with coverage: `npm run test:coverage`
- Run in watch mode: `npm run test:watch`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
