import tailwindcss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		devtoolsJson(),
		legacy({
			targets: ['defaults', 'iOS >= 14', 'Safari >= 14'],
			additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
			modernPolyfills: true
		})
	]
});
