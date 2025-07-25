import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema',
	out: './drizzle',
	dbCredentials: { url: process.env.DATABASE_URL },
	verbose: true,
	strict: true,
	dialect: 'mysql',
	migrations: {
		prefix: 'timestamp',
		table: '__drizzle_migrations__',
		schema: 'public'
	}
});
