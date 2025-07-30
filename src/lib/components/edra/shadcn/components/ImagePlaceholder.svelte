<script lang="ts">
	import ImagePlaceholder from '../../components/ImagePlaceholder.svelte';
	import type { NodeViewProps } from '@tiptap/core';

	const { editor }: NodeViewProps = $props();
	import ImageUp from '@lucide/svelte/icons/image-up';
	import { toast } from 'svelte-sonner';

	let fileInput: HTMLInputElement;

	async function handleFile(file: File) {
		if (file.size > 5 * 1024 * 1024) {
			toast.error('File too big (max 5 MB)');
			return;
		}

		const form = new FormData();
		form.append('file', file);
		let res: Response;

		try {
			res = await fetch('/api/file', { method: 'POST', body: form });
		} catch (err) {
			toast.error('Upload failed');
			return;
		}
		if (!res.ok) {
			toast.error(`Upload error: ${res.statusText}`);
			return;
		}
		const { url } = await res.json();

		editor.chain().focus().setImage({ src: url }).run();
	}

	function handleClick() {
		fileInput.click();
	}

	async function onFileSelected(event: Event) {
		const files = (event.target as HTMLInputElement).files;
		if (files?.length) {
			handleFile(files[0]);
		}
	}
</script>

<ImagePlaceholder
	icon={ImageUp}
	title="Click to upload or drag and drop"
	description="Maximum file size 5MB."
	onClick={handleClick}
	onFileDrop={(e: File) => handleFile(e)}
/>

<input
	type="file"
	accept="image/*"
	bind:this={fileInput}
	onchange={onFileSelected}
	class="hidden"
/>
