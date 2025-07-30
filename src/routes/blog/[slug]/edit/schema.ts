import { z } from 'zod/v4';

export const schema = z.object({
	id: z.number(),
	thumbnailUrl: z.string().nullable(),
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	content: z.any(),
	tags: z.array(z.coerce.number()).default([]),
	readingTime: z
		.preprocess((val) => {
			if (typeof val === 'string' && val.trim() !== '') {
				return Number(val);
			}
			return val;
		}, z.number().int().positive())
		.nullish(),
	publishedAt: z
		.preprocess((val) => {
			if (val === null || val === undefined || val === '') {
				return null;
			}

			if (typeof val === 'string') {
				const date = new Date(val);
				return isNaN(date.getTime()) ? null : date;
			}
			return val;
		}, z.date())
		.nullable()
});
