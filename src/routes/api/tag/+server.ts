import { db } from '@/lib/server/db';
import { tag } from '@/lib/server/db/schema/tag';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { TagBodyType } from './schema';
import { superValidate } from 'sveltekit-superforms/server';
import { zod4 } from 'sveltekit-superforms/adapters';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.auth) {
		return json([], { status: 401 });
	}

	const allTags = await db
		.select({ id: tag.id, name: tag.name })
		.from(tag)
		.where(eq(tag.userId, locals.auth.id));

	return json(allTags);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.auth) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const form = await superValidate(request, zod4(TagBodyType));
	if (!form.valid) {
		return json({ errors: form.errors }, { status: 400 });
	}

	const [inserted] = await db
		.insert(tag)
		.values({
			name: form.data.name,
			userId: locals.auth.id
		})
		.$returningId();

	if (!inserted.id) {
		throw error(400, 'Failed to create user');
	}

	const newTag = await db.query.tag.findFirst({
		where: eq(tag.id, inserted.id)
	});

	return json({ tag: newTag }, { status: 201 });
};
