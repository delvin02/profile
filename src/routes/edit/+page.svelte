<script lang="ts">
	import Button from '@/lib/components/ui/button/button.svelte';
	import Label from '@/lib/components/ui/label/label.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import type { Content } from '@tiptap/core';
	import ImageUp from '@lucide/svelte/icons/image-up';
	import Editor from '@/stories/Block/Editor/Editor.svelte';
	import { cn } from '@/lib/utils.js';
	import { toast } from 'svelte-sonner';
	import { updateUserSchema } from './schema.js';
	import Trash from '@lucide/svelte/icons/trash';

	let { data } = $props();
	let profilePictureFileInput: HTMLInputElement;
	let isDragging = $state(false);

	const {
		form: formData,
		enhance,
		message,
		errors,
		constraints
	} = superForm(data.form, {
		validators: zod4Client(updateUserSchema),
		dataType: 'json',
		onSubmit({ jsonData }) {
			jsonData($formData);
		}
	});

	let bio: Content = $state($formData.bio as Content);
	function handleContentUpdate(newContent: Content) {
		console.log(newContent);
		formData.update((current) => ({
			...current,
			bio: newContent
		}));
	}

	function onDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function onDragLeave() {
		isDragging = false;
	}
	function onDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		const file = e.dataTransfer?.files[0];
		if (file) handleFile(file);
	}

	async function handleFile(file: File) {
		if (file.size > 5 * 1024 * 1024) {
			return toast.error('File too big (max 5 MB)');
		}

		const objectUrl = URL.createObjectURL(file);
		const img = new Image();
		img.src = objectUrl;

		img.onload = async () => {
			URL.revokeObjectURL(objectUrl);

			const form = new FormData();
			form.append('file', file);

			let res: Response;
			try {
				res = await fetch('/api/file', {
					method: 'POST',
					body: form
				});
			} catch {
				return toast.error('Upload failed');
			}

			if (!res.ok) {
				return toast.error(`Upload error: ${res.statusText}`);
			}

			const { url: uploadedUrl } = await res.json();
			formData.update((current) => ({
				...current,
				profilePictureUrl: uploadedUrl
			}));
		};

		img.onerror = () => {
			URL.revokeObjectURL(objectUrl);
			toast.error('Invalid image file');
		};
	}

	function handleClick() {
		profilePictureFileInput.click();
	}

	async function handleRemove() {
		if (!$formData.profilePictureUrl) {
			return;
		}

		await fetch('/api/file', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ url: $formData.profilePictureUrl })
		});

		formData.update((current) => ({
			...current,
			profilePictureUrl: null
		}));
	}

	async function onFileSelected(event: Event) {
		const files = (event.target as HTMLInputElement).files;
		if (files?.length) {
			handleFile(files[0]);
		}
	}
</script>

<svelte:head>
	<title>{data.user.name.toUpperCase()}</title>
</svelte:head>

<!-- <SuperDebug
	data={{
		form: $formData,
		errors: $errors
	}}
/> -->
<section class="mx-auto max-w-2xl flex-1 px-5 pt-12 leading-6">
	<div class="flex flex-col gap-4">
		<form method="POST" use:enhance>
			<Label for="name" class="mb-1">Name</Label>
			<input
				bind:value={$formData.name}
				placeholder="Enter name"
				name="name"
				class="border-primary/80 font-futura block w-full border-b border-dashed
			 text-center text-4xl leading-1 font-semibold break-all whitespace-normal dark:text-white"
				{...$constraints.name}
			/>

			<div class="mt-4">
				<Label for="headline" class="mb-1">Headline</Label>
				<input
					bind:value={$formData.headline}
					placeholder="Enter headline"
					class="border-primary/80 font-futura block w-full border-b border-dashed text-center font-mono text-4xl leading-1
			 font-semibold break-all whitespace-normal italic dark:text-white"
					{...$constraints.name}
				/>
			</div>
			<div class="mt-4">
				<Label for="headline" class="mb-1">Profile's image</Label>
				<div class="relative">
					<input
						type="file"
						accept="image/*"
						bind:this={profilePictureFileInput}
						class="hidden"
						onchange={onFileSelected}
					/>
					{#if $formData.profilePictureUrl}
						<div class="group relative mx-auto my-4 h-48 w-48">
							<img src={$formData.profilePictureUrl} alt="Uploaded preview" class="rounded-full" />
							<div
								class="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity hover:opacity-100"
							>
								<button
									type="button"
									class="mt-2 rounded-3xl bg-red-600 p-3 text-sm text-white hover:cursor-pointer hover:bg-red-700"
									onclick={handleRemove}
								>
									<Trash />
								</button>
							</div>
						</div>
					{:else}
						<button
							type="button"
							aria-label="Upload image"
							class={cn(
								'placeholder hover:bg-secondary/80 mx-auto flex h-48 w-48 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed p-6 text-center',
								isDragging === true ? 'bg-secondary/80' : 'bg-secondary'
							)}
							onclick={handleClick}
							ondragover={onDragOver}
							ondragleave={onDragLeave}
							ondrop={onDrop}
						>
							<ImageUp class="mb-2 size-8" aria-hidden="true" />
							<p class="mt-4 text-sm font-medium">Click to upload or drag and drop</p>
							<p class="text-xs text-gray-500">Maximum file size 5MB.</p>
						</button>
					{/if}
				</div>
			</div>

			<div class="mt-8">
				<div class="tiptap flex flex-col gap-6">
					<Label for="title">Content</Label>
					<Editor content={bio} onChange={(e) => handleContentUpdate(e)} />
				</div>
				<input class="hidden" bind:value={$formData.bio} name="bio" />
			</div>

			<div class="mt-2 flex">
				<Button type="submit" class="ml-auto cursor-pointer">Update</Button>
			</div>
		</form>
	</div>
</section>
