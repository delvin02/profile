import { z } from 'zod/v4';

export const schema = z.object({
	id: z.int(),
	thumbnailUrl: z.string().nullable(),
	title: z.string(),
	description: z.string(),
	// content: z.preprocess(
	// 	(v) => (typeof v === 'string' ? JSON.parse(v) : v),
	// 	z.record(z.string(), z.any())
	content: z.any()
});
