<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import Footer from '@/stories/Block/Footer/Footer.svelte';
	import '../app.css';
	import '$lib/components/edra/editor.css';
	import Header from '@/stories/Block/Header/Header.svelte';
	import { Toaster } from '@/lib/components/ui/sonner/index.js';
	import { userStore } from '$lib/stores/userStore';
	import { themeStore } from '$lib/stores/themeStore';
	import { onDestroy, onMount } from 'svelte';

	let previousStyles: HTMLStyleElement | null = null;

	let { children, data } = $props();

	onMount(async () => {
		switch (data.user.theme) {
			case 'claude': {
				await import('../theme/claude.css');
				break;
			}
			case 'mono': {
				await import('../theme/mono.css');
				break;
			}
			case 'modern-minimal': {
				await import('../theme/modern-minimal.css');
				break;
			}
			default:
				await import('../theme/default.css');
				break;
		}
	});

	userStore.setUser(data.user);
	userStore.setIsLoggedIn(data.isLoggedIn);
	themeStore.set(data.user.theme);
</script>

<ModeWatcher />
<Toaster position="top-center" richColors />
<article class="flex min-h-screen flex-col">
	<Header />
	<main class="flex min-h-full flex-1 flex-col">
		{@render children()}
	</main>
	<Footer />
</article>
