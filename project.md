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
- **Code Quality**: Biome (linting and formatting)
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
│   ├── lib/                # Core library code
│   │   ├── base-service.ts # Generic CRUD service implementation
│   │   ├── base-fixture.ts # Base test fixture implementation
│   │   ├── route-helper.ts # Type-safe route registration utilities
│   │   └── schema-builder.ts # API schema generation utilities
│   ├── plugins/            # Fastify plugins
│   ├── routes/
│   │   └── user/          # User-related routes and services
│   │       ├── tests/     # Route and service tests
│   │       ├── user.routes.ts  # Fastify route definitions
│   │       ├── user.schema.ts  # Data models and validation
│   │       └── user.service.ts # Business logic
│   ├── server.ts          # Fastify server configuration
│   ├── index.ts           # Application entry point
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
- Type-safe test fixtures with BaseFixture system
- Code quality enforcement with Biome
- Generic base service for common CRUD operations
- Type-safe route registration helpers
- Schema builder for consistent API schema definitions

## Next Steps

### Short-term
- [x] Add API documentation with Swagger/OpenAPI
- [ ] Implement rate limiting
- [x] Add request validation using Fastify schemas
- [x] Set up logging with Fastify's built-in logger
- [x] Add health check endpoints
- [x] Implement generic base service for CRUD operations
- [x] Create route helper for type-safe route registration
- [x] Implement schema builder for consistent API schemas

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

### Code Quality with Biome

The project uses [Biome](https://biomejs.dev/) for code linting and formatting, configured in `biome.json`. Key features include:

- Consistent code style with 4-space indentation
- Semicolon-free code style
- Single quotes for strings
- Trailing commas in arrays and objects
- Exclusion of coverage, node_modules, and dist directories
- Type safety rules (no explicit any, consistent array types, etc.)

Available commands:
- Lint code: `npm run lint`
- Fix linting issues: `npm run lint:fix`
- Format code: `npm run format`
- Fix formatting issues: `npm run format:fix`
- Run all checks: `npm run check`
- Fix all issues: `npm run check:fix`

### Test Fixtures

The project uses a type-safe fixture system for tests:

- `BaseFixture` - An abstract class in `src/lib/base-fixture.ts` that provides a generic way to seed and clear test data
- Fixture classes (like `UserFixture`) extend `BaseFixture` with specific schema and data
- `fixture-loader.ts` provides utilities to load and clear fixtures for tests

This approach ensures type safety throughout the testing process and makes it easy to maintain test data.