import { eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { user } from '@/lib/server/db/schema';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
	const currentUser = await db.query.user.findFirst({
		columns: {
			passwordHash: false
		},
		where: eq(user.subdomain, locals.subdomain)
	});

	if (!currentUser) {
		throw error(404, 'User not found');
	}

	return { user: currentUser, isLoggedIn: !!locals.auth };
};
