import { error, redirect, type Actions, type ServerLoadEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { blog, type NewBlog } from '$lib/server/db/schema/blog';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { tag } from '@/lib/server/db/schema/tag';
import { blogTags } from '@/lib/server/db/schema/blogTags';
import { createBlogSchema } from './schema';
import { slugify } from '@/lib/utils/blog';
import { eq } from 'drizzle-orm';
import { user } from '@/lib/server/db/schema';

export async function load({ locals }: ServerLoadEvent) {
	if (!locals.auth) {
		throw redirect(302, '/login');
	}

	const currentUser = await db.query.user.findFirst({
		columns: {
			passwordHash: false
		},
		where: eq(user.id, locals.auth.id)
	});

	if (!currentUser) {
		throw error(404, 'User not found');
	}
	const allTags = await db
		.select({ id: tag.id, name: tag.name })
		.from(tag)
		.where(eq(tag.userId, currentUser.id));

	const form = await superValidate(
		{ title: '', description: '', content: {}, tags: [] },
		zod4(createBlogSchema)
	);

	return { allTags, form, user: locals.auth };
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.auth) {
			throw redirect(302, '/login');
		}
		const form = await superValidate(request, zod4(createBlogSchema));
		if (!form.valid) {
			return { form };
		}

		const { title, description, content, thumbnailUrl, tags, publishedAt, readingTime } = form.data;

		const slug = slugify(title);
		const newBlog: NewBlog = {
			userId: locals.auth.id,
			title,
			description,
			thumbnailUrl,
			slug,
			content,
			publishedAt: publishedAt ? new Date(publishedAt) : null,
			readingTime
		};

		const [inserted] = await db.insert(blog).values(newBlog).$returningId();

		if (!inserted) {
			throw error(400, 'Failed to create blog');
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
