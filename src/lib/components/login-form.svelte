<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();

	const id = $props.id();

	let email = $state('');
	let password = $state('');
	let error: string | null = $state(null);

	async function handleLogin(event: SubmitEvent) {
		event.preventDefault();
		error = null;

		const res = await fetch('/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		});

		if (res.ok) {
			window.location.href = '/';
		} else {
			error = 'Invalid credentials';
		}
	}
</script>

<div class={cn('flex flex-col gap-6', className)} {...restProps}>
	<Card.Root>
		<Card.Header class="text-center">
			<Card.Title class="text-xl">Login</Card.Title>
		</Card.Header>
		<Card.Content>
			<form onsubmit={handleLogin}>
				<div class="grid gap-6">
					<div class="grid gap-6">
						<div class="grid gap-3">
							<Label for="email-{id}">Email</Label>
							<Input
								id="email-{id}"
								type="email"
								bind:value={email}
								placeholder="acme@example.com"
								required
							/>
						</div>
						<div class="grid gap-3">
							<div class="flex items-center">
								<Label for="password-{id}">Password</Label>
							</div>
							<Input id="password-{id}" type="password" bind:value={password} required />
						</div>
						{#if error}
							<p class="text-center text-sm text-red-500">{error}</p>
						{/if}
						<Button type="submit" class="w-full">Login</Button>
					</div>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
