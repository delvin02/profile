import { mysqlTable, serial, varchar, json, bigint, text } from 'drizzle-orm/mysql-core';
import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { timestamps } from '../columns.helper';
import { blogTags } from './blogTags';

export const blog = mysqlTable('blog', {
	id: serial('id').primaryKey().autoincrement(),
	thumbnailUrl: varchar('thumbnail_url', { length: 512 }),
	title: varchar('title', { length: 256 }).notNull(),
	slug: varchar('slug', { length: 256 }).notNull().unique(),
	description: text('description').notNull(),
	content: json('content'),
	...timestamps
});

export const blogRelations = relations(blog, ({ one, many }) => ({
	blogTags: many(blogTags)
}));

export type NewBlog = InferInsertModel<typeof blog>;
export type Blog = InferSelectModel<typeof blog>;
