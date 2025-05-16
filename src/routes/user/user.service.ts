import { db } from '../../db/client';
import { users, User, NewUser, UserMetadata } from './user.schema';
import { eq } from 'drizzle-orm';

export class UserService {
  /**
   * Get a user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user || null;
  }

  /**
   * Get a user by Auth0 ID
   */
  async getUserByAuth0Id(auth0Id: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.auth0Id, auth0Id))
      .limit(1);

    return user || null;
  }

  /**
   * Create a new user
   */
  async createUser(userData: NewUser): Promise<User> {
    const [newUser] = await db
      .insert(users)
      .values(userData)
      .returning();

    return newUser;
  }

  /**
   * Update a user
   */
  async updateUser(id: string, userData: Partial<NewUser>): Promise<User | null> {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    return updatedUser || null;
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<boolean> {
    const result = await db
      .delete(users)
      .where(eq(users.id, id));

    return result.rowCount > 0;
  }
}

export const userService = new UserService();