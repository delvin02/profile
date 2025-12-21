export const GET = async ({ locals }) => {
	const sub = locals.subdomain;

	const robotsTxt = [
		'User-agent: *',
		'Allow: /',
		'',
		`Sitemap: https://${sub}.portfolio-me.bio/sitemap.xml`
	].join('\n');

	return new Response(robotsTxt, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8'
		}
	});
};
