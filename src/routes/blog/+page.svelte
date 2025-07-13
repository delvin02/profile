<script lang="ts">
	import BlogCard from '@/lib/components/BlogCard.svelte';
	import Docs from '../../stories/assets/docs.png';
	import Button from '@/lib/components/ui/button/button.svelte';
	import Badge from '@/lib/components/ui/badge/badge.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<section class="mx-auto max-w-2xl flex-1 px-5 py-12 leading-6">
	<div class="flex flex-col gap-4">
		<h2
			style="font-family: 'Futura', sans-serif;"
			class="mb-4 inline-block h-full w-full text-center align-top text-4xl leading-1 font-semibold md:text-5xl dark:text-white"
		>
			Blogs
		</h2>
		<p class="py-2 text-center font-serif text-xl italic lg:text-2xl">
			Blogs related to devs work, design, thoughts and learnings.
		</p>
	</div>
	<div class="mt-8">
		<div class="align-center mb-4 flex flex-row justify-center">
			{#each data.tags as tag}
				<Button variant="link" size="sm"
					><Badge variant="secondary" class="font-mono font-semibold uppercase">{tag.name}</Badge
					></Button
				>
			{/each}
		</div>
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
		</div>
	</div>
</section>
