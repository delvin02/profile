<script lang="ts">
	import Button from '@/lib/components/ui/button/button.svelte';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Clock from '@lucide/svelte/icons/clock';
	import { Avatar } from 'bits-ui';
	import { type Content, type JSONContent } from '@tiptap/core';
	import Editor from '@/stories/Block/Editor/Editor.svelte';
	import { FormControl } from '@/lib/components/ui/form';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { schema } from './schema';
	import Label from '@/lib/components/ui/label/label.svelte';
	import ImageInputPlaceholder from '@/lib/components/ImageInputPlaceholder.svelte';

	let { data } = $props();

	const {
		form: formData,
		enhance,
		message,
		errors
	} = superForm(data.form, {
		validators: zod4Client(schema),
		dataType: 'json',
		onSubmit({ jsonData }) {
			console.log(jsonData);
			jsonData($formData);
		}
	});

	const publishedDate = new Date(data.blog.createdAt).toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});

	let content: Content = $state(data.blog.content as Content);

	function handleContentUpdate(newContent: Content) {
		formData.update((current) => ({
			...current,
			content: newContent
		}));
	}

	function handleThumbnailChange(url: string | null) {
		formData.update((f) => ({
			...f,
			thumbnailUrl: url
		}));
	}
</script>

<!-- <SuperDebug
	data={{
		form: $formData,
		errors: $errors,
		message: $message
	}}
/> -->

<section class="mx-auto w-full max-w-2xl flex-1 px-5 py-12 leading-6">
	<Button variant="link" href="/blog">
		<ArrowLeft />
		Blogs
	</Button>
	<ImageInputPlaceholder imageUrl={$formData.thumbnailUrl} onChange={handleThumbnailChange} />
	<form method="POST" use:enhance>
		<div class="mt-4 flex flex-col gap-4">
			<Label for="title">Title</Label>
			<input
				bind:value={$formData.title}
				placeholder="Enter blog title"
				class="border-primary/80 block w-full border-b border-dashed text-left
			 text-4xl leading-tight font-semibold break-all whitespace-normal dark:text-white"
			/>
		</div>

		<div class="mt-4 flex flex-col gap-4">
			<Label for="title">Description</Label>
			<input
				class="text-muted-foreground border-primary/80 my-0 border-b border-dashed text-left text-lg italic lg:text-xl"
				bind:value={$formData.description}
				name="description"
				placeholder="Enter blog description"
			/>
		</div>

		<div class="mt-8 flex flex-row items-center gap-2 text-sm">
			<div class="flex items-center gap-2">
				<div class="size-8">
					<Avatar.Root>
						<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" class="rounded-4xl" />
						<Avatar.Fallback>CN</Avatar.Fallback>
					</Avatar.Root>
				</div>
				<!-- <p class="mt-0">Written by <b>{data.blog.author?.name}</b></p> -->
			</div>
			<p class="mt-0 font-bold">•</p>
			<p class="text-muted-foreground mt-0">{publishedDate}</p>
			<p class="mt-0 font-bold">•</p>
			<div class="flex items-center">
				<Clock class="stroke-muted-foreground size-4" />
				<p class="text-muted-foreground mt-0 pl-1">1 min.</p>
			</div>
		</div>
		<div class="mt-8">
			<div class="tiptap flex flex-col gap-6">
				<Label for="title">Content</Label>
				<Editor {content} onChange={(e) => handleContentUpdate(e)} />
			</div>
			<input class="hidden" bind:value={$formData.content} name="content" />
		</div>

		<div class="mt-2 flex">
			<Button type="submit" class="ml-auto">Update</Button>
		</div>
	</form>
</section>
