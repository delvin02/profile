<script lang="ts">
	import Button from '@/lib/components/ui/button/button.svelte';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Clock from '@lucide/svelte/icons/clock';
	import { Avatar } from 'bits-ui';
	import { type Content } from '@tiptap/core';
	import Editor from '@/stories/Block/Editor/Editor.svelte';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { schema } from './schema';
	import Label from '@/lib/components/ui/label/label.svelte';
	import ImageInputPlaceholder from '@/lib/components/ImageInputPlaceholder.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { Tag } from '@/lib/server/db/schema/tag';
	import Badge from '@/lib/components/ui/badge/badge.svelte';
	import CreateEditTagDialog from '@/lib/components/CreateEditTagDialog.svelte';
	import { invalidate } from '$app/navigation';

	let { data } = $props();

	let openTagDialog = $state(false);

	const {
		form: formData,
		enhance,
		message,
		errors,
		constraints
	} = superForm(data.form, {
		validators: zod4Client(schema),
		dataType: 'json',
		onSubmit({ jsonData }) {
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

	let tagStringIds = $state($formData.tags.map(String));
	let selectedTags = $state(data.allTags.filter((t: Tag) => $formData.tags.includes(t.id)));

	function onTagsChange(tagIds: string[]) {
		formData.update((f) => ({
			...f,
			tags: tagIds.map(Number)
		}));
		selectedTags = data.allTags.filter((t: Tag) => tagIds.includes(t.id.toString()));
	}
</script>

<!-- <SuperDebug
	data={{
		form: $formData,
		errors: $errors,
		message: $message
	}}
/> -->

{#if openTagDialog}
	<CreateEditTagDialog
		open={openTagDialog}
		tags={data.allTags}
		onClose={async () => {
			openTagDialog = false;
			await invalidate('allTags');
		}}
	/>
{/if}
<section class="mx-auto w-full max-w-2xl flex-1 px-5 py-12 leading-6">
	<Button variant="link" href="/blog">
		<ArrowLeft />
		Blogs
	</Button>
	<div class="mt-4">
		<ImageInputPlaceholder imageUrl={$formData.thumbnailUrl} onChange={handleThumbnailChange} />
	</div>
	<form method="POST" use:enhance>
		<div class="mt-4 flex flex-col gap-4">
			<Label for="title">Title</Label>
			<input
				bind:value={$formData.title}
				placeholder="Enter blog title"
				class="border-primary/80 block w-full border-b border-dashed text-left
			 text-4xl leading-tight font-semibold break-all whitespace-normal dark:text-white"
				{...$constraints.title}
			/>
			{#if $errors.title}
				<p class="text-sm text-red-600">{$errors.title}</p>
			{/if}
		</div>

		<div class="mt-4 flex flex-col gap-4">
			<Label for="title">Description</Label>
			<input
				class="text-muted-foreground border-primary/80 my-0 border-b border-dashed text-left text-lg italic lg:text-xl"
				bind:value={$formData.description}
				name="description"
				placeholder="Enter blog description"
				{...$constraints.description}
			/>
			{#if $errors.description}
				<p class="text-sm text-red-600">{$errors.description}</p>
			{/if}
		</div>

		<div class="mt-4 flex flex-col gap-4">
			<Label for="title">Tags</Label>
			<div class="flex gap-2">
				<Select.Root
					name="tags"
					type="multiple"
					bind:value={tagStringIds}
					onValueChange={onTagsChange}
				>
					<Select.Trigger class="w-full border-dashed">
						<div class="flex gap-2">
							{#if selectedTags.length}
								{#each selectedTags as tag}
									<Badge variant="secondary" class="font-mono font-semibold uppercase"
										>{tag.name}</Badge
									>
								{/each}
							{:else}
								Select tag(s)
							{/if}
						</div>
					</Select.Trigger>
					<Select.Content>
						{#each data.allTags as tag}
							<Select.Item value={tag.id.toString()}>
								{tag.name}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<Button
					onclick={() => {
						openTagDialog = true;
					}}
				>
					Manage tags
				</Button>
			</div>
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
