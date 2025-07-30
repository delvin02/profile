<script lang="ts">
	import Button from '@/lib/components/ui/button/button.svelte';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
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
	import {
		DateFormatter,
		getLocalTimeZone,
		parseDate,
		toCalendarDate
	} from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { page } from '$app/stores';

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

	const publishedDate = new DateFormatter('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});

	let publishedAtValue = $derived(
		$formData.publishedAt ? parseDate($formData.publishedAt.toISOString().slice(0, 10)) : undefined
	);

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
	let selectedTags = $state(data.allTags.filter((t): t is Tag => $formData.tags.includes(t.id)));

	function onTagsChange(tagIds: string[]) {
		formData.update((f) => ({
			...f,
			tags: tagIds.map(Number)
		}));
		selectedTags = data.allTags.filter((t): t is Tag => tagIds.includes(t.id.toString()));
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
		onClose={() => {
			openTagDialog = false;
		}}
		onChange={(tags) => {
			data.allTags = tags.filter((t): t is Tag => !!t.id && !!t.name) as Tag[];
		}}
	/>
{/if}
<section class="mx-auto w-full max-w-2xl flex-1 px-5 py-12 leading-6">
	<Button variant="link" href="/blog">
		<ArrowLeft />
		Blogs
	</Button>
	<div class="mt-4">
		<ImageInputPlaceholder
			imageUrl={$formData.thumbnailUrl}
			onChange={handleThumbnailChange}
			title="Click to upload or drag and drop"
			description="Maximum file size 5 MB"
		/>
	</div>
	<form method="POST" use:enhance>
		<input type="hidden" name="id" value={data.blog.id} />

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
				<div class="flex size-8 items-center justify-center rounded-4xl bg-gray-200">
					<Avatar.Root class="my-auto">
						<Avatar.Image
							src={data.user.profilePictureUrl}
							alt={data.user.name}
							class="rounded-4xl"
						/>
						<Avatar.Fallback>{data.user.name[0].toUpperCase()}</Avatar.Fallback>
					</Avatar.Root>
				</div>
				<p class="mt-0">Written by <b>{data.user.name}</b></p>
			</div>
			<p class="mt-0 font-bold">•</p>
			<p class="text-muted-foreground mt-0">
				<Popover.Root>
					<Popover.Trigger class="border-primary/80 rounded-none border-b border-dashed py-0">
						{#snippet child({ props })}
							<Button
								variant="ghost"
								class="w-fit justify-start rounded-none text-left font-normal"
								{...props}
							>
								<CalendarIcon class="mr-2 size-4" />
								{publishedAtValue
									? publishedDate.format(publishedAtValue.toDate(getLocalTimeZone()))
									: 'Date'}
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0">
						<Calendar
							bind:value={publishedAtValue}
							type="single"
							initialFocus
							onValueChange={(v) => {
								if (v) {
									$formData.publishedAt = v.toDate('utc');
								} else {
									$formData.publishedAt = null;
								}
							}}
						/>
					</Popover.Content>
				</Popover.Root>
			</p>
			<p class="mt-0 font-bold">•</p>
			<div class="flex items-center">
				<Clock class="stroke-muted-foreground size-4" />
				<input
					class="text-muted-foreground border-primary/80 my-0 max-w-8 border-b border-dashed text-center"
					bind:value={$formData.readingTime}
					name="readingTime"
					placeholder="1"
					{...$constraints.readingTime}
				/>
				<p class="text-muted-foreground mt-0 pl-1">min.</p>
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
			<Button type="submit" class="cursor-pointer" formaction="?/archive" variant="destructive">
				Archive
			</Button>
			<Button type="submit" class="ml-auto cursor-pointer" formaction="?/update">Update</Button>
		</div>
	</form>
</section>
