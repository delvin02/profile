<script lang="ts">
	import BlogCard from '@/lib/components/BlogCard.svelte';
	import { TIPTAP_EXTENSIONS } from '@/lib/components/edra/extensions/index.js';
	import Typewriter from '@/lib/components/Typewriter.svelte';
	import Button from '@/lib/components/ui/button/button.svelte';
	import { generateHTML, type JSONContent } from '@tiptap/core';
	import { onMount } from 'svelte';

	let { data } = $props();
	let htmlContent = $state();

	const user = data.user;

	onMount(() => {
		htmlContent = generateHTML(user.bio as JSONContent, TIPTAP_EXTENSIONS);
	});
</script>

<svelte:head>
	<title>{user.name.toUpperCase()}</title>
</svelte:head>

<section class="mx-auto max-w-2xl flex-1 px-5 pt-12 leading-6">
	<div class="flex flex-col gap-4">
		<h2
			style="font-family: 'Futura', sans-serif;"
			class="mb-4 inline-block h-full w-full text-center align-top text-4xl leading-1 font-semibold md:text-5xl dark:text-white"
		>
			Eng wei theng
		</h2>
		<Typewriter text={user.headline} speed={80} loop={false} />

		<img
			src={user.profilePictureUrl}
			class="mx-auto my-4 h-48 w-48 rounded-full"
			alt="{user.name}'s profile"
		/>
		<div class="tiptap flex flex-col">
			{@html htmlContent || 'No content available.'}
		</div>
	</div>
	<div class="mt-8">
		<h1 class="mb-6 text-center text-4xl font-bold">Some blogs I've wrote</h1>
		<div class="flex flex-col items-center gap-6">
			<div class="flex flex-col gap-4 md:grid md:grid-cols-2">
				{#each data.blogs as blog}
					<BlogCard
						publishDate={blog.createdAt}
						imageSource={blog.thumbnailUrl}
						imageAlt={blog.title + ' thumbnail image'}
						title={blog.title}
						link="/blog/{blog.slug}"
						tags={blog.blogTags.map((t) => t.tag.name)}
					/>
				{/each}
			</div>
			<Button variant="secondary" href="/blog">Read more ></Button>
		</div>
	</div>
</section>
