<script lang="ts">
	import Button from '@/lib/components/ui/button/button.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { userSettingsSchema } from './schema';
	import Label from '@/lib/components/ui/label/label.svelte';
	import FileInputPlaceholder from '@/lib/components/FileInputPlaceholder.svelte';
	import { Upload } from '@lucide/svelte';
	import { userStore } from '@/lib/stores/userStore';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import ThemeSelector from '@/lib/components/ThemeSelector.svelte';
	import { themeStore } from '@/lib/stores/themeStore';
	import Separator from '@/lib/components/ui/separator/separator.svelte';

	let { data } = $props();

	const {
		form: formData,
		enhance,
		message,
		errors,
		constraints
	} = superForm(data.form, {
		validators: zod4Client(userSettingsSchema),
		dataType: 'json',
		onSubmit({ jsonData }) {
			jsonData($formData);
		},
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				toast.success('Profile updated');
				themeStore.set($formData.theme);
				userStore.refreshUser().then(() => goto('/'));
			}
		}
	});
</script>

<section class="mx-auto w-2xl max-w-2xl flex-1 px-5 py-12 leading-6">
	<div class="flex flex-col gap-4">
		<h2
			class="mb-4 inline-block h-full w-full text-left align-top text-4xl leading-1 font-semibold md:text-5xl dark:text-white"
		>
			Settings
		</h2>
		<form method="POST" use:enhance>
			<div class="mt-4 flex flex-col gap-4">
				<div>
					<Label for="title">LinkedIn URL</Label>
					<input
						class="text-muted-foreground border-primary/80 mt-1 w-full border-b border-dashed text-left text-xl lg:text-2xl"
						bind:value={$formData.linkedInUrl}
						name="linkedInUrl"
						placeholder="https://www.linkedin.com/in/..."
						{...$constraints.linkedInUrl}
					/>
				</div>
				<div>
					<Label for="title">Resume Attachment</Label>
					<FileInputPlaceholder
						icon={Upload}
						title="Click to upload or drag and drop"
						onChange={(url) => {
							$formData.resumeUrl = url;
						}}
						fileUrl={$formData.resumeUrl}
					/>
				</div>

				<div>
					<Label for="title">Theme</Label>
					<ThemeSelector
						onThemeChange={(theme) => {
							$formData.theme = theme;
							themeStore.set(theme);
						}}
						themes={data.themes}
						selectedTheme={$formData.theme}
					/>
				</div>
			</div>
			<Separator />
			<div class="mt-2 flex">
				<Button type="submit" class="ml-auto cursor-pointer">Update</Button>
			</div>
		</form>
	</div>
</section>
