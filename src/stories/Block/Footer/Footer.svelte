<script lang="ts">
	import Linkedin from '@lucide/svelte/icons/linkedin';
	import FileUser from '@lucide/svelte/icons/file-user';
	import Button from '@/lib/components/ui/button/button.svelte';
	import Separator from '@/lib/components/ui/separator/separator.svelte';
	import { userStore } from '$lib/stores/userStore';

	const { user } = userStore;
	const year: number = new Date().getFullYear();
</script>

<footer class="mt-6 bg-white dark:bg-gray-900">
	<Separator />
	<div class="flex w-full flex-col">
		<div class="mx-auto my-4 flex gap-1">
			{#if $user.linkedInUrl}
				<Button variant="secondary" class="cursor-pointer">
					<Linkedin class="size-6" href={$user.linkedInUrl} />
				</Button>
			{/if}
			{#if $user.resumeUrl}
				<Button variant="secondary" class="cursor-pointer" href={$user.resumeUrl}
					><FileUser class="size-6" />
				</Button>
			{/if}
		</div>
		<div class="my-2 flex flex-row justify-center dark:text-white">
			<p class="text-primary font-bold">{$user.name.toUpperCase()}</p>
			{' '}
			<p class="ml-1 text-center">&#169; {year}</p>
		</div>
	</div>
</footer>
