<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import Footer from '@/stories/Block/Footer/Footer.svelte';
	import '../app.css';
	import '$lib/components/edra/editor.css';
	import Header from '@/stories/Block/Header/Header.svelte';
	import { Toaster } from '@/lib/components/ui/sonner/index.js';

	let { children, data } = $props();
</script>

<ModeWatcher />
<Toaster position="top-center" richColors />
<article class="flex min-h-screen flex-col">
	<Header user={data.user} {data.isLoggedIn} />
	<main class="flex min-h-full flex-1 flex-col">
		{@render children()}
	</main>
	<Footer user={data.user} />
</article>
