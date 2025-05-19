import type { FastifyInstance } from 'fastify'
import { createRouteRegistry } from '@/lib/route-helper'
import { selectUserSchema, insertUserSchema } from '@/routes/user/user.schema' // Your Zod schemas
import { SchemaBuilder } from '@/lib/schema-builder'

export async function userRoutes(fastify: FastifyInstance) {
    const { get, post } = createRouteRegistry(fastify, '/users')

    post(
        '/',
        SchemaBuilder.post(insertUserSchema, selectUserSchema),
        async ({ body, services, reply }) => {
            const newUser = await services.userService.create(body)
            return reply.status(201).send(newUser)
        },
    )

    get('/:id', SchemaBuilder.getById(selectUserSchema), async ({ params, services, reply }) => {
        const user = await services.userService.getById(params.id)
        if (!user) {
            return reply.status(404).send({ message: 'User not found' })
        }
        return user
    })

    get(
        '/auth0/:id',
        SchemaBuilder.getById(selectUserSchema),
        async ({ params, services, reply }) => {
            const user = await services.userService.getUserByAuth0Id(params.id)
            if (!user) {
                return reply.status(404).send({ message: 'User not found' })
            }
            return user
        },
    )
}
