import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { db } from './db';
import { user } from './db/schema';
import { eq } from 'drizzle-orm';

export type User = { id: number; email: string };

export async function createUser(name: string, email: string, password: string): Promise<User> {
	const passwordHash = await bcrypt.hash(password, 12);

	const [inserted] = await db
		.insert(user)
		.values({
			name,
			email,
			passwordHash
		})
		.$returningId();

	const currentUser = await db.query.user.findFirst({ where: eq(user.id, inserted.id) });
	if (!currentUser) {
		throw new Error('User not found');
	}
	return currentUser;
}

export async function authenticate(email: string, password: string): Promise<User | null> {
	const row = await db
		.select({ id: id, email: email, passwordHash: passwordHash })
		.from(user)
		.where(eq(user.email, email))
		.limit(1)
		.then((rs) => rs[0]);

	if (!row) return null;
	const match = await bcrypt.compare(password, row.passwordHash);
	if (!match) return null;

	return { id: row.id, email: row.email };
}
