<script module lang="ts">
	import BlogCard from '@/lib/components/BlogCard.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Docs from '../../assets/docs.png';

	const { Story } = defineMeta({
		title: 'UI/BlogCard',
		component: BlogCard,
		tags: ['autodocs'],
		argTypes: {
			publishDate: { control: 'date' },
			imageSource: { control: 'text' },
			imageAlt: { control: 'text' },
			title: { control: 'text' },
			link: { control: 'text' },
			tags: { control: 'object' }
		}
	});
</script>

<Story
	name="Primary"
	args={{
		publishDate: new Date('2022-08-18'),
		imageSource: Docs,
		imageAlt: 'addon library',
		title: 'Build a Landing Page with Chakra UI',
		link: '/posts/morning-hikes',
		tags: ['storybook', 'ui', 'guide']
	}}
/>
