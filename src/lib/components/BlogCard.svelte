<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { format } from 'date-fns';
	import Badge from './ui/badge/badge.svelte';
	import { userStore } from '../stores/userStore';
	import Separator from './ui/separator/separator.svelte';
	import type { Blog } from '../server/db/schema';

	export interface BlogCardProps {
		publishDate: Date;
		imageSource: string | null;
		imageAlt: string;
		title: string;
		description?: string | null;
		link: string;
		blog: Partial<Blog>;
		tags?: string[];
	}

	let {
		publishDate,
		imageSource,
		imageAlt,
		title,
		description,
		link,
		tags = [],
		blog
	}: BlogCardProps = $props();

	const { user, isLoggedIn } = userStore;

	const formattedDate = format(publishDate, 'MMMM d, yyyy');
</script>

<Card.Root class="w-full max-w-sm ">
	<Card.Content class="flex-1">
		<img
			src={imageSource || '/images/no-image-found.png'}
			alt={imageAlt}
			class="w-full rounded-md"
		/>
		<Card.Description class="my-1">{formattedDate}</Card.Description>
		<Card.Title class="mt-1">
			<a href={link}>{title}</a>
		</Card.Title>
		{#if description}
			<Card.Description class="mt-1 italic">
				{description}
			</Card.Description>
		{/if}
	</Card.Content>
	{#if tags && tags.length > 0}
		<Card.Footer>
			{#each tags as tag}
				<Badge variant="secondary" class="mr-1 font-mono font-semibold uppercase">{tag}</Badge>
			{/each}
		</Card.Footer>
	{/if}
	{#if $isLoggedIn}
		<Separator />
		<Card.Footer class="flex gap-2">
			<p>Status:</p>
			{#if blog.deletedAt}
				<Badge variant="destructive" class="mr-1 py-1 font-mono font-semibold uppercase"
					>Archived</Badge
				>
			{:else}
				<Badge variant="default" class="mr-1 py-1 font-mono font-semibold uppercase">Active</Badge>
			{/if}
		</Card.Footer>
	{/if}
</Card.Root>
