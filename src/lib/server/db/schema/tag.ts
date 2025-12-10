import { mysqlTable, varchar, int } from 'drizzle-orm/mysql-core';
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { blogTags } from './blogTags';
import { user } from './user';

export const tag = mysqlTable('tag', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 100 }).notNull(),
	userId: int('user_id')
		.notNull()
		.references(() => user.id)
});

export const tagRelations = relations(tag, ({ one, many }) => ({
	user: one(user, {
		fields: [tag.userId],
		references: [user.id]
	}),
	blogTags: many(blogTags)
}));

export type Tag = InferSelectModel<typeof tag>;
export type NewTag = InferInsertModel<typeof tag>;
