import { describe, it, expect, beforeAll } from 'vitest';
import { userService } from '../user.service';
import { userFixture } from './user.fixture';

describe('UserService', () => {
  // Get the test user data from the fixture
  const testUser = userFixture.data.testUser;
  let testUserId: string;

  // Get the test user ID before tests run
  beforeAll(() => {
    testUserId = testUser.id;
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      // Get the user by ID using the service
      const user = await userService.getUserById(testUserId);
      
      // Verify the user was retrieved correctly
      expect(user).toBeDefined();
      expect(user?.id).toBe(testUserId);
      expect(user?.auth0Id).toBe(testUser.auth0Id);
      expect(user?.metadata).toEqual(testUser.metadata);
    });

    it('should return null for non-existent user', async () => {
      // Use a different UUID that doesn't exist in the database
      const nonExistentId = '11111111-1111-1111-1111-111111111111';
      const user = await userService.getUserById(nonExistentId);
      expect(user).toBeNull();
    });
  });

  describe('getUserByAuth0Id', () => {
    it('should return a user by Auth0 ID', async () => {
      // Get the user by Auth0 ID using the service
      const user = await userService.getUserByAuth0Id(testUser.auth0Id);
      
      // Verify the user was retrieved correctly
      expect(user).toBeDefined();
      expect(user?.id).toBe(testUserId);
      expect(user?.auth0Id).toBe(testUser.auth0Id);
    });

    it('should return null for non-existent Auth0 ID', async () => {
      const user = await userService.getUserByAuth0Id('auth0|non-existent');
      expect(user).toBeNull();
    });
  });
});