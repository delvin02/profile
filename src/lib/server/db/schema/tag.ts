import { mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { blogTags } from './blogTags';

export const tag = mysqlTable('tag', {
	id: serial('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 100 }).notNull().unique()
});

export const tagRelations = relations(tag, ({ many }) => ({
	blogTags: many(blogTags)
}));

export type Tag = InferSelectModel<typeof tag>;
export type NewTag = InferInsertModel<typeof tag>;
