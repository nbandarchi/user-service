import { db } from '../../db/client'
import { users, type User } from './user.schema'
import { eq } from 'drizzle-orm'
import { BaseService } from '../../lib/base-service'

export class UserService extends BaseService<typeof users> {
    public async getUserByAuth0Id(auth0Id: string): Promise<User | null> {
        const [user] = await this.db
            .select()
            .from(this.table)
            .where(eq(this.table.auth0Id, auth0Id))
            .limit(1)

        return user || null
    }
}

export const userService = new UserService(db, users)
