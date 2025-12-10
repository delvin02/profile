import fileService from '@/lib/server/services';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const form = await request.formData();
	const file = form.get('file');

	if (!(file instanceof Blob)) {
		throw error(400, 'No valid file provided');
	}

	if (file.size > 5 * 1024 * 1024) {
		throw error(400, 'File too big (max 5 MB)');
	}

	const filename = `${file.name}`;

	const buffer = Buffer.from(await file.arrayBuffer());
	const url = await fileService.upload(buffer, filename);

	return json({ url });
};

export const DELETE: RequestHandler = async ({ request, url: baseUrl }) => {
	const { url: fileUrl } = await request.json();
	if (typeof fileUrl !== 'string') throw error(400, 'Missing file URL');

	const parsed = new URL(fileUrl, baseUrl.origin);
	const filename = parsed.pathname.split('/').pop();
	if (!filename) throw error(400, 'Invalid file URL');

	await fileService.delete(filename);
	return json({ success: true });
};
