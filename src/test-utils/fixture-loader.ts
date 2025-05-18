import { db } from '../db/client';
import { users } from '../routes/user/user.schema';
import { userFixture } from '../routes/user/tests/user.fixture';
import { eq, inArray } from 'drizzle-orm';

type FixtureData = {
	[key: string]: any;
};

type Fixture = {
	tables: string;
	data: FixtureData;
};

// Store all fixtures
const fixtures: Record<string, Fixture> = {
	user: userFixture,
	// Add more fixtures here as needed
};

// Map of table names to their respective schema and queries
const tableHandlers = {
	users: {
		schema: users,
		idField: 'id' as const,
	},
	// Add more tables here as needed
} as const;

type TableName = keyof typeof tableHandlers;

/**
 * Load fixtures into the database
 * @param fixtureNames - Optional array of fixture names to load. If empty, loads all fixtures.
 */
export async function loadFixtures(fixtureNames: string[] = []) {
	const fixturesToLoad =
		fixtureNames.length > 0
			? fixtureNames.map((name) => fixtures[name]).filter(Boolean)
			: Object.values(fixtures);

	for (const fixture of fixturesToLoad) {
		await loadFixture(fixture);
	}
}

async function loadFixture(fixture: Fixture) {
	const { tables, data } = fixture;

	if (!(tables in tableHandlers)) {
		console.warn(`No handler found for table: ${tables}`);
		return;
	}

	const tableHandler = tableHandlers[tables as TableName];
	const records = Object.values(data);

	if (records.length === 0) return;

	console.log(`Loading ${records.length} records into ${tables}...`);

	// Insert all records in a single transaction
	await db.transaction(async (tx) => {
		for (const record of records) {
			await tx.insert(tableHandler.schema).values(record);
		}
	});

	console.log(`Successfully loaded ${records.length} records into ${tables}`);
}

/**
 * Clear fixtures from the database
 * @param fixtureNames - Optional array of fixture names to clear. If empty, clears all fixtures.
 */
export async function clearFixtures(fixtureNames: string[] = []) {
	const fixturesToClear =
		fixtureNames.length > 0
			? fixtureNames.map((name) => fixtures[name]).filter(Boolean)
			: Object.values(fixtures);

	// Process in reverse order to respect potential foreign key constraints
	for (const fixture of [...fixturesToClear].reverse()) {
		await clearFixture(fixture);
	}
}

async function clearFixture(fixture: Fixture) {
	const { tables, data } = fixture;

	if (!(tables in tableHandlers)) {
		console.warn(`No handler found for table: ${tables}`);
		return;
	}

	const tableHandler = tableHandlers[tables as TableName];
	const records = Object.values(data);

	if (records.length === 0) return;

	// Extract all IDs for deletion
	const ids = records.map((record) => record[tableHandler.idField]);

	console.log(`Clearing ${ids.length} records from ${tables}...`);

	// Delete all records in a single transaction
	await db
		.delete(tableHandler.schema)
		.where(inArray(tableHandler.schema[tableHandler.idField], ids));

	console.log(`Successfully cleared ${ids.length} records from ${tables}`);
}
