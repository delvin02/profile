// See https://svelte.dev/docs/kit/types#app.d.ts

import type { User } from './lib/server/db/schema';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			auth: User | null;
			subdomain: string | null;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
