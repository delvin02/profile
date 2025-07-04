<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Loading from './Loading.svelte';

	const { Story } = defineMeta({
		title: 'Block/Loading',
		component: Loading,
		tags: ['autodocs']
	});
</script>

<Story name="Loading" />
