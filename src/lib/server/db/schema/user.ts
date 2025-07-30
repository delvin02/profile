import { relations } from 'drizzle-orm';
import { mysqlTable, int, varchar, json } from 'drizzle-orm/mysql-core';
import { timestamps } from '../columns.helper';
import { blog } from './blog';
import { tag } from './tag';

export type Theme = 'default' | 'claude' | 'mono' | 'modern-minimal' | string;

export const user = mysqlTable('user', {
	id: int('id').primaryKey().autoincrement(),
	subdomain: varchar('subdomain', { length: 256 }).unique().notNull(),
	name: varchar('name', { length: 256 }).notNull(),
	email: varchar('email', { length: 256 }).notNull().unique(),
	headline: varchar('headline', { length: 256 }).default(''),
	profilePictureUrl: varchar('profile_picture_url', { length: 256 }),
	passwordHash: varchar('password_hash', { length: 255 }).notNull(),
	linkedInUrl: varchar('linkedin_url', { length: 255 }),
	resumeUrl: varchar('resume_url', { length: 255 }),
	bio: json('bio'),
	googleTagId: varchar('google_tag_id', { length: 256 }),
	blogHeadline: varchar('blog_headline', { length: 256 }),
	theme: varchar('theme', { length: 255 }).$type<Theme>().notNull().default('default'),
	...timestamps
});

export const userRelations = relations(user, ({ many }) => ({
	blogs: many(blog),
	tags: many(tag)
}));

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
