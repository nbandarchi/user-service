import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import { db } from '../src/db/client';
import { users } from '../src/routes/user/user.schema';
import { eq } from 'drizzle-orm';

// Test data
const testUser = {
  auth0Id: 'auth0|1234567890',
  metadata: {
    facilities: ['facility1', 'facility2'],
    defaultFacility: 'facility1'
  },
};

describe('User Schema', () => {
  beforeAll(async () => {
    // Ensure the database is clean before running tests
    await db.delete(users);
  });

  afterAll(async () => {
    // Clean up after all tests
    await db.delete(users);
  });

  beforeEach(async () => {
    // Clear the users table before each test
    await db.delete(users);
  });

  it('should create a new user', async () => {
    // Insert a new user
    const [newUser] = await db
      .insert(users)
      .values({
        auth0Id: testUser.auth0Id,
        metadata: testUser.metadata
      })
      .returning();

    // Verify the user was created with the correct data
    expect(newUser).toMatchObject({
      auth0Id: testUser.auth0Id,
      metadata: testUser.metadata,
    });
    expect(newUser.id).toBeDefined();
    expect(newUser.createdAt).toBeInstanceOf(Date);
    expect(newUser.updatedAt).toBeInstanceOf(Date);
  });

  it('should not allow duplicate auth0Id', async () => {
    // Insert the first user
    await db.insert(users).values({
      auth0Id: testUser.auth0Id,
      metadata: testUser.metadata
    });

    // Try to insert a user with the same auth0Id
    try {
      await db.insert(users).values({
        auth0Id: testUser.auth0Id,
        metadata: {
          facilities: ['facility3'],
          defaultFacility: 'facility3'
        }
      });
      // If we get here, the test should fail
      expect.fail('Should not allow duplicate auth0Id');
    } catch (error) {
      // We expect an error to be thrown for duplicate key
      expect(error).toBeDefined();
    }
  });

  it('should update a user', async () => {
    // Insert a user
    const [user] = await db.insert(users).values({
      auth0Id: testUser.auth0Id,
      metadata: testUser.metadata
    }).returning();
    
    // Update the user
    const updatedMetadata = { 
      ...testUser.metadata, 
      defaultFacility: 'facility2' 
    };
    
    const [updatedUser] = await db
      .update(users)
      .set({ 
        metadata: updatedMetadata,
        updatedAt: new Date() 
      })
      .where(eq(users.id, user.id))
      .returning();

    // Verify the user was updated
    expect(updatedUser.metadata).toEqual(updatedMetadata);
    expect(updatedUser.updatedAt.getTime()).toBeGreaterThanOrEqual(
      user.updatedAt.getTime()
    );
  });
});
