<!-- ThemeSelector.svelte -->
<script lang="ts">
	import type { ThemeConfig } from '$lib/themes';
	import type { Theme } from '@/routes/settings/schema';

	export let themes: ThemeConfig[];
	export let selectedTheme: string;
	export let onThemeChange: (theme: Theme) => void;
</script>

<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
	{#each themes as theme}
		<button
			type="button"
			class="relative cursor-pointer rounded-lg border-2 bg-white p-4 transition-all duration-200 hover:border-gray-300 {selectedTheme ===
			theme.name
				? 'border-blue-500 ring-2 ring-blue-200'
				: 'border-gray-200'}"
			on:click={() => onThemeChange(theme.name)}
			aria-label="Select {theme.displayName} theme"
		>
			<div class="mb-3 flex items-center justify-center">
				{#each theme.colors as color, index}
					<div
						class="h-8 w-8 rounded-full border-2 border-white shadow-sm"
						style="background-color: {color}; z-index: {theme.colors.length - index}"
						style:margin-left={index > 0 ? '-8px' : '0'}
					></div>
				{/each}
			</div>

			<div class="text-center">
				<h4 class="text-sm font-medium text-gray-900">{theme.displayName}</h4>
			</div>

			{#if selectedTheme === theme.name}
				<div class="absolute top-2 right-2 text-blue-500">
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
			{/if}
		</button>
	{/each}
</div>
