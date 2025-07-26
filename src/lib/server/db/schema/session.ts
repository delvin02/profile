import { mysqlTable, varchar, int, timestamp } from 'drizzle-orm/mysql-core';
import { type InferSelectModel, type InferInsertModel, relations } from 'drizzle-orm';
import { user } from './user';
import { timestamps } from '../columns.helper';

export const session = mysqlTable('session', {
	id: varchar('id', { length: 255 }).notNull().primaryKey(),
	userId: int('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at').notNull(),
	...timestamps
});

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	})
}));

export type Session = InferSelectModel<typeof session>;
export type NewSession = InferInsertModel<typeof session>;
