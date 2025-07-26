import { deleteSession } from '@/lib/server/session';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
	const sid = cookies.get('session_id');
	if (!sid) {
		throw redirect(302, '/login');
	}

	await deleteSession(sid);
	cookies.delete('session_id', { path: '/' });
	return redirect(302, '/');
};
