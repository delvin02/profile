import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { blog } from '$lib/server/db/schema/blog';

export async function load() {
	const posts = await db.query.blog.findMany({
		with: {
			author: true
		},
		orderBy: blog.createdAt
	});

	if (!posts) {
		throw error(404, 'Blog post not found');
	}

	return {
		blog: posts
	};
}
