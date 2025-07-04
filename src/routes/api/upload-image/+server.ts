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
