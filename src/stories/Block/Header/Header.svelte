<script lang="ts">
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import Menu from '@lucide/svelte/icons/menu';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '@/lib/components/ui/button/index.js';
	import { Separator } from '@/lib/components/ui/separator/index.js';
	import {
		Sheet,
		SheetContent,
		SheetOverlay,
		SheetTrigger
	} from '@/lib/components/ui/sheet/index.js';
	import { userStore } from '$lib/stores/userStore';

	const { user, isLoggedIn } = userStore;
</script>

<header>
	<div class="flex items-center justify-between bg-white px-5 py-4 dark:bg-gray-900">
		<h1 class="text-2xl"><a href="/">{$user.name.toUpperCase()}</a></h1>
		<div class="flex flex-row gap-4">
			<nav class="flex items-center justify-between">
				<div class="md:hidden">
					<Button
						onclick={toggleMode}
						variant="outline"
						size="icon"
						class="self-start"
						aria-label="Toggle theme"
					>
						<SunIcon
							class="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
						/>
						<MoonIcon
							class="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
						/>
					</Button>
					<Sheet>
						<SheetTrigger>
							<Button variant="ghost" size="icon" aria-label="Open menu">
								<Menu
									class="stroke-primary h-5 w-5 scale-100 rotate-0 transition-all dark:stroke-white "
								/>
							</Button>
						</SheetTrigger>

						<SheetOverlay class="bg-transparent" />

						<SheetContent
							side="right"
							class="flex h-full w-1/2 items-center justify-center bg-white/90 dark:bg-gray-800/90"
						>
							<div class="mt-4 flex flex-col gap-3 space-y-2">
								<a href="/blog" class="rounded px-2 py-1 text-2xl font-medium transition-all"
									>Blog</a
								>
								{#if $user.resumeUrl}
									<a
										href={$user.resumeUrl}
										class="rounded px-2 py-1 text-2xl font-medium transition-all">Resume</a
									>
								{/if}
							</div>
							{#if $user && $isLoggedIn}
								<div class="flex flex-col justify-start gap-4">
									<Button variant="default" class="w-full cursor-pointer" href="/settings"
										>Settings</Button
									>
									<form method="POST" action="/logout">
										<Button variant="destructive" class="w-full cursor-pointer" type="submit"
											>Logout</Button
										>
									</form>
								</div>
							{/if}
						</SheetContent>
					</Sheet>
				</div>

				<!-- DESKTOP: Inline nav + theme toggle -->
				<div class="hidden items-center gap-4 md:flex">
					<Button size="sm" variant="ghost" href="/blog">Blog</Button>
					{#if $user.resumeUrl}
						<Button size="sm" variant="ghost" href={$user.resumeUrl}>Resume</Button>
					{/if}
					<Button
						onclick={toggleMode}
						variant="outline"
						size="icon"
						aria-label="Toggle theme"
						class="relative cursor-pointer"
					>
						<SunIcon
							class="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
						/>
						<MoonIcon
							class="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
						/>
					</Button>

					{#if $user && $isLoggedIn}
						<Button variant="default" class="cursor-pointer" href="/settings">Settings</Button>
						<form method="POST" action="/logout">
							<Button variant="destructive" type="submit" class="cursor-pointer">Logout</Button>
						</form>
					{/if}
				</div>
			</nav>
		</div>
	</div>
	<Separator />
</header>
