import { BaseFixture } from '@/lib/base-fixture'
import { users } from '../user.schema'

export class UserFixture extends BaseFixture<typeof users> {
    schema = users
    data = {
        testUser: {
            id: '550e8400-e29b-41d4-a716-446655440000', // Valid UUID v4
            auth0Id: 'auth0|1234567890',
            metadata: {
                facilities: ['facility1', 'facility2'],
                defaultFacility: 'facility1',
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    }
}
