# What's New: Fastify Proposals

This document outlines several proposals and innovations implemented in this project to enhance the developer experience, type safety, and code consistency when working with Fastify.

## 🔄 Drizzle ORM: A Modern Replacement for Knex

### Why Drizzle?

Drizzle ORM provides a familiar query builder interface similar to Knex, but with significant advantages:

- **Full Type Safety**: Drizzle generates TypeScript types from your schema definitions
- **Simplified Schema Management**: Define your schema once in TypeScript
- **Query Autocompletion**: Get IDE suggestions for table and column names
- **Performance**: Minimal runtime overhead compared to traditional ORMs
- **SQL-first Approach**: Write queries that closely resemble SQL while maintaining type safety

### Example Usage

```typescript
// Schema definition
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Type inference
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

// Type-safe query
const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)
```

## 🔗 Drizzle → Zod → JSON Schema Pipeline

We've implemented a seamless pipeline from database schema to API validation:

1. **Drizzle Schema**: Define your database schema with Drizzle
2. **Zod Validation**: Generate Zod schemas from Drizzle schemas using `drizzle-zod`
3. **JSON Schema**: Convert Zod schemas to JSON Schema for Fastify route validation

This approach ensures:
- **Single Source of Truth**: Database schema drives validation rules
- **Type Consistency**: Types flow from database to API endpoints
- **Reduced Duplication**: Define validation rules once
- **Runtime Validation**: Validate incoming data against your schema

### Example Pipeline

```typescript
// 1. Drizzle schema
import { pgTable, uuid, text } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull(),
    name: text('name').notNull(),
})

// 2. Generate Zod schema
import { createInsertSchema } from 'drizzle-zod'

export const UserSchema = createInsertSchema(users)

// 3. Use in Fastify route with JSON Schema conversion
import { zodToJsonSchema } from 'zod-to-json-schema'

fastify.route({
    method: 'POST',
    url: '/users',
    schema: {
        body: zodToJsonSchema(UserSchema)
    },
    handler: async (request, reply) => {
        // Request body is validated against the schema
    }
})
```

## 🔌 Service Plugin

We've implemented a service plugin pattern to:

- **Centralize Data Handling**: Keep business logic in dedicated service classes
- **Share Services**: Make services available throughout the application
- **Maintain Type Safety**: Ensure type safety when accessing services
- **Simplify Testing**: Mock services easily for unit tests

### Implementation

```typescript
// Define the service plugin
import fp from 'fastify-plugin'
import { UserService } from './user.service'

declare module 'fastify' {
    interface FastifyInstance {
        services: {
            user: UserService
        }
    }
}

export default fp(async (fastify) => {
    const userService = new UserService(fastify.db)
    
    // Register services
    fastify.decorate('services', {
        user: userService
    })
})

// Use in routes
fastify.get('/users/:id', async (request, reply) => {
    const user = await fastify.services.user.getById(request.params.id)
    return user
})
```

## 🛣️ Type-Safe Route Registration

Our route registration system provides:

- **Type Inference**: Parameter and response types are inferred from schemas
- **Simplified Handlers**: Clean handler functions with typed parameters
- **Reduced Boilerplate**: Streamlined route registration
- **Improved Developer Experience**: Better IDE support and type checking

### Example Usage

```typescript
// Create route registry
const routes = createRouteRegistry(fastify, '/api')

// Register route with type-safe handler
routes.get(
    '/users/:id',
    {
        params: z.object({ id: z.string().uuid() }),
        response: { 200: UserSchema }
    },
    async ({ params, services }) => {
        // params.id is typed as string
        return services.user.getById(params.id)
    }
)
```

## 🏗️ Schema Builder

The SchemaBuilder provides:

- **Consistent API Design**: Standardized schema patterns across endpoints
- **Reduced Duplication**: Reuse common schema patterns
- **Improved Maintainability**: Centralized schema definitions
- **Better Developer Experience**: Simple API for defining complex schemas

### Example Usage

```typescript
// Define entity schema
const UserSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string(),
})

// Use SchemaBuilder for route schemas
const { get, post } = createRouteRegistry(fastify, '/users')

// GET /users/:id
get(
    '/:id',
    SchemaBuilder.getById(UserSchema),
    async ({ params, services }) => {
        return services.userService.getById(params.id)
    }
)

// GET /users
get(
    '/',
    SchemaBuilder.getAll(UserSchema),
    async ({ services }) => {
        return services.userService.getAll()
    }
)

// POST /users
post(
    '/',
    SchemaBuilder.post(UserSchema, UserInsertSchema),
    async ({ body, services }) => {
        return services.userService.create(body)
    }
)
```

## 🔍 Biome: A Modern Replacement for ESLint and Prettier

We've adopted [Biome](https://biomejs.dev/) as our all-in-one solution for code formatting and linting, replacing the traditional ESLint and Prettier combination.

### Why Biome?

- **Single Tool**: One tool for both linting and formatting
- **Performance**: Significantly faster than ESLint + Prettier (10-100x in some cases)
- **Rust-based**: Built for performance and reliability
- **Zero Config**: Works out of the box with sensible defaults
- **Consistent Formatting**: No more conflicts between linter and formatter
- **Modern Features**: Support for the latest JavaScript and TypeScript features

### Configuration

Our `biome.json` configuration focuses on:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.4.1/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedVariables": "error"
      },
      "suspicious": {
        "noExplicitAny": "error"
      },
      "style": {
        "useConst": "error",
        "noNegationElse": "error"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 4,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingComma": "all",
      "semicolons": "asNeeded"
    }
  }
}
```

### Developer Workflow

Biome integrates seamlessly into our development workflow:

- **IDE Integration**: Works with VS Code, JetBrains IDEs, and more
- **Git Hooks**: Automatically format and lint code before commits using Husky
- **CI/CD**: Validate code style in CI pipelines

### Available Commands

```bash
# Check formatting
npm run format:check

# Fix formatting issues
npm run format:fix

# Check linting
npm run lint:check

# Fix linting issues
npm run lint:fix

# Run all checks
npm run check

# Fix all issues
npm run check:fix
```

## 🚀 Benefits for the Team

These proposals provide significant benefits:

1. **Improved Developer Experience**: Better tooling support and type safety
2. **Reduced Boilerplate**: Less repetitive code
3. **Consistent Patterns**: Standardized approach to common tasks
4. **Type Safety**: Catch errors at compile time
5. **Better Maintainability**: Cleaner, more organized codebase
6. **Faster Development**: Streamlined workflows for common tasks
7. **Simplified Tooling**: Fewer dependencies and configuration files
8. **Faster CI/CD**: Quicker linting and formatting checks

By adopting these patterns, we can create a more robust, maintainable, and developer-friendly codebase that scales with our needs.
