<script lang="ts">
	import { cn } from '@/lib/utils';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	let { class: className = '' } = $props();
</script>

<LoaderCircle
	class={cn(
		'align-center justify-center" text-primary mx-auto flex size-4 animate-spin',
		className
	)}
/>
