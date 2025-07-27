import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { updateUserSchema } from './schema';
import { zod4 } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { user } from '@/lib/server/db/schema/user.js';

export const load = async ({ locals }) => {
	if (!locals.auth) {
		throw redirect(302, '/login');
	}

	const existingUser = await db.query.user.findFirst({
		where: eq(user.id, locals.auth.id)
	});

	const form = await superValidate(existingUser, zod4(updateUserSchema));

	return { form, user: locals.auth };
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		if (!locals.auth) {
			throw error(400, 'Bad request: not authenticated');
		}

		const form = await superValidate(request, zod4(updateUserSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { name, headline, profilePictureUrl, bio } = form.data;

		await db
			.update(user)
			.set({
				name,
				headline,
				profilePictureUrl,
				bio
			})
			.where(eq(user.id, locals.auth.id));

		redirect(303, `/`);
	}
};
