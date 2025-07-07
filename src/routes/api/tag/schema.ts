import { z } from 'zod/v4';

export const TagBodyType = z.object({
	name: z
		.string()
		.min(1, { message: 'Tag name is required' })
		.max(100, { message: 'Tag name must be 100 characters or fewer' })
});
