#!/usr/bin/env node
import 'dotenv/config';
import { loadFixtures, clearFixtures } from '../src/test-utils/fixture-loader';

async function main() {
	const command = process.argv[2];
	const fixtureNames = process.argv.slice(3);

	try {
		switch (command) {
			case 'load':
				console.log('Loading fixtures...');
				await clearFixtures(fixtureNames);
				await loadFixtures(fixtureNames);
				console.log('Fixtures loaded successfully');
				break;

			case 'clear':
				console.log('Clearing fixtures...');
				await clearFixtures(fixtureNames);
				console.log('Fixtures cleared successfully');
				break;

			case 'reload':
				console.log('Reloading fixtures...');
				await clearFixtures(fixtureNames);
				await loadFixtures(fixtureNames);
				console.log('Fixtures reloaded successfully');
				break;

			default:
				console.log(`
Usage: ts-node scripts/load-fixtures.ts <command> [fixtureNames...]

Commands:
  load     Load the specified fixtures (or all if none specified)
  clear    Clear the specified fixtures (or all if none specified)
  reload   Clear and then load the specified fixtures (or all if none specified)

Examples:
  Load all fixtures:          ts-node scripts/load-fixtures.ts load
  Load specific fixtures:      ts-node scripts/load-fixtures.ts load user
  Clear all fixtures:          ts-node scripts/load-fixtures.ts clear
  Clear specific fixtures:     ts-node scripts/load-fixtures.ts clear user
  Reload all fixtures:         ts-node scripts/load-fixtures.ts reload
  Reload specific fixtures:    ts-node scripts/load-fixtures.ts reload user
`);
				process.exit(1);
		}
	} catch (error) {
		console.error('Error:', error);
		process.exit(1);
	}
}

main();
