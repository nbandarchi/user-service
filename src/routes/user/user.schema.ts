import {
	pgTable,
	text,
	jsonb,
	uuid,
	index,
	timestamp,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Type for the user metadata
export type UserMetadata = {
	facilities: string[];
	defaultFacility: string;
};

export const users = pgTable(
	'users',
	{
		id: uuid('id').primaryKey().notNull().defaultRandom(),
		auth0Id: text('auth0_id').notNull().unique(),
		metadata: jsonb('metadata').$type<UserMetadata>(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => [index('auth0_id_idx').on(table.auth0Id)],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Schema for creating a new user
export const insertUserSchema = createInsertSchema(users, {
	auth0Id: z.string().min(1, { message: 'Auth0 ID is required' }),
	metadata: z.object({
		facilities: z.array(
			z.string().min(1, { message: 'Facility ID cannot be empty' }),
		),
		defaultFacility: z
			.string()
			.min(1, { message: 'Default facility is required' }),
	}),
});

// Schema for selecting a user
export const selectUserSchema = createSelectSchema(users);

// Schema for updating a user
export const updateUserSchema = insertUserSchema.partial();
