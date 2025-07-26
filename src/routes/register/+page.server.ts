import { type Actions, redirect, error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { registrationSchema } from './schema';
import { hash } from 'bcryptjs';
import { db } from '$lib/server/db';
import { user, type NewUser } from '@/lib/server/db/schema/user';

export async function load() {
	const form = await superValidate(zod4(registrationSchema));
	return {
		form
	};
}

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(registrationSchema));

		if (!form.valid) {
			return { form };
		}

		const { name, email, password, subdomain } = form.data;

		const passwordHash = await hash(password, 10);
		const newUser: NewUser = {
			name,
			email,
			subdomain,
			passwordHash
		};

		const [inserted] = await db.insert(user).values(newUser).$returningId();
		if (!inserted) {
			throw error(400, 'Failed to create user');
		}

		return redirect(302, '/login');
	}
};
