<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { EdraEditorProps } from '../types.js';
	import initEditor from '../editor.js';
	import { focusEditor } from '../utils.js';
	import { cn } from '$lib/utils.js';
	import '../editor.css';
	import './style.css';
	import '../onedark.css';
	import { all, createLowlight } from 'lowlight';
	import { SvelteNodeViewRenderer } from 'svelte-tiptap';
	import CodeBlock from './components/CodeBlock.svelte';
	import TableCol from './menus/TableCol.svelte';
	import TableRow from './menus/TableRow.svelte';
	import Link from './menus/Link.svelte';

	const lowlight = createLowlight(all);

	/**
	 * Bind the element to the editor
	 */
	let element = $state<HTMLElement>();
	let {
		editor = $bindable(),
		editable = true,
		content,
		onUpdate,
		autofocus = false,
		class: className
	}: EdraEditorProps = $props();

	onMount(() => {
		editor = initEditor(
			element,
			content,
			[
				// ImagePlaceholder(ImagePlaceholderComp),
				// ImageExtended(ImageExtendedComp),
				// VideoPlaceholder(VideoPlaceHolderComp),
				// VideoExtended(VideoExtendedComp),
				// AudioPlaceholder(AudioPlaceHolderComp),
				// AudioExtended(AudioExtendedComp),
				// IFramePlaceholder(IFramePlaceHolderComp),
				// IFrameExtended(IFrameExtendedComp),
				// slashcommand(SlashCommandList)
			],
			{
				onUpdate,
				onTransaction(props) {
					editor = undefined;
					editor = props.editor;
				},
				editable,
				autofocus
			}
		);
	});

	onDestroy(() => {
		if (editor) editor.destroy();
	});
</script>

{#if editor && !editor.isDestroyed}
	<Link {editor} />
	<TableCol {editor} />
	<TableRow {editor} />
{/if}
<div
	bind:this={element}
	role="button"
	tabindex="0"
	onclick={(event) => focusEditor(editor, event)}
	onkeydown={(event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			console.log('enter');
			focusEditor(editor, event);
		}
	}}
	class={cn('edra-editor h-full w-full cursor-auto pb-2 *:outline-none', className)}
></div>
