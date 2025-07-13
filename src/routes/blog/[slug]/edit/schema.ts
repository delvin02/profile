import { z } from 'zod/v4';

export const schema = z.object({
	id: z.number(),
	thumbnailUrl: z.string().nullable(),
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	content: z.any(),
	tags: z.array(z.coerce.number()).default([])
});
