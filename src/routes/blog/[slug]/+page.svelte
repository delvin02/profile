<script lang="ts">
	import Button from '@/lib/components/ui/button/button.svelte';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Clock from '@lucide/svelte/icons/clock';
	import { Avatar } from 'bits-ui';
	import { onMount } from 'svelte';
	import { generateHTML, type JSONContent } from '@tiptap/core';
	import { TIPTAP_EXTENSIONS } from '@/lib/components/edra/extensions';
	import Loading from '@/stories/Block/Loading/Loading.svelte';
	import { DateFormatter } from '@internationalized/date';
	import { userStore } from '@/lib/stores/userStore';

	let { data } = $props();
	const { user, isLoggedIn } = userStore;

	let htmlContent = $state();
	let loading: boolean = $state(true);

	const publishedDate = new DateFormatter('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});

	onMount(() => {
		htmlContent = generateHTML(data.blog.content as JSONContent, TIPTAP_EXTENSIONS);
		loading = false;
	});
</script>

<svelte:head>
	<title>{data.blog.title}</title>
	<meta name="description" content={data.blog.description} />
	<link rel="canonical" href={'/blog/' + data.blog.slug} />

	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.blog.title} />
	<meta property="og:description" content={data.blog.description} />
	<meta property="og:url" content={'/blog/' + data.blog.slug} />
	<meta property="og:image" content={data.blog.thumbnailUrl} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.blog.title} />
	<meta name="twitter:description" content={data.blog.description} />
	<meta name="twitter:image" content={data.blog.thumbnailUrl} />
</svelte:head>

{#if loading}
	<Loading />
{:else}
	<section class="mx-auto max-w-2xl flex-1 px-5 py-12 leading-6">
		<Button variant="link" href="/blog">
			<ArrowLeft />
			Blogs
		</Button>
		{#if data.blog.thumbnailUrl}
			<img src={data.blog.thumbnailUrl} alt="Blog thumbnail" class="mt-4 max-w-full rounded-lg" />
		{/if}
		<div class="mt-4 flex flex-col gap-4">
			<h2
				class="block w-full text-left text-4xl leading-tight font-semibold
         break-all whitespace-normal dark:text-white"
			>
				{data.blog.title}
			</h2>
			<p class="text-muted-foreground my-0 text-left text-lg italic lg:text-xl">
				{data.blog.description}
			</p>
		</div>

		<div class="mt-8 flex flex-row items-center gap-2 text-sm">
			<div class="flex items-center gap-2">
				<div class="flex size-8 items-center justify-center rounded-4xl bg-gray-200">
					<Avatar.Root>
						<Avatar.Image src={$user.profilePictureUrl} alt={$user.name} class="rounded-4xl" />
						<Avatar.Fallback>{data.user.name[0].toUpperCase()}</Avatar.Fallback>
					</Avatar.Root>
				</div>
				<p class="mt-0">Written by <b>{$user.name}</b></p>
			</div>
			{#if data.blog.publishedAt}
				<p class="mt-0 font-bold">•</p>
				<p class="text-muted-foreground mt-0">{publishedDate.format(data.blog.publishedAt)}</p>
			{/if}
			{#if data.blog.readingTime}
				<p class="mt-0 font-bold">•</p>
				<div class="flex items-center">
					<Clock class="stroke-muted-foreground size-4" />
					<p class="text-muted-foreground mt-0 pl-1">{data.blog.readingTime} min.</p>
				</div>
			{/if}
		</div>

		<div class="mt-8">
			<div class="tiptap flex flex-col gap-6">
				{@html htmlContent || 'No content available.'}
			</div>
		</div>
	</section>
{/if}
