import { z } from 'zod/v4';

export const createBlogSchema = z.object({
	thumbnailUrl: z.string().nullable(),
	title: z.string().nonempty('Title is required'),
	description: z.string().nonempty('Description is required'),
	content: z.any().default({}),
	tags: z.array(z.coerce.number()).default([])
});
