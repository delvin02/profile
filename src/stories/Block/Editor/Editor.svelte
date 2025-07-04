<script lang="ts">
	import {
		EdraDragHandleExtended,
		EdraEditor,
		EdraToolBar
	} from '@/lib/components/edra/shadcn/index.js';
	import type { Content, Editor, JSONContent } from '@tiptap/core';
	import sampleContent from './data/content.json' with { type: 'json' };

	interface EditorProps {
		content: Content;
		onChange?: (content: JSONContent) => void;
	}

	let { content = sampleContent as JSONContent, onChange }: EditorProps = $props();

	let editor = $state<Editor>();

	function onUpdate() {
		if (!editor) return;
		content = editor.getJSON();
		if (onChange) {
			onChange(content);
		}
	}
</script>

<div class="bg-background z-50 rounded-md border border-dashed">
	{#if editor && !editor.isDestroyed}
		<div class="sticky top-0 z-50">
			<EdraToolBar
				class="bg-secondary scrollbar-thin flex w-full  max-w-full flex-nowrap items-center justify-center overflow-x-auto border-b border-dashed p-0.5 whitespace-nowrap"
				{editor}
			/>
			<EdraDragHandleExtended {editor} />
		</div>
	{/if}
	<EdraEditor bind:editor {content} class="mt-2 pr-2 pl-6" {onUpdate} />
</div>
