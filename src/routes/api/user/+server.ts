import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, json } from '@sveltejs/kit';

export const GET = async ({ locals }) => {
	if (!locals.subdomain) {
		throw error(400, 'Subdomain not found');
	}

	const currentUser = await db.query.user.findFirst({
		columns: { passwordHash: false, bio: false },
		where: eq(user.subdomain, locals.subdomain)
	});

	if (!currentUser) {
		throw error(404, 'User not found');
	}

	return json({
		user: currentUser,
		isLoggedIn: !!locals.auth
	});
};
