import imageService from '@/lib/server/services';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const form = await request.formData();
	const file = form.get('image');

	if (!(file instanceof Blob) || !file.type.startsWith('image/')) {
		throw error(400, 'No valid image provided');
	}

	const buffer = Buffer.from(await file.arrayBuffer());
	const ext = file.type.split('/')[1];
	const filename = `${crypto.randomUUID()}.${ext}`;

	const url = await imageService.upload(buffer, filename);
	return json({ url });
};

export const DELETE: RequestHandler = async ({ request, url: baseUrl }) => {
	const { url: imageUrl } = await request.json();
	if (typeof imageUrl !== 'string') throw error(400, 'Missing image URL');

	const parsed = new URL(imageUrl, baseUrl.origin);
	const filename = parsed.pathname.split('/').pop();
	if (!filename) throw error(400, 'Invalid image URL');

	await imageService.delete(filename);
	return json({ success: true });
};
