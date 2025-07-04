<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { format } from 'date-fns';
	import Badge from './ui/badge/badge.svelte';

	export interface BlogCardProps {
		publishDate: Date;
		imageSource: string;
		imageAlt: string;
		title: string;
		link: string;
		tags?: string[];
	}

	let { publishDate, imageSource, imageAlt, title, link, tags = [] }: BlogCardProps = $props();

	const formattedDate = format(publishDate, 'MMMM d, yyyy');
</script>

<Card.Root class="w-full max-w-sm ">
	<Card.Content>
		<img src={imageSource} alt={imageAlt} class="w-full rounded-md" />
		<Card.Description class="my-1">{formattedDate}</Card.Description>
		<Card.Title class="mt-1">
			<a href={link}>{title}</a>
		</Card.Title>
	</Card.Content>
	<Card.Footer>
		{#each tags as tag}
			<Badge variant="secondary" class="mr-1 font-mono font-semibold">{tag}</Badge>
		{/each}
	</Card.Footer>
</Card.Root>
