<script lang="ts">
	import { onDestroy, onMount, type Snippet } from 'svelte';
	import { NodeViewWrapper } from 'svelte-tiptap';
	import type { NodeViewProps } from '@tiptap/core';
	import { cn } from '$lib/utils.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';

	import AlignCenter from '@lucide/svelte/icons/align-center';
	import AlignLeft from '@lucide/svelte/icons/align-left';
	import AlignRight from '@lucide/svelte/icons/align-right';
	import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import Fullscreen from '@lucide/svelte/icons/fullscreen';
	import Trash from '@lucide/svelte/icons/trash';
	import Captions from '@lucide/svelte/icons/captions';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { duplicateContent } from '../../utils.js';

	interface MediaExtendedProps extends NodeViewProps {
		children: Snippet<[]>;
		mediaRef?: HTMLElement;
	}

	const {
		node,
		editor,
		selected,
		deleteNode,
		updateAttributes,
		children,
		mediaRef = $bindable()
	}: MediaExtendedProps = $props();

	$inspect(updateAttributes);
	const minWidthPercent = 15;
	const maxWidthPercent = 100;

	let nodeRef = $state<HTMLElement>();

	let resizing = $state(false);
	let resizingInitialWidthPercent = $state(0);
	let resizingInitialMouseX = $state(0);
	let resizingPosition = $state<'left' | 'right'>('left');
	let openedMore = $state(false);

	function handleResizingPosition(e: MouseEvent, position: 'left' | 'right') {
		startResize(e);
		resizingPosition = position;
	}

	function startResize(e: MouseEvent) {
		e.preventDefault();
		resizing = true;
		resizingInitialMouseX = e.clientX;
		if (mediaRef && nodeRef?.parentElement) {
			const currentWidth = mediaRef.offsetWidth;
			const parentWidth = nodeRef.parentElement.offsetWidth;
			resizingInitialWidthPercent = (currentWidth / parentWidth) * 100;
		}
	}

	function resize(e: MouseEvent) {
		if (!resizing || !nodeRef?.parentElement) return;
		let dx = e.clientX - resizingInitialMouseX;
		if (resizingPosition === 'left') {
			dx = resizingInitialMouseX - e.clientX;
		}
		const parentWidth = nodeRef.parentElement.offsetWidth;
		const deltaPercent = (dx / parentWidth) * 100;
		const newWidthPercent = Math.max(
			Math.min(resizingInitialWidthPercent + deltaPercent, maxWidthPercent),
			minWidthPercent
		);
		updateAttributes({ width: `${newWidthPercent}%` });
	}

	function endResize() {
		resizing = false;
		resizingInitialMouseX = 0;
		resizingInitialWidthPercent = 0;
	}

	function handleTouchStart(e: TouchEvent, position: 'left' | 'right') {
		e.preventDefault();
		console.log('touch start');
		resizing = true;
		resizingPosition = position;
		resizingInitialMouseX = e.touches[0].clientX;
		if (mediaRef && nodeRef?.parentElement) {
			const currentWidth = mediaRef.offsetWidth;
			const parentWidth = nodeRef.parentElement.offsetWidth;
			resizingInitialWidthPercent = (currentWidth / parentWidth) * 100;
		}
	}

	function handleTouchMove(e: TouchEvent) {
		if (!resizing || !nodeRef?.parentElement) return;
		let dx = e.touches[0].clientX - resizingInitialMouseX;
		if (resizingPosition === 'left') {
			dx = resizingInitialMouseX - e.touches[0].clientX;
		}
		const parentWidth = nodeRef.parentElement.offsetWidth;
		const deltaPercent = (dx / parentWidth) * 100;
		const newWidthPercent = Math.max(
			Math.min(resizingInitialWidthPercent + deltaPercent, maxWidthPercent),
			minWidthPercent
		);
		updateAttributes({ width: `${newWidthPercent}%` });
	}

	function handleTouchEnd() {
		resizing = false;
		resizingInitialMouseX = 0;
		resizingInitialWidthPercent = 0;
	}

	onMount(() => {
		nodeRef = document.getElementById('resizable-container-media') as HTMLDivElement;

		window.addEventListener('mousemove', resize);
		window.addEventListener('mouseup', endResize);
		window.addEventListener('touchmove', handleTouchMove);
		window.addEventListener('touchend', handleTouchEnd);
	});

	onDestroy(() => {
		window.removeEventListener('mousemove', resize);
		window.removeEventListener('mouseup', endResize);
		window.removeEventListener('touchmove', handleTouchMove);
		window.removeEventListener('touchend', handleTouchEnd);
	});
