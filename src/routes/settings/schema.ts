import { z } from 'zod/v4';

export const themeSchema = z.enum(['default', 'claude', 'mono', 'modern-minimal']);
export type Theme = z.infer<typeof themeSchema>;

export const userSettingsSchema = z.object({
	linkedInUrl: z.url().nullable(),
	resumeUrl: z.string().nullable(),
	metaDescription: z.string().max(160).nullable(),
	googleTagId: z.string().nullable(),
	theme: z.string()
});
