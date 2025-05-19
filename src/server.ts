import Fastify, { type FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { userRoutes } from './routes/user/user.routes'
import servicesPlugin from './plugins/services'

export function buildServer(): FastifyInstance {
    const server = Fastify({
        logger: {
            level: process.env.LOG_LEVEL || 'info',
        },
    }).withTypeProvider<TypeBoxTypeProvider>()

    // Register plugins
    server.register(cors, {
        origin: true, // Allow all origins in development
        credentials: true,
    })

    server.register(servicesPlugin)

    // Register Swagger
    server.register(swagger, {
        openapi: {
            info: {
                title: 'User Service API',
                description: 'API for user management',
                version: '1.0.0',
            },
            servers: [
                {
                    url: 'http://localhost:3000',
                    description: 'Development server',
                },
            ],
        },
    })

    server.register(swaggerUi, {
        routePrefix: '/docs',
    })

    // Register routes
    server.register(userRoutes, { prefix: '/api' })

    // Health check route
    server.get('/health', async () => {
        return { status: 'ok' }
    })

    return server
}
