import { sequence } from '@sveltejs/kit/hooks';
import { session } from './lib/hooks/session';
import { subdomain } from './lib/hooks/subdomain';

export const handle = sequence(subdomain, session);
