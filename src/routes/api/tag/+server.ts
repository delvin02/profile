import { db } from '@/lib/server/db';
import { tag } from '@/lib/server/db/schema/tag';
import { json, type RequestHandler } from '@sveltejs/kit';
import { TagBodyType } from './schema';
import { superValidate } from 'sveltekit-superforms/server';
import { zod4 } from 'sveltekit-superforms/adapters';

export const GET: RequestHandler = async () => {
	const allTags = await db.select({ id: tag.id, name: tag.name }).from(tag);

	return json(allTags);
};

export const POST: RequestHandler = async (event) => {
	const form = await superValidate(event.request, zod4(TagBodyType));

	if (!form.valid) {
		return json({ errors: form.errors }, { status: 400 });
	}

	const [created] = await db.insert(tag).values({ name: form.data.name });

	return json({ tag: created }, { status: 201 });
};
