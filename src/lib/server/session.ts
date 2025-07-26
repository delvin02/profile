import { nanoid } from 'nanoid';
import { db } from '$lib/server/db';
import { and, eq, gt } from 'drizzle-orm';
import { session, type NewSession } from './db/schema';

export async function createSession(userId: number) {
	const id = nanoid();
	const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
	const newSession: NewSession = { id, userId, expiresAt };
	await db.insert(session).values(newSession);
	return id;
}

export async function getSession(id: string) {
	return db.query.session.findFirst({
		where: and(eq(session.id, id), gt(session.expiresAt, new Date())),
		columns: {
			userId: true
		},
		with: {
			user: true
		}
	});
}

export async function deleteSession(id: string) {
	return db.delete(session).where(eq(session.id, id));
}
