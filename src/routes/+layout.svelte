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

	onMount(() => {
		themeStore.set(data.user.theme);

		const unsubscribe = themeStore.subscribe(async (theme) => {
			if (previousStyles) {
				previousStyles.remove();
				previousStyles = null;
			}

			switch (theme) {
				case 'claude': {
					const mod = await import('../theme/claude.css?inline');
					previousStyles = injectStyle(mod.default);
					break;
				}
				case 'mono': {
					const mod = await import('../theme/mono.css?inline');
					previousStyles = injectStyle(mod.default);
					break;
				}
				case 'modern-minimal': {
					const mod = await import('../theme/modern-minimal.css?inline');
					previousStyles = injectStyle(mod.default);
					break;
				}
				default:
					const mod = await import('../theme/default.css?inline');
					previousStyles = injectStyle(mod.default);
					break;
			}
		});
		onDestroy(unsubscribe);
	});

	function injectStyle(css: string) {
		const styleEl = document.createElement('style');
		styleEl.innerHTML = css;
		document.head.appendChild(styleEl);
		return styleEl;
	}

	let { children, data } = $props();

	userStore.setUser(data.user);
	userStore.setIsLoggedIn(data.isLoggedIn);
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
