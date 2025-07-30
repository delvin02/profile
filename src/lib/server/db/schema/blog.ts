import { mysqlTable, varchar, json, text, int, timestamp } from 'drizzle-orm/mysql-core';
import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { timestamps } from '../columns.helper';
import { blogTags } from './blogTags';
import { user } from './user';

export const blog = mysqlTable('blog', {
	id: int('id').primaryKey().autoincrement(),
	userId: int('user_id')
		.notNull()
		.references(() => user.id),
	thumbnailUrl: varchar('thumbnail_url', { length: 512 }),
	title: varchar('title', { length: 256 }).notNull(),
	slug: varchar('slug', { length: 256 }).notNull().unique(),
	description: text('description').notNull(),
	content: json('content'),
	publishedAt: timestamp('published_at'),
	readingTime: int('reading_time'),
	...timestamps
});

export const blogRelations = relations(blog, ({ one, many }) => ({
	user: one(user, {
		fields: [blog.userId],
		references: [user.id]
	}),
	blogTags: many(blogTags)
}));

export type NewBlog = InferInsertModel<typeof blog>;
export type Blog = InferSelectModel<typeof blog>;
