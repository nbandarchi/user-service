import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import { userService } from '../user.service'
import { UserFixture } from './user.fixture'
import type { Uuid } from '@/lib/base-service'
import { loadFixtures, clearFixtures } from '@/test-utils/fixture-loader'

describe('UserService', () => {
    // Get the test user data from the fixture
    const userFixture = new UserFixture()
    const { testUser } = userFixture.data
    let testUserId: Uuid

    beforeEach(async () => {
        await clearFixtures()
        await loadFixtures()
    })

    afterAll(async () => {
        await clearFixtures()
    })

    // Get the test user ID before tests run
    beforeAll(() => {
        testUserId = testUser.id as Uuid
    })

    // describe('getUserById', () => {
    // 	it('should return a user by ID', async () => {
    // 		// Get the user by ID using the service
    // 		const user = await userService.getById(testUserId);

    // 		// Verify the user was retrieved correctly
    // 		expect(user).toBeDefined();
    // 		expect(user?.id).toBe(testUserId);
    // 		expect(user?.auth0Id).toBe(testUser.auth0Id);
    // 		expect(user?.metadata).toEqual(testUser.metadata);
    // 	});

    // 	it('should return null for non-existent user', async () => {
    // 		// Use a different UUID that doesn't exist in the database
    // 		const nonExistentId = '11111111-1111-1111-1111-111111111111';
    // 		const user = await userService.getById(nonExistentId);
    // 		expect(user).toBeNull();
    // 	});
    // });

    describe('getUserByAuth0Id', () => {
        it('should return a user by Auth0 ID', async () => {
            // Get the user by Auth0 ID using the service
            const user = await userService.getUserByAuth0Id(testUser.auth0Id)

            console.log(await userService.getAll())

            // Verify the user was retrieved correctly
            expect(user).toBeDefined()
            expect(user?.id).toBe(testUserId)
            expect(user?.auth0Id).toBe(testUser.auth0Id)
        })

        it('should return null for non-existent Auth0 ID', async () => {
            const user = await userService.getUserByAuth0Id('auth0|non-existent')
            expect(user).toBeNull()
        })
    })
})
