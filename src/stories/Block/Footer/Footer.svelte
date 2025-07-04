<script lang="ts">
	import Linkedin from '@lucide/svelte/icons/linkedin';
	import FileUser from '@lucide/svelte/icons/file-user';
	import Button from '@/lib/components/ui/button/button.svelte';
	import Separator from '@/lib/components/ui/separator/separator.svelte';

	const year: number = new Date().getFullYear();
</script>

<footer class="mt-6 bg-white dark:bg-gray-900">
	<Separator />
	<div class="flex w-full flex-col">
		<div class="mx-auto my-4 flex gap-1">
			<Button variant="link" class="cursor-pointer">
				<Linkedin class="size-6 stroke-blue-500" />
			</Button>
			<Button variant="link" class="cursor-pointer"
				><FileUser class="size-6 stroke-gray-500 dark:stroke-white" />
			</Button>
		</div>
		<div class="my-2 flex flex-row justify-center dark:text-white">
			<p class="text-primary font-bold">Your Name</p>
			{' '}
			<p class="ml-1 text-center">&#169; {year}</p>
		</div>
	</div>
</footer>
