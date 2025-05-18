import { users } from '../routes/user/user.schema';

// Export all schemas
export const schema = {
	users,
};

// Export types
export * from '../routes/user/user.schema';

// This will be used by Drizzle Kit for migrations
export * from 'drizzle-orm/pg-core';
