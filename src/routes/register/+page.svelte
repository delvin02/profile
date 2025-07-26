<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Card from '$lib/components/ui/card/index.js';
	import Label from '@/lib/components/ui/label/label.svelte';
	import Input from '@/lib/components/ui/input/input.svelte';
	import Button from '@/lib/components/ui/button/button.svelte';
	import { registrationSchema } from './schema.js';

	let { data } = $props();

	let confirmPassword: string = $state('');
	let error: string | null = $state(null);

	const { form: formData, enhance } = superForm(data.form, {
		validators: zod4Client(registrationSchema),
		dataType: 'json',
		onSubmit({ jsonData }) {
			if ($formData.password !== confirmPassword) {
				error = "Passwords don't match";
				return;
			}
			jsonData($formData);
		}
	});
</script>

<div class="my-auto flex flex-col items-center justify-center gap-6 p-6 md:p-10">
	<div class="flex w-full max-w-sm flex-col gap-6">
		<div class="flex flex-col gap-6">
			<Card.Root>
				<Card.Header class="text-center">
					<Card.Title class="text-xl">Register</Card.Title>
				</Card.Header>
				<Card.Content>
					<form method="POST" use:enhance>
						<div class="grid gap-6">
							<div class="grid gap-6">
								<div class="grid gap-3">
									<Label for="name">Sub domain</Label>
									<Input
										id="subdomain"
										type="subdomain"
										bind:value={$formData.subdomain}
										placeholder="wei-theng-eng"
										required
									/>
								</div>
								<div class="grid gap-3">
									<Label for="name">Name</Label>
									<Input
										id="name"
										type="name"
										bind:value={$formData.name}
										placeholder="Wei Theng Eng"
										required
									/>
								</div>
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
								<div class="grid gap-3">
									<div class="flex items-center">
										<Label for="password">Confirm Password</Label>
									</div>
									<Input
										id="confirm-password"
										type="password"
										bind:value={confirmPassword}
										required
									/>
								</div>
								{#if error}
									<p class="text-center text-sm text-red-500">{error}</p>
								{/if}
								<Button type="submit" class="w-full cursor-pointer">Register</Button>
							</div>
						</div>
					</form>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
