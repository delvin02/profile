<script>
	import BlogCard from '@/lib/components/BlogCard.svelte';
	import Typewriter from '@/lib/components/Typewriter.svelte';
	import Button from '@/lib/components/ui/button/button.svelte';
	import { env } from '$env/dynamic/public';

	const PUBLIC_ADMIN_PROFILE_PICTURE_PATH = env.PUBLIC_ADMIN_PROFILE_PICTURE_PATH;
	let { data } = $props();
</script>

<svelte:head>
	<title>{env.PUBLIC_ADMIN_NAME}</title>
</svelte:head>

<section class="mx-auto max-w-2xl flex-1 px-5 pt-12 leading-6">
	<div class="flex flex-col gap-4">
		<h2
			style="font-family: 'Futura', sans-serif;"
			class="mb-4 inline-block h-full w-full text-center align-top text-4xl leading-1 font-semibold md:text-5xl dark:text-white"
		>
			Eng wei theng
		</h2>
		<Typewriter text="Front-end Developer | Biotechnologist" speed={80} loop={false} />

		<img
			src={PUBLIC_ADMIN_PROFILE_PICTURE_PATH}
			class="mx-auto my-4 h-48 w-48 rounded-full"
			alt="Delvin's profile"
		/>
		<p class="text-center">Hey! I'm Jim, a founder and software engineer based on Greece.</p>
		<p class="text-center">
			Currently building MagicPattern and Brandbird. In the past decade, I've spent time as a design
			and software engineering contractor.
		</p>
		<p class="my-4">
			I'm passionate about <Button variant="link" size="sm" class="cursor-pointer px-0 font-bold"
				>blogging</Button
			>.
		</p>
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
