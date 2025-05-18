import { beforeAll, afterAll, vi } from 'vitest';
import dotenv from 'dotenv';
import { loadFixtures, clearFixtures } from '../src/test-utils/fixture-loader';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment variables
process.env.NODE_ENV = 'test';

// Fixtures to load for tests
const TEST_FIXTURES = ['user'];

// Setup test environment
beforeAll(async () => {
	console.log('Setting up test environment...');

	try {
		// Clear any existing test data first
		await clearFixtures(TEST_FIXTURES);

		// Load all test fixtures
		await loadFixtures(TEST_FIXTURES);
		console.log('✅ Test fixtures loaded successfully');
	} catch (error) {
		console.error('❌ Failed to set up test fixtures');
		console.error(error);
		throw error;
	}
});

// Clean up after all tests
afterAll(async () => {
	console.log('Tearing down test environment...');
	try {
		await clearFixtures(TEST_FIXTURES);
	} catch (error) {
		console.error('Error during test teardown:', error);
	}
});

// Helper function to reset the test database
export async function resetTestDatabase() {
	try {
		await clearFixtures(TEST_FIXTURES);
		await loadFixtures(TEST_FIXTURES);
	} catch (error) {
		console.error('Error resetting test database:', error);
		throw error;
	}
	// Example: await execAsync('npm run db:reset');
}
