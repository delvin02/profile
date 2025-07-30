import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { zod4 } from 'sveltekit-superforms/adapters';
import { compare } from 'bcryptjs';
import { db } from '$lib/server/db';
import { user } from '@/lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { createSession } from '@/lib/server/session';
import { loginSchema } from './schema.js';

export async function load({ locals }) {
	if (locals.auth) {
		throw redirect(302, '/');
	}
	const form = await superValidate(zod4(loginSchema));
	return { form };
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password } = form.data;

		const existing = await db.query.user.findFirst({
			where: eq(user.email, email)
		});

		if (!existing) {
			return message(form, 'Invalid user', { status: 400 });
		}

		const ok = await compare(password, existing.passwordHash);
		if (!ok) {
			return message(form, 'Invalid password', { status: 400 });
		}

		const sessionId = await createSession(existing.id);

		cookies.set('session_id', sessionId, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7
		});

		throw redirect(303, '/');
	}
};
