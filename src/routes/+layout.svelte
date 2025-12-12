<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import Footer from '@/stories/Block/Footer/Footer.svelte';
	import '../app.css';
	import '$lib/components/edra/editor.css';
	import Header from '@/stories/Block/Header/Header.svelte';
	import { Toaster } from '@/lib/components/ui/sonner/index.js';
	import { userStore } from '$lib/stores/userStore';
	import { themeStore } from '$lib/stores/themeStore';
	import { getBaseUrl } from '@/lib/utils/url';
	import { page } from '$app/state';

	let previousStyle: HTMLStyleElement | null = null;

	let { children, data } = $props();

	userStore.setUser(data.user);
	userStore.setIsLoggedIn(data.isLoggedIn);

	if (data.user.theme) {
		themeStore.set(data.user.theme);
	}

	$effect(() => {
		if (!$themeStore) return;
		loadTheme($themeStore);
	});

	async function loadTheme(theme: string) {
		if (previousStyle) {
			previousStyle.remove();
			previousStyle = null;
		}
		let mod;
		switch (theme) {
			case 'claude':
				mod = await import('../theme/claude.css?inline');
				break;
			case 'mono':
				mod = await import('../theme/mono.css?inline');
				break;
			case 'modern-minimal':
				mod = await import('../theme/modern-minimal.css?inline');
				break;
			default:
				mod = await import('../theme/default.css?inline');
		}
		previousStyle = injectStyle(mod.default);
	}

	function injectStyle(content: string) {
		const style = document.createElement('style');
		style.textContent = content;
		document.head.appendChild(style);
		return style;
	}
</script>

<svelte:head>
	<!-- Google Tag Manager-->
	{#if data.user?.googleTagId}
		<script
			async
			src="https://www.googletagmanager.com/gtag/js?id={data.user.googleTagId}"
		></script>
		{@html `
		<script>
			window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			gtag('js', new Date());
			gtag('config', '${data.user.googleTagId}');
		<\/script>
	`}
	{/if}

	{#if data.user?.metaDescription}
		<meta name="description" content={data.user.metaDescription} />
	{/if}

	{#if data.user?.subdomain}
		<link rel="canonical" href={getBaseUrl(data.user.subdomain) + page.url.pathname} />
	{/if}

	<link rel="icon" type="image/png" href={data.user?.tabIconUrl || '/favicon.png'} />
</svelte:head>

<ModeWatcher />
<Toaster position="top-center" richColors />
<article class="flex min-h-screen flex-col">
	<Header />
	<main class="flex min-h-full flex-1 flex-col">
		{@render children()}
	</main>
	<Footer />
</article>
