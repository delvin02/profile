import { error, type Handle } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { user } from '../server/db/schema';
import { db } from '../server/db';

export const subdomain: Handle = async ({ event, resolve }) => {
	const [subdomain] = event.url.hostname.split('.');

	const domainUser = await db.query.user.findFirst({
		where: eq(user.subdomain, subdomain)
	});

	if (!domainUser) {
		throw error(404, 'User not found');
	}

	event.locals.subdomain = domainUser.subdomain;
	return resolve(event);
};
