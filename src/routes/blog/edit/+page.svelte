<script lang="ts">
	import Button from '@/lib/components/ui/button/button.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { blogPageEditSchema } from './schema';
	import Label from '@/lib/components/ui/label/label.svelte';

	let { data } = $props();

	const {
		form: formData,
		enhance,
		message,
		errors,
		constraints
	} = superForm(data.form, {
		validators: zod4Client(blogPageEditSchema),
		dataType: 'json',
		onSubmit({ jsonData }) {
			jsonData($formData);
		}
	});
</script>

<section class="mx-auto w-2xl max-w-2xl flex-1 px-5 py-12 leading-6">
	<div class="flex flex-col gap-4">
		<h2
			class="mb-4 inline-block h-full w-full text-center align-top text-4xl leading-1 font-semibold break-normal md:text-5xl dark:text-white"
		>
			Blogs
		</h2>
		<form method="POST" use:enhance>
			<Label for="title">Blog Headline</Label>
			<input
				class="text-muted-foreground border-primary/80 my-0 w-full border-b border-dashed text-center text-xl italic lg:text-2xl"
				bind:value={$formData.blogHeadline}
				name="Blog Headline"
				placeholder="Enter blog headline"
				{...$constraints.blogHeadline}
			/>

			<div class="mt-2 flex">
				<Button type="submit" class="ml-auto">Update</Button>
			</div>
		</form>
	</div>
</section>
