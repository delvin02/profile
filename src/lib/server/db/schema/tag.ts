import { mysqlTable, serial, varchar, bigint } from 'drizzle-orm/mysql-core';
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { blogTags } from './blogTags';
import { user } from './user';

export const tag = mysqlTable('tag', {
	id: serial('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 100 }).notNull().unique(),
	userId: bigint('user_id', { mode: 'number', unsigned: true })
		.notNull()
		.references(() => user.id)
});

export const tagRelations = relations(tag, ({ many }) => ({
	blogTags: many(blogTags)
}));

export type Tag = InferSelectModel<typeof tag>;
export type NewTag = InferInsertModel<typeof tag>;
