import { db } from '../db/client'
import { UserFixture } from '../routes/user/tests/user.fixture'

const fixtures = [new UserFixture()]

export async function loadFixtures() {
    // Load fixtures in order to respect potential foreign key constraints
    for (const fixture of fixtures) {
        await fixture.seedRecords(db)
    }
}

export async function clearFixtures() {
    // Clear in reverse order to respect potential foreign key constraints
    for (const fixture of [...fixtures].reverse()) {
        await fixture.clearRecords(db)
    }
}
