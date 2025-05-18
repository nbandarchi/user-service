import type { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import { userService } from './user.service'
import { insertUserSchema, updateUserSchema, type NewUser, User } from './user.schema'
import { z } from 'zod'
import type { Uuid } from '@/lib/base-service'

// Convert Zod schema to JSON schema for response validation
const userResponseSchema = Type.Object({
    id: Type.String({ format: 'uuid' }),
    auth0Id: Type.String(),
    metadata: Type.Optional(
        Type.Object({
            facilities: Type.Array(Type.String()),
            defaultFacility: Type.String(),
        }),
    ),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
})

// Error response schema
const errorResponseSchema = Type.Object({
    message: Type.String(),
})

export const userRoutes: FastifyPluginAsync = async (fastify) => {
    // Get user by ID
    fastify.get(
        '/:id',
        {
            schema: {
                params: Type.Object({
                    id: Type.String({ format: 'uuid' }),
                }),
                response: {
                    200: userResponseSchema,
                    404: Type.Object({
                        message: Type.String(),
                    }),
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params as { id: Uuid }
            const user = await userService.getById(id)

            if (!user) {
                return reply.code(404).send({ message: 'User not found' })
            }

            return user
        },
    )

    // Get user by Auth0 ID
    fastify.get(
        '/auth0/:auth0Id',
        {
            schema: {
                params: Type.Object({
                    auth0Id: Type.String(),
                }),
                response: {
                    200: userResponseSchema,
                    404: Type.Object({
                        message: Type.String(),
                    }),
                },
            },
        },
        async (request, reply) => {
            const { auth0Id } = request.params as { auth0Id: string }
            const user = await userService.getUserByAuth0Id(auth0Id)

            if (!user) {
                return reply.code(404).send({ message: 'User not found' })
            }

            return user
        },
    )

    // Create user
    fastify.post(
        '/',
        {
            schema: {
                body: Type.Object({
                    auth0Id: Type.String(),
                    metadata: Type.Object({
                        facilities: Type.Array(Type.String()),
                        defaultFacility: Type.String(),
                    }),
                }),
                response: {
                    201: userResponseSchema,
                },
            },
        },
        async (request, reply) => {
            const userData = request.body as NewUser
            const newUser = await userService.create(userData)
            return reply.code(201).send(newUser)
        },
    )

    // Update user
    fastify.patch(
        '/:id',
        {
            schema: {
                params: Type.Object({
                    id: Type.String({ format: 'uuid' }),
                }),
                body: Type.Partial(
                    Type.Object({
                        metadata: Type.Object({
                            facilities: Type.Array(Type.String()),
                            defaultFacility: Type.String(),
                        }),
                    }),
                ),
                response: {
                    200: userResponseSchema,
                    404: Type.Object({
                        message: Type.String(),
                    }),
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params as { id: Uuid }
            const userData = request.body as Partial<NewUser>
            const updatedUser = await userService.update(id, userData)

            if (!updatedUser) {
                return reply.code(404).send({ message: 'User not found' })
            }

            return updatedUser
        },
    )

    // Delete user
    fastify.delete(
        '/:id',
        {
            schema: {
                params: Type.Object({
                    id: Type.String({ format: 'uuid' }),
                }),
                response: {
                    200: Type.Object({
                        success: Type.Boolean(),
                    }),
                    404: Type.Object({
                        message: Type.String(),
                    }),
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params as { id: Uuid }
            const success = await userService.delete(id)

            if (!success) {
                return reply.code(404).send({ message: 'User not found' })
            }

            return { success }
        },
    )
}
