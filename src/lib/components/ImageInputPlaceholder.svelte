<script lang="ts">
	import ImageUp from '@lucide/svelte/icons/image-up';
	import Trash from '@lucide/svelte/icons/trash';
	import { toast } from 'svelte-sonner';
	import type { Icon } from '@lucide/svelte';
	import { cn } from '../utils';

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
		if (file.size > 5 * 1024 * 1024) {
			return toast.error('File too big (max 5 MB)');
		}

		const objectUrl = URL.createObjectURL(file);
		const img = new Image();
		img.src = objectUrl;

		img.onload = async () => {
			URL.revokeObjectURL(objectUrl);

			const ratio = img.width / img.height;
			if (Math.abs(ratio - 16 / 9) > 0.01) {
				return toast.error('Image must be 16:9 aspect ratio');
			}

			const form = new FormData();
			form.append('image', file);

			let res: Response;
			try {
				res = await fetch('/api/image', {
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
			onChange(uploadedUrl);
		};

		img.onerror = () => {
			URL.revokeObjectURL(objectUrl);
			toast.error('Invalid image file');
		};
	}

	function handleClick() {
		fileInput.click();
	}

	async function handleRemove() {
		if (!imageUrl) {
			return;
		}

		await fetch('/api/image', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ url: imageUrl })
		});
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
	<div class={cn('group relative my-4', className)}>
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
		class={cn(
			'placeholder hover:bg-secondary/80 flex w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed p-6 text-center',
			className,
			isDragging === true ? 'bg-secondary/80' : 'bg-secondary'
		)}
		onclick={handleClick}
		ondragover={onDragOver}
		ondragleave={onDragLeave}
		ondrop={onDrop}
	>
		<ImageUp class="mb-2 size-8" aria-hidden="true" />
		<p class="mt-4 font-medium">{title}</p>
		<p class="text-sm text-gray-500">{description}</p>
	</button>
{/if}
