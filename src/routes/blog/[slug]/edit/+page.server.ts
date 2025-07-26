import { error, redirect, type Actions } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { blog } from '$lib/server/db/schema/blog';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { schema } from './schema';
import { tag } from '@/lib/server/db/schema/tag';
import { blogTags } from '@/lib/server/db/schema/blogTags';

export async function load({ params, locals }) {
	if (!locals.auth) {
		throw redirect(302, '/login');
	}

	const slug = params.slug;

	if (!slug) {
		throw error(400, 'Blog slug is missing');
	}

	const [post] = await db
		.select({
			id: blog.id,
			title: blog.title,
			description: blog.description,
			slug: blog.slug,
			thumbnailUrl: blog.thumbnailUrl,
			content: blog.content,
			createdAt: blog.createdAt,
			updatedAt: blog.updatedAt
		})
		.from(blog)
		.where(eq(blog.slug, slug))
		.limit(1);

	if (!post) {
		throw error(404, 'Blog post not found');
	}

	const allTags = await db.select({ id: tag.id, name: tag.name }).from(tag);

	const assigned = await db
		.select({ id: blogTags.tagId })
		.from(blogTags)
		.where(eq(blogTags.blogId, post.id))
		.then((rows) => rows.map((r) => r.id));

	const initialFormData = {
		...post,
		tags: assigned
	};

	const form = await superValidate(initialFormData, zod4(schema));

	return {
		blog: post,
		allTags,
		form,
		user: locals.auth
	};
}

export const actions: Actions = {
	default: async ({ params, request }) => {
		const form = await superValidate(request, zod4(schema));
		if (!form.valid) {
			return { form };
		}

		const { id, thumbnailUrl, title, description, content, tags } = form.data;

		await db
			.update(blog)
			.set({
				title,
				description,
				content,
				thumbnailUrl
			})
			.where(eq(blog.id, id));

		await db.delete(blogTags).where(eq(blogTags.blogId, id));

		if (tags.length) {
			const rows = tags.map((tagId) => ({ blogId: id, tagId }));
			await db.insert(blogTags).values(rows);
		}

		redirect(303, `/blog/${params.slug}`);
	}
};
