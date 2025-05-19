import { z } from 'zod'
import type { ZodType, ZodObject, ZodRawShape } from 'zod'

// Define the common UUID parameter schema
const UuidParamSchema = z.object({
    id: z.string().uuid({ message: 'Invalid UUID format for ID parameter.' }),
})

// Define a base schema for responses that indicate a resource was not found
const NotFoundResponseSchema = z.object({ message: z.string() })

export const SchemaBuilder = {
    /**
     * Generates schema for a 'get by ID' route.
     * Assumes ID is a UUID.
     */
    getById<TEntity extends ZodType>(entitySchema: TEntity) {
        return {
            params: UuidParamSchema,
            response: {
                200: entitySchema,
                404: NotFoundResponseSchema,
            },
        }
    },

    /**
     * Generates schema for a 'get all' route.
     * Optional: Add query parameters for pagination/filtering.
     */
    getAll<TEntity extends ZodType>(
        entitySchema: TEntity,
        // Example: allow passing a Zod schema for query parameters
        querySchema?: ZodObject<ZodRawShape>,
    ) {
        return {
            ...(querySchema && { querystring: querySchema }),
            response: {
                200: z.array(entitySchema),
            },
        }
    },

    /**
     * Generates schema for a 'create' (POST) route.
     */
    post<TEntity extends ZodType, TInsert extends ZodType>(
        entitySchema: TEntity,
        insertSchema: TInsert,
    ) {
        return {
            body: insertSchema,
            response: {
                201: entitySchema,
                // Consider adding 400 for validation errors, though Fastify handles this by default
            },
        }
    },

    /**
     * Generates schema for an 'update' (PATCH or PUT) route.
     * Assumes ID is a UUID.
     * For PATCH, the updateSchema is often a partial of the entity.
     */
    update<TEntity extends ZodType, TUpdate extends ZodType>(
        entitySchema: TEntity,
        updateSchema: TUpdate,
    ) {
        return {
            params: UuidParamSchema,
            body: updateSchema,
            response: {
                200: entitySchema,
                404: NotFoundResponseSchema,
            },
        }
    },

    /**
     * Generates schema for a 'delete by ID' route.
     * Assumes ID is a UUID.
     */
    delete<TEntity extends ZodType>(
        // TEntity might just be for consistency, or for a specific delete response
        entitySchema?: TEntity, // Optional: if you want to return the deleted entity or a specific message
    ) {
        // If an entity schema is provided and you want to return it on successful delete (e.g. with a 200)
        const successResponse = entitySchema ? { 200: entitySchema } : { 204: z.null() } // 204 No Content is common

        return {
            params: UuidParamSchema,
            response: {
                ...successResponse,
                404: NotFoundResponseSchema,
            },
        }
    },
}
