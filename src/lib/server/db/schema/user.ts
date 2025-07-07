import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from '../columns.helper';
import { blog } from './blog';

export const user = mysqlTable('user', {
	id: serial('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 256 }).notNull(),
	email: varchar('email', { length: 256 }).notNull().unique(),
	passwordHash: varchar('password_hash', { length: 60 }).notNull(), // <-- new
	...timestamps
});

export const userRelations = relations(user, ({ many }) => ({
	blogs: many(blog)
}));

export type NewUser = InferInsertModel<typeof user>;
export type User = InferSelectModel<typeof user>;
