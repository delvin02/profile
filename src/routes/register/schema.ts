import { z } from 'zod/v4';

export const registrationSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	subdomain: z.string(),
	email: z.email('Invalid email'),
	password: z.string().min(8, 'Password must be 8+ characters')
});
