<script lang="ts">
	import ImageUp from '@lucide/svelte/icons/image-up';
	import Trash from '@lucide/svelte/icons/trash';
	import { toast } from 'svelte-sonner';
	import type { Icon } from '@lucide/svelte';

	interface Props {
		imageUrl?: string | null;
		icon?: typeof Icon;
		title?: string;
		description?: string;
		class?: string;
		onChange: (url: string | null) => void;
	}

	const {
		imageUrl = null,
		icon = ImageUp,
		title = 'Click to upload or drag and drop',
		description = 'Maximum file size 5MB.',
		class: className = '',
		onChange
	}: Props = $props();

	let fileInput: HTMLInputElement;

	let isDragging = $state(false);

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
		console.log('handle file');

		if (file.size > 5 * 1024 * 1024) {
			toast.error('File too big (max 5 MB)');
			return;
		}

		const form = new FormData();
		form.append('image', file);
		let res: Response;

		try {
			res = await fetch('/api/upload-image', { method: 'POST', body: form });
		} catch (err) {
			toast.error('Upload failed');
			return;
		}
		if (!res.ok) {
			toast.error(`Upload error: ${res.statusText}`);
			return;
		}
		const { url } = await res.json();
		onChange(url);
	}

	function handleClick() {
		fileInput.click();
	}

	function handleRemove() {
		onChange(null);
	}

	async function onFileSelected(event: Event) {
		const files = (event.target as HTMLInputElement).files;
		if (files?.length) {
			handleFile(files[0]);
		}
	}
</script>

<input
	type="file"
	accept="image/*"
	bind:this={fileInput}
	class="hidden"
	onchange={onFileSelected}
/>
{#if imageUrl}
	<div class="group relative my-4">
		<img src={imageUrl} alt="Uploaded preview" class="max-w-full rounded-lg" />
		<div
			class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100"
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
		class="placeholder bg-secondary hover:bg-secondary/80 flex w-full flex-col items-center justify-center border-2 border-dashed p-6 text-center"
		onclick={handleClick}
		ondragover={onDragOver}
		ondragleave={onDragLeave}
		ondrop={onDrop}
	>
		<ImageUp class="mb-2 size-8" aria-hidden="true" />
		<p class="mt-4 font-medium">Click to upload or drag and drop</p>
		<p class="text-sm text-gray-500">Maximum file size 5 MB</p>
	</button>
{/if}
