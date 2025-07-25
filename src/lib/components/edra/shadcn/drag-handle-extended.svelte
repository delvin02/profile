<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { onMount } from 'svelte';
	import GripVertical from '@lucide/svelte/icons/grip-vertical';
	import { DragHandlePlugin } from '../extensions/drag-handle/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { Node } from '@tiptap/pm/model';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import RemoveFormatting from '@lucide/svelte/icons/remove-formatting';
	import Duplicate from '@lucide/svelte/icons/copy';
	import Clipboard from '@lucide/svelte/icons/clipboard';
	import Delete from '@lucide/svelte/icons/trash-2';
	import { NodeSelection } from '@tiptap/pm/state';
	import { toast } from 'svelte-sonner';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	let currentNode: Node | null = $state(null);
	let currentNodePos: number = $state(-1);
	let open = $state(false);

	const pluginKey = 'globalDragHandle';

	onMount(() => {
		const plugin = DragHandlePlugin({
			pluginKey: pluginKey,
			dragHandleWidth: 20,
			scrollTreshold: 100,
			dragHandleSelector: '.drag-handle',
			excludedTags: ['pre', 'code', 'table p'],
			customNodes: [],
			onMouseMove: onMouseMove
		});
		editor.registerPlugin(plugin);
		return () => editor.unregisterPlugin(pluginKey);
	});

	const onMouseMove = (data: { node: Node; pos: number }) => {
		if (data.node) currentNode = data.node;
		currentNodePos = data.pos;
	};

	const handleRemoveFormatting = () => {
		const chain = editor.chain();
		chain.setNodeSelection(currentNodePos).unsetAllMarks();
		chain.setNode('paragraph');
		chain.run();
	};

	const handleDuplicate = () => {
		editor.commands.setNodeSelection(currentNodePos);
		const selectedNode =
			editor.state.selection.$anchor.node(1) || (editor.state.selection as NodeSelection).node;
		editor
			.chain()
			.setMeta('hideDragHandle', true)
			.insertContentAt(currentNodePos + (currentNode?.nodeSize || 0), selectedNode.toJSON())
			.run();
	};

	const handleCopyToClipboard = async () => {
		editor.chain().setMeta('hideDragHandle', true).setNodeSelection(currentNodePos).run();
		/**
		 * !FIXME: document.execCommand is deprecated, use navigator.clipboard.writeText instead
		 */
		document.execCommand('copy');
		toast.success('Copied to clipboard!');
	};

	const handleDelete = () => {
		editor
			.chain()
			.setMeta('hideDragHandle', true)
			.setNodeSelection(currentNodePos)
			.deleteSelection()
			.run();
	};
</script>

<div class="drag-handle">
	<Button variant="ghost" class="!size-6 rounded-sm p-0" onclick={() => (open = true)}>
		<GripVertical />
	</Button>
	<DropdownMenu.Root bind:open>
		<DropdownMenu.Trigger class="sr-only">
			<span>Drag Handle</span>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Item onclick={handleRemoveFormatting}>
				<RemoveFormatting />
				Remove Formatting
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={handleDuplicate}>
				<Duplicate />
				Duplicate Node
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={handleCopyToClipboard}>
				<Clipboard />
				Copy to clipboard
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={handleDelete}>
				<Delete class="text-destructive stroke-red-600" />
				Delete
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
