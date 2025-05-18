import { db, type DbClient } from '../../db/client';
import { users, type User } from './user.schema';
import { eq } from 'drizzle-orm';
import { BaseService } from '../../lib/base-service';

export class UserService extends BaseService<typeof users> {
	constructor(db: DbClient, table: typeof users) {
		super(db, table);
	}

	/**
	 * Get a user by Auth0 ID
	 */
	public async getUserByAuth0Id(auth0Id: string): Promise<User | null> {
		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.auth0Id, auth0Id))
			.limit(1);

		return user || null;
	}
}

export const userService = new UserService(db, users);
