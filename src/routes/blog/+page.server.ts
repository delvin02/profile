import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { blog } from '$lib/server/db/schema/blog';
import { blogTags, tag } from '@/lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function load() {
	const posts = await db.query.blog.findMany({
		with: {
			blogTags: {
				with: {
					tag: true
				}
			}
		},
		orderBy: blog.createdAt
	});

	if (!posts) {
		throw error(404, 'Blog post not found');
	}

	const tags = await db
		.select({
			id: tag.id,
			name: tag.name
		})
		.from(tag)
		.innerJoin(blogTags, eq(blogTags.tagId, tag.id))
		.groupBy(tag.id, tag.name)
		.orderBy(tag.name);

	return {
		blogs: posts,
		tags
	};
}
