import { mysqlTable, primaryKey, bigint } from 'drizzle-orm/mysql-core';
import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { blog } from './blog';
import { tag } from './tag';

export const blogTags = mysqlTable(
	'blog_tags',
	{
		blogId: bigint('blog_id', { mode: 'number', unsigned: true })
			.notNull()
			.references(() => blog.id),
		tagId: bigint('tag_id', { mode: 'number', unsigned: true })
			.notNull()
			.references(() => tag.id)
	},
	(t) => [primaryKey({ columns: [t.blogId, t.tagId] })]
);

export const blogTagsRelations = relations(blogTags, ({ one }) => ({
	blog: one(blog, { fields: [blogTags.blogId], references: [blog.id] }),
	tag: one(tag, { fields: [blogTags.tagId], references: [tag.id] })
}));

export type BlogTag = InferSelectModel<typeof blogTags>;
export type NewBlogTag = InferInsertModel<typeof blogTags>;
