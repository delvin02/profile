<script lang="ts">
	import Trash from '@lucide/svelte/icons/trash';
	import SquareArrowOutUpRight from '@lucide/svelte/icons/square-arrow-out-up-right';
	import { type Icon } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { cn } from '../utils';

	interface Props {
		icon: typeof Icon;
		fileUrl?: string | null;
		title?: string;
		onChange?: (url: string | null) => void;
		class?: string;
	}

	const { icon, fileUrl = null, title, onChange, class: className = '' }: Props = $props();

	let fileInput = $state<HTMLInputElement | null>(null);
	let isDragging = $state(false);

	function onDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function onDragLeave() {
		isDragging = false;
	}

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
		if (onChange) onChange(url);
	}

	async function handleRemove() {
		if (!fileUrl) {
			return;
		}

		await fetch('/api/file', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ url: fileUrl })
		});
		if (onChange) {
			onChange(null);
		}
	}

	function handleClick() {
		fileInput?.click();
	}

	async function onFileSelected(event: Event) {
		const files = (event.target as HTMLInputElement).files;
		if (files?.length) {
			handleFile(files[0]);
		}
	}
</script>

{#if fileUrl}
	<div class={cn('group relative my-4  flex h-full w-full items-center gap-2', className)}>
		<button
			type="button"
			class="mt-2 rounded-3xl bg-red-600 p-3 text-sm text-white hover:cursor-pointer hover:bg-red-700"
			onclick={handleRemove}
		>
			<Trash />
		</button>
		<a href={fileUrl} class="ml-2 flex gap-2 underline">View resume <SquareArrowOutUpRight /></a>
	</div>
{:else}
	<button
		type="button"
		class={cn(
			'my-4 h-full w-full rounded-lg border-2 border-dashed select-none',
			className,
			isDragging ? 'bg-primary/40' : 'bg-secondary'
		)}
		ondragover={onDragOver}
		ondragleave={onDragLeave}
		onclick={handleClick}
	>
		<input type="file" bind:this={fileInput} class="hidden" onchange={onFileSelected} />

		<div class="flex cursor-pointer flex-col items-center p-6">
			{#if icon}
				{@const Icon = icon}
				<Icon class="mb-2 size-8" />
			{/if}
			<div class="flex flex-col items-center justify-center text-center">
				<span class="mt-4">{title}</span>
			</div>
		</div>
	</button>
{/if}
