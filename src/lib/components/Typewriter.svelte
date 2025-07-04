<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export interface TypewriterProps {
		text: string;
		speed?: number;
		loop?: boolean;
	}

	const { text = '', speed = 100, loop = false }: TypewriterProps = $props();

	let displayed = $state('');
	let index = 0;
	let timeoutId: ReturnType<typeof setTimeout>;

	const tick = () => {
		if (index <= text.length) {
			displayed = text.slice(0, index);
			index += 1;
			timeoutId = setTimeout(tick, speed);
		} else if (loop) {
			timeoutId = setTimeout(() => {
				index = 0;
				tick();
			}, 1000);
		}
	};

	onMount(() => {
		tick();
	});

	onDestroy(() => {
		clearTimeout(timeoutId);
	});
</script>

<span
	class="my-2 block w-full text-center font-mono leading-snug font-semibold break-words
         whitespace-pre-wrap italic md:text-2xl
         lg:my-8 dark:text-white"
>
	{displayed}
</span>
