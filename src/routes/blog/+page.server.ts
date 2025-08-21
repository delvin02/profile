import { error, type ServerLoadEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { blog } from '$lib/server/db/schema/blog';
import { blogTags, tag, user } from '@/lib/server/db/schema';
import { desc, eq, inArray } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { isNull } from 'drizzle-orm';

export async function load({ locals, url }: ServerLoadEvent) {
	if (!locals.subdomain) {
		throw error(400, 'Subdomain not found');
	}

	const currentUser = await db.query.user.findFirst({
		columns: {
			passwordHash: false
		},
		where: eq(user.subdomain, locals.subdomain)
	});

	if (!currentUser) {
		throw error(404, 'User not found');
	}

	const tagsList = await db
		.select({ id: tag.id, name: tag.name })
		.from(tag)
		.innerJoin(blogTags, eq(blogTags.tagId, tag.id))
		.where(eq(tag.userId, currentUser.id))
		.groupBy(tag.id, tag.name)
		.orderBy(tag.name);

	const tagIdParam = url.searchParams.get('tagId');
	const whereConditions: SQL[] = [eq(blog.userId, currentUser.id)];

	if (!locals.auth) {
		whereConditions.push(isNull(blog.deletedAt));
	}

	if (tagIdParam) {
		const tagId = Number(tagIdParam);
		if (Number.isNaN(tagId)) throw error(400, 'Invalid tagId');

		const tagRows = await db.query.blogTags.findMany({
			where: eq(blogTags.tagId, tagId),
			columns: { blogId: true }
		});
		const blogIds = tagRows.map((r) => r.blogId);

		whereConditions.push(inArray(blog.id, blogIds));
	}

	const posts = await db.query.blog.findMany({
		where: (blog, { and }) => and(...whereConditions),
		with: {
			blogTags: { with: { tag: true } }
		},
		columns: {
			content: false
		},
		orderBy: desc(blog.publishedAt)
	});

	return { blogs: posts, tags: tagsList };
}
