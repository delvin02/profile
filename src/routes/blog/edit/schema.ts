import { z } from 'zod/v4';

export const blogPageEditSchema = z.object({
	blogHeadline: z.string().nullable()
});
