<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { toast } from 'svelte-sonner';
	import ButtonLoader from './ButtonLoader.svelte';
	import Button from './ui/button/button.svelte';
	import type { Tag } from '../server/db/schema/tag';
	import Badge from './ui/badge/badge.svelte';
	import { enhance } from '$app/forms';

	interface Props {
		tags: Tag[];
		open: boolean;
		onClose: () => void;
	}

	let { open, tags = [], onClose }: Props = $props();

	let isSubmitting = $state(false);
	let name = $state('');

	async function onSave() {
		try {
			isSubmitting = true;

			const form = new FormData();
			form.append('name', name);

			const res = await fetch('/api/tag', {
				method: 'POST',
				body: form
			});

			if (res.status === 400) {
				const { errors } = await res.json();
				throw errors;
			}

			if (!res.ok) {
				throw new Error(res.statusText);
			}

			const { tag } = await res.json();
			toast.success('Tag created successfully!');
			return tag as Tag;
		} catch (e) {
			console.log(e);
			toast.error('Something went wrong');
		} finally {
			isSubmitting = false;
			onClose();
		}
	}
</script>

<Dialog.Root bind:open onOpenChange={onClose}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Manage tags</Dialog.Title>
			<Dialog.Description>Add new tag here, click save when you're done.</Dialog.Description>
		</Dialog.Header>
		<form class="grid gap-4 py-4" onsubmit={onSave} use:enhance>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Tag</Label>
				<Input
					id="name"
					name="name"
					placeholder="Enter new tag"
					class="col-span-3"
					bind:value={name}
					disabled={isSubmitting}
				/>
			</div>
			<Dialog.Footer>
				<Button type="submit" disabled={isSubmitting}>
					Save
					{#if isSubmitting}
						<ButtonLoader />
					{/if}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
