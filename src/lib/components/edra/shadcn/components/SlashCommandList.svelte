<script lang="ts">
	import { cn } from '$lib/utils.js';
	import * as Command from '@/lib/components/ui/command/index.js';
	import type { SuggestionProps } from '@tiptap/suggestion';
	import * as ScrollArea from '@/lib/components/ui/scroll-area/index.js';

	interface Props extends SuggestionProps<any, any> {}

	const { editor, items, command }: Props = $props();

	let selectedGroupIndex = $state<number>(0);
	let selectedCommandIndex = $state<number>(0);

	const selectItem = (groupIndex: number, commandIndex: number) => {
		const execute = items[groupIndex].commands[commandIndex];
		command(execute);
		return;
	};

	async function handleKeyDown(e: KeyboardEvent) {
		if (!items.length) {
			return;
		}

		if (e.key === 'ArrowDown' || ((e.ctrlKey || e.metaKey) && e.key === 'j') || e.key === 'Tab') {
			e.preventDefault();
			if (!items.length) {
				return false;
			}
			const commands = items[selectedGroupIndex].commands;

			let newCommandIndex = selectedCommandIndex + 1;
			let newGroupIndex = selectedGroupIndex;
			if (commands.length - 1 < newCommandIndex) {
				newCommandIndex = 0;
				newGroupIndex = selectedGroupIndex + 1;
			}

			if (items.length - 1 < newGroupIndex) {
				newGroupIndex = 0;
			}
			selectedCommandIndex = newCommandIndex;
			selectedGroupIndex = newGroupIndex;
			return true;
		}

		if (e.key === 'ArrowUp' || ((e.ctrlKey || e.metaKey) && e.key === 'k')) {
			e.preventDefault();
			if (!items.length) {
				return false;
			}
			let newCommandIndex = selectedCommandIndex - 1;
			let newGroupIndex = selectedGroupIndex;
			if (newCommandIndex < 0) {
				newGroupIndex = selectedGroupIndex - 1;
				newCommandIndex = items[newGroupIndex]?.commands.length - 1 || 0;
			}
			if (newGroupIndex < 0) {
				newGroupIndex = items.length - 1;
				newCommandIndex = items[newGroupIndex].commands.length - 1;
			}
			selectedCommandIndex = newCommandIndex;
			selectedGroupIndex = newGroupIndex;
			return true;
		}

		if (e.key === 'Enter') {
			e.preventDefault();
			if (!items.length || selectedGroupIndex === -1 || selectedCommandIndex === -1) {
				return false;
			}
			selectItem(selectedGroupIndex, selectedCommandIndex);
			return true;
		}

		return false;
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if items.length}
	<ScrollArea.Root class="h-72 w-48 rounded-md border">
		<Command.Root>
			{#each items as grp, groupIndex (groupIndex)}
				<Command.Group heading={grp.title}>
					{#each grp.commands as command, commandIndex (commandIndex)}
						{@const Icon = command.icon}
						{@const isActive =
							selectedGroupIndex === groupIndex && selectedCommandIndex === commandIndex}
						<Command.Item
							onmouseenter={() => {
								selectedGroupIndex = groupIndex;
								selectedCommandIndex = commandIndex;
							}}
							onSelect={() => {
								selectItem(groupIndex, commandIndex);
							}}
							aria-selected={isActive}
							tabindex={isActive ? 0 : -1}
							role="option"
							class={cn('hover:bg-muted', isActive ? 'bg-muted' : '')}
						>
							<Icon />{command.tooltip}</Command.Item
						>
					{/each}
				</Command.Group>
			{/each}
		</Command.Root>
	</ScrollArea.Root>
{/if}
