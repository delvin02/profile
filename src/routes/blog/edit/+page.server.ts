import { error, redirect, type Actions } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user } from '@/lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { blogPageEditSchema } from './schema';

export async function load({ locals }) {
	if (!locals.auth) {
		throw redirect(302, '/login');
	}

	const [currentUser] = await db
		.select({
			blogHeadline: user.blogHeadline
		})
		.from(user)
		.where(eq(user.id, locals.auth.id))
		.limit(1);

	if (!currentUser) {
		throw error(404, 'User not found');
	}

	const initialFormData = {
		blogHeadline: currentUser.blogHeadline ?? null
	};

	const form = await superValidate(initialFormData, zod4(blogPageEditSchema));

	return {
		form
	};
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.auth) {
			throw redirect(302, '/login');
		}
		const form = await superValidate(request, zod4(blogPageEditSchema));
		if (!form.valid) {
			return { form };
		}

		const { blogHeadline } = form.data;

		const result = await db.update(user).set({ blogHeadline }).where(eq(user.id, locals.auth.id));

		if (!result) {
			throw error(400, 'Failed to update headline');
		}

		throw redirect(303, `/blog`);
	}
};
