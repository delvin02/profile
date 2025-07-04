<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Editor from './Editor.svelte';

	const { Story } = defineMeta({
		title: 'Block/Editor',
		component: Editor,
		tags: ['autodocs'],
		parameters: {
			layout: 'fullscreen'
		}
	});
</script>

<Story name="Editor" />
