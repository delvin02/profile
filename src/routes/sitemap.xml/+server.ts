import { error, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import { blog, user } from '@/lib/server/db/schema';
import { isNull } from 'drizzle-orm';

const staticPages = ['/', '/blog'];

export const GET: RequestHandler = async ({ locals, url }) => {
	if (!locals.subdomain) {
		throw error(400, 'Subdomain not found');
	}

	const baseUrl = `https://${url.host}`;

	const currentUser = await db.query.user.findFirst({
		columns: { passwordHash: false },
		where: eq(user.subdomain, locals.subdomain)
	});

	if (!currentUser) {
		throw error(404, 'User not found');
	}

	const posts = await db.query.blog.findMany({
		where: and(eq(blog.userId, currentUser.id), isNull(blog.deletedAt)),
		columns: {
			slug: true,
			updatedAt: true
		}
	});

	const urls = [
		...staticPages.map(
			(path) => `
        <url>
          <loc>${baseUrl}${path}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>`
		),
		...posts.map(
			(post) => `
        <url>
          <loc>${baseUrl}/blog/${post.slug}</loc>
          <lastmod>${post.updatedAt.toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>`
		)
	].join('');

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
