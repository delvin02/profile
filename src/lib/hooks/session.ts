import type { Handle } from '@sveltejs/kit';
import { getSession } from '$lib/server/session';

export const session: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session_id');

	if (sessionId) {
		const session = await getSession(sessionId);
		event.locals.auth = session ? session.user : null;
	} else {
		event.locals.auth = null;
	}

	return resolve(event);
};
