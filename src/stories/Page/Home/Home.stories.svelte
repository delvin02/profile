<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Home from './Home.svelte';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Page/Home',
		component: Home,
		parameters: {
			// More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
			layout: 'fullscreen'
		}
	});
</script>

<Story name="Home" />
