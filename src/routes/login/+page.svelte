<script lang="ts">
	import LoginForm from '$lib/components/login-form.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { loginSchema } from './schema.js';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Card from '$lib/components/ui/card/index.js';
	import Label from '@/lib/components/ui/label/label.svelte';
	import Input from '@/lib/components/ui/input/input.svelte';
	import Button from '@/lib/components/ui/button/button.svelte';
	import { userStore } from '@/lib/stores/userStore.js';
	import { goto } from '$app/navigation';
	let { data } = $props();

	let error: string | null = $state('');

	const {
		form: formData,
		enhance,
		errors,
		message
	} = superForm(data.form, {
		validators: zod4Client(loginSchema),
		dataType: 'json',
		onSubmit({ jsonData }) {
			jsonData($formData);
		},
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				userStore.refreshUser().then(() => goto('/'));
			}
		}
	});
</script>

<div class="my-auto flex flex-col items-center justify-center gap-6 p-6 md:p-10">
	<div class="flex w-full max-w-sm flex-col gap-6">
		<div class="flex flex-col gap-6">
			<Card.Root>
				<Card.Header class="text-center">
					<Card.Title class="text-xl">Login</Card.Title>
				</Card.Header>
				<Card.Content>
					<form method="POST" use:enhance>
						<div class="grid gap-6">
							<div class="grid gap-6">
								<div class="grid gap-3">
									<Label for="email">Email</Label>
									<Input
										id="email"
										type="email"
										bind:value={$formData.email}
										placeholder="acme@example.com"
										required
									/>
								</div>
								<div class="grid gap-3">
									<div class="flex items-center">
										<Label for="password">Password</Label>
									</div>
									<Input id="password" type="password" bind:value={$formData.password} required />
								</div>
								{#if $message}
									<p class="text-center text-sm text-red-500">{$message}</p>
								{/if}
								<Button type="submit" class="w-full cursor-pointer">Login</Button>
							</div>
						</div>
					</form>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
