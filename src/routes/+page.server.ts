import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { blog } from '$lib/server/db/schema/blog';
import { blogTags, tag, user } from '@/lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function load({ locals }) {
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

	const posts = await db.query.blog.findMany({
		with: {
			blogTags: {
				with: {
					tag: true
				}
			}
		},
		orderBy: blog.createdAt,
		limit: 2
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
		tags,
		user: currentUser
	};
}
