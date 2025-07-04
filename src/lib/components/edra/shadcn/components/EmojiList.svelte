<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { EmojiItem } from '@tiptap/extension-emoji';
	import type { SuggestionProps } from '@tiptap/suggestion';

	interface Props extends SuggestionProps<any, any> {}

	const { items, command }: Props = $props();

	function handleOnClick(item: EmojiItem) {
		if (!item.emoji) {
			console.warn('Emoji item has no emoji property:', item);
			return;
		}

		command(item);
	}
</script>

{#if items && items.length > 0}
	<DropdownMenu.Root open={true}>
		<DropdownMenu.Trigger>
			<span style="display: none;"></span>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content
			side="bottom"
			align="start"
			onOpenAutoFocus={(event) => {
				event.preventDefault();
			}}
			onCloseAutoFocus={(event) => {
				event.preventDefault();
			}}
			preventScroll={false}
			class="max-w-full min-w-48"
		>
			{#each items as item}
				<DropdownMenu.Item onclick={() => handleOnClick(item)} class="cursor-pointer">
					{item.emoji} :{item.name}:
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
