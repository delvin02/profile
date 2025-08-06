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
				<Button variant="secondary" href={$user.linkedInUrl} target="_blank" class="cursor-pointer">
					<Linkedin class="size-6" href={$user.linkedInUrl} />
				</Button>
			{/if}
			{#if $user.resumeUrl}
				<Button variant="secondary" class="cursor-pointer" href={$user.resumeUrl} target="_blank"
					><FileUser class="size-6" />
				</Button>
			{/if}
		</div>
		<div class="my-2 flex flex-row justify-center gap-x-1.5 dark:text-white">
			<p class="text-primary text-base leading-none font-bold">{$user.name.toUpperCase()}</p>
			<p class="text-center text-base leading-none">© {year}</p>
			<span class="text-base leading-none">|</span>
			<p class="text-base leading-none">
				Made with ❤️ by <a href="https://delvin.portfolio-me.bio" target="_blank" class="underline"
					>Delvin Khor</a
				>
			</p>
		</div>
	</div>
</footer>
