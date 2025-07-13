import bcrypt from 'bcryptjs';
import { env } from '$env/dynamic/private';

export async function POST({ request, cookies }) {
	const { email, password } = await request.json();
	if (email === env.ADMIN_EMAIL && (await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH))) {
		cookies.set('auth', '1', {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24
		});
		return new Response('OK');
	}

	return new Response('Invalid credentials', { status: 401 });
}
