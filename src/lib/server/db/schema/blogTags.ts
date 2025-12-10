import { mysqlTable, timestamp, int, unique } from 'drizzle-orm/mysql-core';
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { blog } from './blog';
import { tag } from './tag';

export const blogTags = mysqlTable(
	'blog_tags',
	{
		id: int('id').primaryKey().autoincrement(),
		blogId: int('blog_id')
			.notNull()
			.references(() => blog.id),
		tagId: int('tag_id')
			.notNull()
			.references(() => tag.id),
		createdAt: timestamp('created_at').defaultNow()
	},
	(table) => ({
		unique: unique().on(table.blogId, table.tagId)
	})
);

export const blogTagsRelations = relations(blogTags, ({ one }) => ({
	blog: one(blog, { fields: [blogTags.blogId], references: [blog.id] }),
	tag: one(tag, { fields: [blogTags.tagId], references: [tag.id] })
}));

export type BlogTag = InferSelectModel<typeof blogTags>;
export type NewBlogTag = InferInsertModel<typeof blogTags>;
