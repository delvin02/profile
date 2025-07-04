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
</script>

<header>
	<div class="flex items-center justify-between bg-white px-5 py-4 dark:bg-gray-900">
		<h1><a href="/">ENG WEI THENG</a></h1>
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
								<a href="/work" class="rounded px-2 py-1 text-2xl font-medium transition-all"
									>Work</a
								>
								<a href="/blog" class="rounded px-2 py-1 text-2xl font-medium transition-all"
									>Blog</a
								>
								<a href="/blog" class="rounded px-2 py-1 text-2xl font-medium transition-all"
									>Resume</a
								>
							</div>
						</SheetContent>
					</Sheet>
				</div>

				<!-- DESKTOP: Inline nav + theme toggle -->
				<div class="hidden items-center gap-4 md:flex">
					<Button size="sm" variant="ghost" href="/work">Work</Button>
					<Button size="sm" variant="ghost" href="/blog">Blog</Button>
					<Button size="sm" variant="ghost" href="/resume">Resume</Button>

					<Button
						onclick={toggleMode}
						variant="outline"
						size="icon"
						aria-label="Toggle theme"
						class="relative"
					>
						<SunIcon
							class="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
						/>
						<MoonIcon
							class="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
						/>
					</Button>
				</div>
			</nav>
		</div>
	</div>
	<Separator />
</header>
