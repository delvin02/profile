import { z } from 'zod/v4';

export const loginSchema = z.object({
	email: z.string().email('Please enter a valid email'),
	password: z.string().min(1, 'Password is required')
});
