import { Type, Static } from '@sinclair/typebox';
import { z } from 'zod';

// Common response schemas
export const errorResponseSchema = Type.Object({
	message: Type.String(),
});

export const successResponseSchema = Type.Object({
	success: Type.Boolean(),
});

// Helper to convert Zod schema to TypeBox schema for Fastify
// Note: This is a simplified approach - a complete implementation would need to handle
// all Zod schema types and their TypeBox equivalents
export function zodToTypeBox(zodSchema: z.ZodType<any>): any {
	// This would be expanded based on your specific needs
	const jsonSchema = zodSchema.shape || {};

	const typeBoxSchema: Record<string, any> = {};

	for (const [key, value] of Object.entries(jsonSchema)) {
		if (value instanceof z.ZodString) {
			typeBoxSchema[key] = Type.String();
		} else if (value instanceof z.ZodNumber) {
			typeBoxSchema[key] = Type.Number();
		} else if (value instanceof z.ZodBoolean) {
			typeBoxSchema[key] = Type.Boolean();
		} else if (value instanceof z.ZodArray) {
			typeBoxSchema[key] = Type.Array(Type.Any());
		} else if (value instanceof z.ZodObject) {
			typeBoxSchema[key] = zodToTypeBox(value);
		} else if (value instanceof z.ZodNullable) {
			typeBoxSchema[key] = Type.Optional(Type.Any());
		} else if (value instanceof z.ZodDate) {
			typeBoxSchema[key] = Type.String({ format: 'date-time' });
		} else if (value instanceof z.ZodUndefined || value instanceof z.ZodNull) {
			typeBoxSchema[key] = Type.Null();
		} else {
			typeBoxSchema[key] = Type.Any();
		}
	}

	return Type.Object(typeBoxSchema);
}

// Create standard route schema configurations
export function createRouteSchemas(options: {
	responseSchema: z.ZodType<any> | any;
	bodySchema?: z.ZodType<any> | any;
	querySchema?: z.ZodType<any> | any;
	paramsSchema?: any;
	tags?: string[];
}) {
	const {
		responseSchema,
		bodySchema,
		querySchema,
		paramsSchema = {},
		tags = [],
	} = options;

	// Convert Zod schemas to TypeBox if needed
	const responseTypeBox =
		responseSchema instanceof z.ZodType
			? zodToTypeBox(responseSchema)
			: responseSchema;

	const bodyTypeBox =
		bodySchema instanceof z.ZodType ? zodToTypeBox(bodySchema) : bodySchema;

	const queryTypeBox =
		querySchema instanceof z.ZodType ? zodToTypeBox(querySchema) : querySchema;

	// Build the schema object
	const schema: any = {
		tags,
	};

	if (bodyTypeBox) {
		schema.body = bodyTypeBox;
	}

	if (queryTypeBox) {
		schema.querystring = queryTypeBox;
	}

	if (Object.keys(paramsSchema).length > 0) {
		schema.params = Type.Object(paramsSchema);
	}

	schema.response = {
		200: responseTypeBox,
		404: errorResponseSchema,
		400: errorResponseSchema,
		500: errorResponseSchema,
	};

	return schema;
}

// Common route parameter schemas
export const uuidParamSchema = {
	id: Type.String({ format: 'uuid' }),
};

// Helper to create a GET by ID route schema
export function createGetByIdSchema(
	responseSchema: z.ZodType<any> | any,
	tags: string[] = [],
) {
	return createRouteSchemas({
		responseSchema,
		paramsSchema: uuidParamSchema,
		tags,
	});
}

// Helper to create a POST route schema
export function createPostSchema(
	responseSchema: z.ZodType<any> | any,
	bodySchema: z.ZodType<any> | any,
	tags: string[] = [],
) {
	const schema = createRouteSchemas({
		responseSchema,
		bodySchema,
		tags,
	});

	// Override for 201 response
	schema.response[201] = schema.response[200];
	delete schema.response[200];

	return schema;
}

// Helper to create a PATCH route schema
export function createPatchSchema(
	responseSchema: z.ZodType<any> | any,
	bodySchema: z.ZodType<any> | any,
	tags: string[] = [],
) {
	return createRouteSchemas({
		responseSchema,
		bodySchema,
		paramsSchema: uuidParamSchema,
		tags,
	});
}

// Helper to create a DELETE route schema
export function createDeleteSchema(tags: string[] = []) {
	return createRouteSchemas({
		responseSchema: successResponseSchema,
		paramsSchema: uuidParamSchema,
		tags,
	});
}
