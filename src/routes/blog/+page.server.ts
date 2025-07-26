import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { blog } from '$lib/server/db/schema/blog';
import { blogTags, tag } from '@/lib/server/db/schema';
import { eq, inArray } from 'drizzle-orm';

export async function load({ url }) {
	const tagsList = await db
		.select({ id: tag.id, name: tag.name })
		.from(tag)
		.innerJoin(blogTags, eq(blogTags.tagId, tag.id))
		.groupBy(tag.id, tag.name)
		.orderBy(tag.name);

	const tagIdParam = url.searchParams.get('tagId');
	let posts;
	if (tagIdParam) {
		const tagId = Number(tagIdParam);
		if (Number.isNaN(tagId)) throw error(400, 'Invalid tagId');

		const tagRows = await db.query.blogTags.findMany({
			where: eq(blogTags.tagId, tagId),
			columns: { blogId: true }
		});
		const blogIds = tagRows.map((r) => r.blogId);

		posts = await db.query.blog.findMany({
			where: inArray(blog.id, blogIds),
			with: {
				blogTags: { with: { tag: true } }
			},
			orderBy: blog.createdAt
		});
	} else {
		posts = await db.query.blog.findMany({
			with: {
				blogTags: { with: { tag: true } }
			},
			orderBy: blog.createdAt
		});
	}

	return { blogs: posts, tags: tagsList };
}
