<script lang="ts">
	import BlogCard from '@/lib/components/BlogCard.svelte';
	import Button from '@/lib/components/ui/button/button.svelte';
	import Badge from '@/lib/components/ui/badge/badge.svelte';
	import type { PageProps } from './$types';
	import { userStore } from '@/lib/stores/userStore';

	let { data }: PageProps = $props();

	const { user } = userStore;
</script>

<section class="mx-auto max-w-2xl flex-1 px-5 py-12 leading-6">
	<div class="flex flex-col gap-4">
		<h2
			class="mb-4 inline-block h-full w-full text-center align-top text-4xl leading-1 font-semibold md:text-5xl dark:text-white"
		>
			Blogs
		</h2>
		<p class="py-2 text-center font-serif text-xl italic lg:text-2xl">
			{$user.blogHeadline}
		</p>
	</div>
	<div class="mt-8">
		<div class="align-center mb-4 flex flex-row justify-center">
			{#each data.tags as tag}
				<Button variant="link" size="sm" href="/blog?tagId={tag.id}"
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
						description={blog.description}
						link="/blog/{blog.slug}"
						{blog}
						tags={blog.blogTags.map((t) => t.tag.name)}
					/>
				{/each}
			</div>
		</div>
	</div>
</section>
