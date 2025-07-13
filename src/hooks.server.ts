import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const isAuthed = event.cookies.get('auth') === '1';

	event.locals.user = isAuthed ? { role: 'admin' } : null;

	return resolve(event);
};
