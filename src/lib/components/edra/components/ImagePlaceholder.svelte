<script lang="ts">
	import { NodeViewWrapper } from 'svelte-tiptap';
	import type { Icon } from '@lucide/svelte';

	interface Props {
		icon: typeof Icon;
		title?: string;
		description?: string;
		onClick?: () => void;
		onFileDrop?: (file: File) => void;
		class?: string;
	}

	const { icon, title, description, onClick, onFileDrop, class: className = '' }: Props = $props();

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
		if (file && onFileDrop) onFileDrop(file);
	}
</script>

<NodeViewWrapper
	as="div"
	contenteditable="false"
	class="my-4 h-full rounded-lg border-2 border-dashed select-none {className} {isDragging
		? 'bg-primary/40'
		: 'bg-secondary'}"
	onclick={onClick}
	ondragover={onDragOver}
	ondragleave={onDragLeave}
	ondrop={onDrop}
>
	<div class="flex cursor-pointer flex-col items-center p-6">
		{#if icon}
			{@const Icon = icon}
			<Icon class="mb-2 size-8" />
		{/if}
		<div class="flex flex-col items-center justify-center text-center">
			<span class="mt-4">{title}</span>
			<span class="text-muted-foreground text-xs">{description}</span>
		</div>
	</div>
</NodeViewWrapper>
