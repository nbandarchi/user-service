// src/lib/registerRoute.ts
import type { FastifyInstance, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify'
import type { z, ZodType } from 'zod'
import { type JsonSchema7Type, zodToJsonSchema } from 'zod-to-json-schema'

interface CustomRouteSchema {
    body?: ZodType
    querystring?: ZodType
    params?: ZodType
    response?: Record<number, ZodType> // For typed responses
}

type TypedRouteHandler<S extends CustomRouteSchema> = (context: {
    body: S['body'] extends ZodType ? z.infer<S['body']> : undefined
    query: S['querystring'] extends ZodType ? z.infer<S['querystring']> : undefined
    params: S['params'] extends ZodType ? z.infer<S['params']> : undefined
    request: FastifyRequest // Full request if needed
    reply: FastifyReply // Full reply if needed
    services: FastifyInstance['services'] // Access to your services
}) => Promise<unknown> // Or specify the actual response type for your handler

// Helper to build Fastify schema from Zod schema
function buildFastifySchema(customSchema: CustomRouteSchema): RouteShorthandOptions['schema'] {
    const schema: RouteShorthandOptions['schema'] = {}
    if (customSchema.body) {
        schema.body = zodToJsonSchema(customSchema.body)
    }
    if (customSchema.querystring) {
        schema.querystring = zodToJsonSchema(customSchema.querystring)
    }
    if (customSchema.params) {
        schema.params = zodToJsonSchema(customSchema.params)
    }
    if (customSchema.response) {
        const response = {} as Record<string, JsonSchema7Type>
        for (const statusCode in customSchema.response) {
            response[statusCode] = zodToJsonSchema(customSchema.response[statusCode])
        }
        schema.response = response
    }
    return schema
}

export function createRouteRegistry(fastify: FastifyInstance, prefix?: string) {
    const registerRoute = <S extends CustomRouteSchema>(
        method: 'get' | 'post' | 'put' | 'delete' | 'patch', // Add other HTTP methods as needed
        path: string,
        schemaDef: S,
        handler: TypedRouteHandler<S>,
    ) => {
        const fastifySchema = buildFastifySchema(schemaDef)

        fastify.route({
            method: method.toUpperCase() as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
            url: `${prefix ?? '/'}${path}`,
            schema: fastifySchema,
            handler: async (request: FastifyRequest, reply: FastifyReply) => {
                // Types for body, query, params are inferred by Fastify based on schema
                // but we cast them here for the custom handler signature
                return handler({
                    body: request.body as S['body'] extends ZodType
                        ? z.infer<S['body']>
                        : undefined,
                    query: request.query as S['querystring'] extends ZodType
                        ? z.infer<S['querystring']>
                        : undefined,
                    params: request.params as S['params'] extends ZodType
                        ? z.infer<S['params']>
                        : undefined,
                    request,
                    reply,
                    services: fastify.services,
                })
            },
        })
    }
    return {
        registerRoute,
        get: <S extends CustomRouteSchema>(
            path: string,
            schemaDef: S,
            handler: TypedRouteHandler<S>,
        ) => {
            return registerRoute('get', path, schemaDef, handler)
        },
        post: <S extends CustomRouteSchema>(
            path: string,
            schemaDef: S,
            handler: TypedRouteHandler<S>,
        ) => {
            return registerRoute('post', path, schemaDef, handler)
        },
        put: <S extends CustomRouteSchema>(
            path: string,
            schemaDef: S,
            handler: TypedRouteHandler<S>,
        ) => {
            return registerRoute('put', path, schemaDef, handler)
        },
        delete: <S extends CustomRouteSchema>(
            path: string,
            schemaDef: S,
            handler: TypedRouteHandler<S>,
        ) => {
            return registerRoute('delete', path, schemaDef, handler)
        },
        patch: <S extends CustomRouteSchema>(
            path: string,
            schemaDef: S,
            handler: TypedRouteHandler<S>,
        ) => {
            return registerRoute('patch', path, schemaDef, handler)
        },
    }
}
