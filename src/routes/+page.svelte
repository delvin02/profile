<script lang="ts">
	import BlogCard from '@/lib/components/BlogCard.svelte';
	import Typewriter from '@/lib/components/Typewriter.svelte';
	import Button from '@/lib/components/ui/button/button.svelte';

	let { data } = $props();
	const user = data.user;
</script>

<svelte:head>
	<title>{user.name.toUpperCase()}</title>
</svelte:head>

<section class="mx-auto max-w-2xl flex-1 px-5 pt-12 leading-6">
	<div class="flex flex-col gap-4">
		<h2
			class="mb-4 inline-block h-full w-full text-center align-top text-4xl leading-1 font-semibold md:text-5xl dark:text-white"
		>
			{user.name}
		</h2>
		<Typewriter text={user.headline || 'No headline available.'} speed={80} loop={false} />

		<img
			src={user.profilePictureUrl || '/images/no-image-profile-1-1.png'}
			class="mx-auto my-4 h-48 w-48 rounded-full"
			alt="{user.name}'s profile"
		/>
		<div class="tiptap flex flex-col">
			{@html data.bio}
		</div>
	</div>
	<div class="mt-8">
		<h1 class="mb-6 text-center text-4xl font-bold">Some blogs I've wrote</h1>
		<div class="flex flex-col items-center gap-6">
			<div class="flex flex-col gap-4 md:grid md:grid-cols-2">
				{#each data.blogs as blog (blog.id)}
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
			<Button variant="secondary" href="/blog">Read more ></Button>
		</div>
	</div>
</section>
