import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import { buildServer } from '../../../server'
import type { FastifyInstance } from 'fastify'
import { UserFixture } from './user.fixture'
import { clearFixtures, loadFixtures } from '@/test-utils/fixture-loader'

describe('User Routes', () => {
    let server: FastifyInstance
    const userFixture = new UserFixture()
    const testUser = userFixture.data.testUser

    // Set up the server before running tests
    beforeAll(async () => {
        server = buildServer()
        await server.ready()
    })

    beforeEach(async () => {
        await clearFixtures()
        await loadFixtures()
    })

    afterAll(async () => {
        await clearFixtures()
    })

    describe('GET /api/users/:id', () => {
        it('should return a user when valid ID is provided', async () => {
            const response = await server.inject({
                method: 'GET',
                url: `/api/users/${testUser.id}`,
            })

            expect(response.statusCode).toBe(200)

            const responseBody = JSON.parse(response.body)
            expect(responseBody).toBeDefined()
            expect(responseBody.id).toBe(testUser.id)
            expect(responseBody.auth0Id).toBe(testUser.auth0Id)
            expect(responseBody.metadata).toEqual(testUser.metadata)
        })

        it('should return 404 when user is not found', async () => {
            const nonExistentId = '11111111-1111-1111-1111-111111111111'

            const response = await server.inject({
                method: 'GET',
                url: `/api/users/${nonExistentId}`,
            })

            expect(response.statusCode).toBe(404)

            const responseBody = JSON.parse(response.body)
            expect(responseBody.message).toBe('User not found')
        })

        it('should return 400 when invalid UUID is provided', async () => {
            const invalidId = 'not-a-uuid'

            const response = await server.inject({
                method: 'GET',
                url: `/api/users/${invalidId}`,
            })

            expect(response.statusCode).toBe(400)
        })
    })
})
