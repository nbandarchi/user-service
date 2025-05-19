import fp from 'fastify-plugin'
import { db } from '@/db/client'
import { UserService } from '@/routes/user/user.service'
import { users } from '@/db/schema'

const services = {
    userService: new UserService(db, users),
}

// Define a type for your services to be available on the Fastify instance
declare module 'fastify' {
    interface FastifyInstance {
        services: typeof services
    }
}

export default fp(async (fastify) => {
    fastify.decorate('services', services)
})
