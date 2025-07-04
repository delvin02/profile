<script module lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'UI/Button',
		component: Button,
		tags: ['autodocs']
	});
</script>

<Story name="Primary">Button</Story>

<Story name="Secondary" args={{ variant: 'secondary' }}>Button</Story>

<Story name="Destructive" args={{ variant: 'destructive' }}>Button</Story>

<Story name="Ghost" args={{ variant: 'ghost' }}>Button</Story>

<Story name="Link" args={{ variant: 'link' }}>Button</Story>
