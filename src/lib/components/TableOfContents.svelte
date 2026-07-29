<script lang="ts">
	import { onMount } from 'svelte';
	import { cn } from '$lib/utils.js';
	import type { TocHeading } from '@/lib/utils/toc';

	let { headings, class: className }: { headings: TocHeading[]; class?: string } = $props();

	let activeId = $state('');
	const minLevel = Math.min(...headings.map((h) => h.level));

	onMount(() => {
		const elements = headings
			.map((h) => document.getElementById(h.id))
			.filter((el): el is HTMLElement => el !== null);

		if (elements.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.find((entry) => entry.isIntersecting);
				if (visible) activeId = visible.target.id;
			},
			{ rootMargin: '-96px 0px -70% 0px' }
		);

		elements.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	});
</script>

<nav aria-label="Table of contents" class={cn('text-sm', className)}>
	<p class="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
		On this page
	</p>
	<ul class="border-border flex flex-col gap-1 border-l">
		{#each headings as heading (heading.id)}
			<li>
				<a
					href="#{heading.id}"
					class={cn(
						'-ml-px block border-l-2 py-1 pr-2 transition-colors',
						activeId === heading.id
							? 'border-primary text-foreground font-medium'
							: 'text-muted-foreground hover:text-foreground border-transparent'
					)}
					style="padding-left: {0.75 + (heading.level - minLevel) * 0.75}rem"
				>
					{heading.text}
				</a>
			</li>
		{/each}
	</ul>
</nav>
