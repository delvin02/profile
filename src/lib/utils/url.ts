export function getBaseUrl(subdomain: string | null) {
  const rootDomain = 'portfolio-me.bio';
  if (!subdomain) {
    return `https://${rootDomain}`; 
  }
  return `https://${subdomain}.${rootDomain}`;
}