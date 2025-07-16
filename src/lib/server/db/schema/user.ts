import { relations } from 'drizzle-orm';
import { mysqlTable, serial, varchar, json } from 'drizzle-orm/mysql-core';
import { timestamps } from '../columns.helper';
import { blog } from './blog';

export const user = mysqlTable('user', {
	id: serial('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 256 }).notNull(),
	email: varchar('email', { length: 256 }).notNull().unique(),
	profilePictureUrl: varchar('profile_picture_url', { length: 256 }),
	passwordHash: varchar('password_hash', { length: 255 }).notNull(),
	linkedInUrl: varchar('linkedin_url', { length: 255 }),
	resumeUrl: varchar('resume_url', { length: 255 }),
	bio: json('bio'),
	...timestamps
});

export const userRelations = relations(user, ({ many }) => ({
	blogs: many(blog)
}));

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
