import {
	type FastifyInstance,
	type FastifyReply,
	type FastifyRequest,
	RouteOptions,
} from 'fastify';
import { Type } from '@sinclair/typebox';
import type { z } from 'zod';
import {
	createGetByIdSchema,
	createPostSchema,
	createPatchSchema,
	createDeleteSchema,
	errorResponseSchema,
} from './schema-utils';

// Generic handler type
type RouteHandler = (
	request: FastifyRequest,
	reply: FastifyReply,
) => Promise<any>;

// Options for route creation
interface RouteDefinitionOptions {
	path: string;
	schema: any;
	handler: RouteHandler;
}

// Base interface for services with common CRUD operations
export interface CrudService<T, CreateT = any, UpdateT = any> {
	getById(id: string): Promise<T | null>;
	create?(data: CreateT): Promise<T>;
	update?(id: string, data: UpdateT): Promise<T | null>;
	delete?(id: string): Promise<boolean>;
}

// Route builder class
export class RouteBuilder {
	constructor(private fastify: FastifyInstance) {}

	// Add a GET route
	get(options: RouteDefinitionOptions): RouteBuilder {
		this.fastify.get(options.path, { schema: options.schema }, options.handler);
		return this;
	}

	// Add a POST route
	post(options: RouteDefinitionOptions): RouteBuilder {
		this.fastify.post(
			options.path,
			{ schema: options.schema },
			options.handler,
		);
		return this;
	}

	// Add a PATCH route
	patch(options: RouteDefinitionOptions): RouteBuilder {
		this.fastify.patch(
			options.path,
			{ schema: options.schema },
			options.handler,
		);
		return this;
	}

	// Add a DELETE route
	delete(options: RouteDefinitionOptions): RouteBuilder {
		this.fastify.delete(
			options.path,
			{ schema: options.schema },
			options.handler,
		);
		return this;
	}

	// Add a standard GET by ID route
	getById<T>(
		path: string,
		responseSchema: z.ZodType<T> | any,
		service: CrudService<T>,
		tags: string[] = [],
	): RouteBuilder {
		return this.get({
			path,
			schema: createGetByIdSchema(responseSchema, tags),
			handler: async (request, reply) => {
				const { id } = request.params as { id: string };
				const entity = await service.getById(id);

				if (!entity) {
					return reply.code(404).send({ message: 'Entity not found' });
				}

				return entity;
			},
		});
	}

	// Add a standard POST route
	createEntity<T, CreateT>(
		path: string,
		responseSchema: z.ZodType<T> | any,
		bodySchema: z.ZodType<CreateT> | any,
		service: CrudService<T, CreateT>,
		tags: string[] = [],
	): RouteBuilder {
		if (!service.create) {
			throw new Error('Service does not implement create method');
		}

		return this.post({
			path,
			schema: createPostSchema(responseSchema, bodySchema, tags),
			handler: async (request, reply) => {
				const data = request.body as CreateT;
				const newEntity = await service.create!(data);
				return reply.code(201).send(newEntity);
			},
		});
	}

	// Add a standard PATCH route
	updateEntity<T, UpdateT>(
		path: string,
		responseSchema: z.ZodType<T> | any,
		bodySchema: z.ZodType<UpdateT> | any,
		service: CrudService<T, any, UpdateT>,
		tags: string[] = [],
	): RouteBuilder {
		if (!service.update) {
			throw new Error('Service does not implement update method');
		}

		return this.patch({
			path,
			schema: createPatchSchema(responseSchema, bodySchema, tags),
			handler: async (request, reply) => {
				const { id } = request.params as { id: string };
				const data = request.body as UpdateT;
				const updatedEntity = await service.update!(id, data);

				if (!updatedEntity) {
					return reply.code(404).send({ message: 'Entity not found' });
				}

				return updatedEntity;
			},
		});
	}

	// Add a standard DELETE route
	deleteEntity<T>(
		path: string,
		service: CrudService<T>,
		tags: string[] = [],
	): RouteBuilder {
		if (!service.delete) {
			throw new Error('Service does not implement delete method');
		}

		return this.delete({
			path,
			schema: createDeleteSchema(tags),
			handler: async (request, reply) => {
				const { id } = request.params as { id: string };
				const success = await service.delete!(id);

				if (!success) {
					return reply.code(404).send({ message: 'Entity not found' });
				}

				return { success };
			},
		});
	}

	// Add all CRUD routes at once
	addCrudRoutes<T, CreateT, UpdateT>(
		basePath: string,
		responseSchema: z.ZodType<T> | any,
		createSchema: z.ZodType<CreateT> | any,
		updateSchema: z.ZodType<UpdateT> | any,
		service: CrudService<T, CreateT, UpdateT>,
		tags: string[] = [],
	): RouteBuilder {
		this.getById(`${basePath}/:id`, responseSchema, service, tags);

		if (service.create) {
			this.createEntity(basePath, responseSchema, createSchema, service, tags);
		}

		if (service.update) {
			this.updateEntity(
				`${basePath}/:id`,
				responseSchema,
				updateSchema,
				service,
				tags,
			);
		}

		if (service.delete) {
			this.deleteEntity(`${basePath}/:id`, service, tags);
		}

		return this;
	}
}
