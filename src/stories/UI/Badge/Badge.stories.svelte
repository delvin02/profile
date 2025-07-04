<script module lang="ts">
	import { Badge } from '@/lib/components/ui/badge/index.js';
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'UI/Badge',
		component: Badge,
		tags: ['autodocs']
	});
</script>

<Story name="Primary">Badge</Story>

<Story name="Secondary" args={{ variant: 'secondary' }}>Badge</Story>

<Story name="Destructive" args={{ variant: 'destructive' }}>Badge</Story>

<Story name="Outline" args={{ variant: 'outline' }}>Badge</Story>
