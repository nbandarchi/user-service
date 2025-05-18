import { exec } from 'child_process';
import { promisify } from 'util';
import { db } from '../src/db/client';
import { users } from '../src/routes/user/user.schema';

const execAsync = promisify(exec);

export async function setupTestDatabase() {
	try {
		// Start the test database
		await execAsync('docker-compose -f docker-compose.test.yml up -d');

		// Wait for the database to be ready
		await new Promise((resolve) => setTimeout(resolve, 5000));

		// Clear any existing data
		await db.delete(users);

		return true;
	} catch (error) {
		console.error('Failed to setup test database:', error);
		throw error;
	}
}

export async function teardownTestDatabase() {
	try {
		// Stop and remove the test database
		await execAsync('docker-compose -f docker-compose.test.yml down -v');
		return true;
	} catch (error) {
		console.error('Failed to teardown test database:', error);
		throw error;
	}
}

export async function clearDatabase() {
	try {
		await db.delete(users);
	} catch (error) {
		console.error('Failed to clear database:', error);
		throw error;
	}
}
