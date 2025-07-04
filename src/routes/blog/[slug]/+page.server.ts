import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { blog } from '$lib/server/db/schema/blog';
import { eq } from 'drizzle-orm';

export async function load({ params }) {
	const slug = params.slug;

	if (!slug) {
		throw error(400, 'Blog slug is missing');
	}

	const post = await db.query.blog.findFirst({
		where: eq(blog.slug, slug),
		with: {
			author: true
		}
	});

	if (!post) {
		throw error(404, 'Blog post not found');
	}

	return {
		blog: post
	};
}
