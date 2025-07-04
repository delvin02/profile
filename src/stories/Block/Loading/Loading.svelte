<script lang="ts">
	import { cn } from '@/lib/utils';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	let { class: className = '' } = $props();
</script>

<LoaderCircle
	class={cn(
		'align-center justify-center" text-primary mx-auto flex size-8 min-h-screen animate-spin md:size-12 lg:size-18',
		className
	)}
/>
