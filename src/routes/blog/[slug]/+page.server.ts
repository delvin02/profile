import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { blog } from '$lib/server/db/schema/blog';
import { eq } from 'drizzle-orm';
import { user } from '@/lib/server/db/schema/user.js';

export async function load({ params, locals }) {
	if (!locals.subdomain) {
		throw error(400, 'Subdomain not found');
	}

	const slug = params.slug;

	if (!slug) {
		throw error(400, 'Blog slug is missing');
	}

	const post = await db.query.blog.findFirst({
		where: eq(blog.slug, slug)
	});

	if (!post) {
		throw error(404, 'Blog post not found');
	}

	const currentUser = await db.query.user.findFirst({
		where: eq(user.subdomain, locals.subdomain)
	});

	if (!currentUser) {
		throw error(404, 'Blog post not found');
	}

	return {
		blog: post,
		user: currentUser
	};
}
