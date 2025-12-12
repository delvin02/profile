import { error, fail, redirect, type Actions, type ServerLoadEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user } from '@/lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { userSettingsSchema } from './schema';
import { getAllThemes } from '@/lib/themes';

export async function load({ locals }: ServerLoadEvent) {
	if (!locals.auth) {
		throw redirect(302, '/login');
	}

	const [currentUser] = await db
		.select({
			linkedInUrl: user.linkedInUrl,
			tabIconUrl: user.tabIconUrl,
			resumeUrl: user.resumeUrl,
			theme: user.theme,
			googleTagId: user.googleTagId,
			metaDescription: user.metaDescription
		})
		.from(user)
		.where(eq(user.id, locals.auth.id))
		.limit(1);

	if (!currentUser) {
		throw error(404, 'User not found');
	}

	const form = await superValidate(currentUser, zod4(userSettingsSchema));

	return {
		form: form,
		themes: getAllThemes()
	};
}

export const actions: Actions = {
	default: async ({ locals, request }) => {
		if (!locals.auth) {
			throw error(400, 'Bad request: not authenticated');
		}

		const form = await superValidate(request, zod4(userSettingsSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { resumeUrl, linkedInUrl, theme, metaDescription, googleTagId, tabIconUrl } = form.data;

		await db
			.update(user)
			.set({
				tabIconUrl,
				linkedInUrl,
				resumeUrl,
				theme,
				metaDescription,
				googleTagId
			})
			.where(eq(user.id, locals.auth.id));

		return { form };
	}
};
