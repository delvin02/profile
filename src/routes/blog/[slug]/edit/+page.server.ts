import { error, redirect, type Actions } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { blog } from '$lib/server/db/schema/blog';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { schema } from './schema';

export async function load({ params }) {
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

	return {
		blog: post,
		form: await superValidate(post, zod4(schema))
	};
}

export const actions: Actions = {
	default: async ({ params, request }) => {
		const form = await superValidate(request, zod4(schema));
		if (!form.valid) {
			return { form };
		}

		const { id, thumbnailUrl, title, description, content } = form.data;
		console.log(form.data);
		await db
			.update(blog)
			.set({
				title,
				description,
				content,
				thumbnailUrl
			})
			.where(eq(blog.id, id));

		redirect(303, `/blog/${params.slug}`);
	}
};
