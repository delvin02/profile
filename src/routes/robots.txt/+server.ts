export const GET = async ({ locals }) => {
	const sub = locals.subdomain;
	return new Response(
		`User-agent: *
			Allow: /

		Sitemap: https://${sub}.portfolio-me.bio/sitemap.xml`.trim(),
		{
			headers: { 'Content-Type': 'text/plain' }
		}
	);
};
