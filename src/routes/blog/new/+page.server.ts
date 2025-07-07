import { error, redirect, type Actions } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { blog, type NewBlog } from '$lib/server/db/schema/blog';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { tag } from '@/lib/server/db/schema/tag';
import { blogTags } from '@/lib/server/db/schema/blogTags';
import { createBlogSchema } from './schema';
import { slugify } from '@/lib/utils/blog';

export async function load() {
	const allTags = await db.select({ id: tag.id, name: tag.name }).from(tag);

	const form = await superValidate(
		{ title: 'Title here', description: 'Description here', content: {}, tags: [] },
		zod4(createBlogSchema)
	);

	return { allTags, form };
}

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(createBlogSchema));
		if (!form.valid) {
			return { form };
		}

		const { title, description, content, thumbnailUrl, tags } = form.data;

		const slug = slugify(title);
		const newBlog: NewBlog = {
			title,
			description,
			thumbnailUrl,
			slug,
			content,
			userId: 1
		};

		const [inserted] = await db.insert(blog).values(newBlog).$returningId();

		if (!inserted) {
			throw error(500, 'Failed to create blog');
		}

		if (tags.length) {
			const rows = tags.map((tagId) => ({
				blogId: inserted.id,
				tagId
			}));
			await db.insert(blogTags).values(rows);
		}

		throw redirect(303, `/blog/${slug}`);
	}
};
