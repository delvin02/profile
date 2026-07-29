<script lang="ts">
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import Menu from '@lucide/svelte/icons/menu';
	import Newspaper from '@lucide/svelte/icons/newspaper';
	import FileText from '@lucide/svelte/icons/file-text';
	import Settings from '@lucide/svelte/icons/settings';
	import LogOut from '@lucide/svelte/icons/log-out';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '@/lib/components/ui/button/index.js';
	import { Separator } from '@/lib/components/ui/separator/index.js';
	import {
		Sheet,
		SheetContent,
		SheetHeader,
		SheetTitle,
		SheetOverlay,
		SheetTrigger
	} from '@/lib/components/ui/sheet/index.js';
	import { userStore } from '$lib/stores/userStore';

	const { user, isLoggedIn } = userStore;

	let isOpen = $state(false);
	function closeMenu() {
		isOpen = false;
	}
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
					<Sheet bind:open={isOpen}>
						<SheetTrigger>
							<Button variant="ghost" size="icon" aria-label="Open menu">
								<Menu
									class="stroke-primary h-5 w-5 scale-100 rotate-0 transition-all dark:stroke-white"
								/>
							</Button>
						</SheetTrigger>

						<SheetOverlay class="bg-black/20 backdrop-blur-[1px]" />

						<SheetContent
							side="right"
							class="bg-background/95 flex h-full w-4/5 max-w-xs flex-col gap-0 backdrop-blur"
						>
							<SheetHeader class="border-b px-5 py-4">
								<SheetTitle class="text-base">Menu</SheetTitle>
							</SheetHeader>

							<nav class="flex flex-1 flex-col justify-between overflow-y-auto px-3 py-4">
								<div class="flex flex-col gap-1">
									<p
										class="text-muted-foreground px-2 pb-1 text-xs font-semibold tracking-wide uppercase"
									>
										Navigate
									</p>
									<a
										href="/blog"
										onclick={closeMenu}
										class="hover:bg-accent flex items-center gap-3 rounded-md px-2 py-2.5 text-base font-medium transition-colors"
									>
										<Newspaper class="text-muted-foreground size-4" />
										Blog
									</a>
									{#if $user.resumeUrl}
										<a
											onclick={closeMenu}
											href={$user.resumeUrl}
											class="hover:bg-accent flex items-center gap-3 rounded-md px-2 py-2.5 text-base font-medium transition-colors"
										>
											<FileText class="text-muted-foreground size-4" />
											Resume
										</a>
									{/if}
								</div>

								{#if $user && $isLoggedIn}
									<div class="flex flex-col gap-2 border-t pt-4">
										<p
											class="text-muted-foreground px-2 pb-1 text-xs font-semibold tracking-wide uppercase"
										>
											Account
										</p>
										<Button
											variant="ghost"
											onclick={closeMenu}
											href="/settings"
											class="w-full cursor-pointer justify-start gap-3 px-2"
										>
											<Settings class="size-4" />
											Settings
										</Button>
										<form method="POST" action="/logout">
											<Button
												variant="ghost"
												onclick={closeMenu}
												class="text-destructive hover:text-destructive w-full cursor-pointer justify-start gap-3 px-2"
												type="submit"
											>
												<LogOut class="size-4" />
												Logout
											</Button>
										</form>
									</div>
								{/if}
							</nav>
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