</script>

<!-- !FIXME: For some wierd reason, the change in `node.attrs.align` is not reactive to NodeViewWrapper 
 So for now, we'll re-render it when the align changes.
-->

{#key node.attrs.align}
	<NodeViewWrapper
		id="resizable-container-media"
		class={cn(
			'relative my-2 flex flex-col rounded-md border-2 border-transparent',
			selected ? 'border-muted-foreground' : '',
			node.attrs.align === 'left' && 'mr-auto',
			node.attrs.align === 'center' && 'mx-auto',
			node.attrs.align === 'right' && 'ml-auto'
		)}
		style={`width: ${node.attrs.width}`}
	>
		<div class={cn('group relative flex flex-col rounded-md', resizing && '')}>
			{@render children()}

			{#if editor.isEditable}
				<div
					role="button"
					tabindex="0"
					aria-label="Back"
					class="absolute inset-y-0 z-20 flex w-[25px] cursor-col-resize items-center justify-start p-2"
					style="left: 0px"
					onmousedown={(event: MouseEvent) => {
						handleResizingPosition(event, 'left');
					}}
					ontouchstart={(event: TouchEvent) => {
						handleTouchStart(event, 'left');
					}}
				>
					<div
						class="bg-muted z-20 h-[70px] w-1 rounded-xl border opacity-0 transition-all group-hover:opacity-100"
					></div>
				</div>

				<div
					role="button"
					tabindex="0"
					aria-label="Back"
					class="absolute inset-y-0 z-20 flex w-[25px] cursor-col-resize items-center justify-end p-2"
					style="right: 0px"
					onmousedown={(event: MouseEvent) => {
						handleResizingPosition(event, 'right');
					}}
					ontouchstart={(event: TouchEvent) => {
						handleTouchStart(event, 'right');
					}}
				>
					<div
						class="bg-muted z-20 h-[70px] w-1 rounded-xl border opacity-0 transition-all group-hover:opacity-100"
					></div>
				</div>
				<div
					class={cn(
						'bg-background/50 absolute -top-2 left-[calc(50%-3rem)] flex items-center gap-1 rounded border p-1 opacity-0 backdrop-blur-sm transition-opacity',
						!resizing && 'group-hover:opacity-100',
						openedMore && 'opacity-100'
					)}
				>
					<Button
						variant="ghost"
						class={cn('size-6 p-0', node.attrs.align === 'left' && 'bg-muted')}
						onclick={() => updateAttributes({ align: 'left' })}
						title="Align Left"
					>
						<AlignLeft class="size-4" />
					</Button>
					<Button
						variant="ghost"
						class={cn('size-6 p-0', node.attrs.align === 'center' && 'bg-muted')}
						onclick={() => updateAttributes({ align: 'center' })}
						title="Align Center"
					>
						<AlignCenter class="size-4" />
					</Button>
					<Button
						variant="ghost"
						class={cn('size-6 p-0', node.attrs.align === 'right' && 'bg-muted')}
						onclick={() => updateAttributes({ align: 'right' })}
						title="Align Right"
					>
						<AlignRight class="size-4" />
					</Button>
					<DropdownMenu.Root bind:open={openedMore} onOpenChange={(value) => (openedMore = value)}>
						<DropdownMenu.Trigger
							class={buttonVariants({ variant: 'ghost', class: 'size-6 p-0' })}
							title="More Options"
						>
							<EllipsisVertical class="size-4" />
						</DropdownMenu.Trigger>
						<DropdownMenu.Content
							align="start"
							alignOffset={-90}
							class="mt-1 overflow-auto text-sm"
						>
							<DropdownMenu.Item
								onclick={() => {
									if (node.attrs.title === null || node.attrs.title.trim() === '')
										updateAttributes({
											title: 'Image Caption'
										});
								}}
							>
								<Captions class="mr-1 size-4" /> Caption
							</DropdownMenu.Item>
							<DropdownMenu.Item
								onclick={() => {
									duplicateContent(editor, node);
								}}
							>
								<CopyIcon class="mr-1 size-4" /> Duplicate
							</DropdownMenu.Item>
							<DropdownMenu.Item
								onclick={() => {
									updateAttributes({
										width: '100%'
									});
								}}
							>
								<Fullscreen class="mr-1 size-4" /> Full Screen
							</DropdownMenu.Item>
							<DropdownMenu.Item
								onclick={() => {
									deleteNode();
								}}
								class="text-destructive hover:text-destructive"
							>
								<Trash class="mr-1 size-4 stroke-red-600" /> Delete
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			{/if}
		</div>
	</NodeViewWrapper>
{/key}
