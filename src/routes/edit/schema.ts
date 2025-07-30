import { z } from 'zod/v4';

export const updateUserSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.email().optional(),
	headline: z.string().min(1, 'Headline is required').nullable(),
	profilePictureUrl: z.string().nullable().optional(),
	linkedInUrl: z.url('Must be a valid URL').nullable().optional(),
	resumeUrl: z.url('Must be a valid URL').nullable().optional(),
	bio: z.any().optional().default({})
});
