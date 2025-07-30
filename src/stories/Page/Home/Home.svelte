<!-- <script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import Header from '../../Block/Header/Header.svelte';
	import './home.css';
	import Footer from '@/stories/Block/Footer/Footer.svelte';

	import Profile from '../../assets/profile.jpg';
	import Button from '@/lib/components/ui/button/button.svelte';
	import BlogCard from '@/lib/components/BlogCard.svelte';
	import Docs from '../../assets/docs.png';
	import Typewriter from '@/lib/components/Typewriter.svelte';

	const date = new Date('2022-08-18');
</script>

<ModeWatcher />
<article class="flex min-h-screen flex-col">
	<Header />

	<section class="mx-auto max-w-2xl flex-1 px-5 py-12 leading-6">
		<div class="flex flex-col gap-4">
			<h2
				style="font-family: 'Futura', sans-serif;"
				class="mb-4 inline-block h-full w-full text-center align-top text-4xl leading-1 font-semibold md:text-5xl dark:text-white"
			>
				Your name
			</h2>
			<Typewriter text="Front-end Developer | Biotechnologist" speed={80} loop={false} />
			<img src={Profile} class="mx-auto my-4 h-48 w-48 rounded-full" />
			<p class="text-center">Hey! I'm Jim, a founder and software engineer based on Greece.</p>
			<p class="text-center">
				Currently building MagicPattern and Brandbird. In the past decade, I've spent time as a
				design and software engineering contractor.
			</p>
			<p class="my-4">
				I'm passionate about <Button variant="link" size="xs" class="font-bold">blogging</Button>.
			</p>
		</div>
		<div class="mt-8">
			<h1 class="mb-6 text-center text-4xl font-bold">More Popular Posts</h1>
			<div class="flex flex-col items-center gap-6">
				<div class="flex flex-col gap-4 md:grid md:grid-cols-2">
					<BlogCard
						publishDate={date}
						imageSource={Docs}
						imageAlt="test"
						title="Build a Landing Page with Chakra UI"
						link="/posts/morning-hikes"
						tags={['storybook', 'ui', 'guide']}
					/>
					<BlogCard
						publishDate={date}
						imageSource={Docs}
						imageAlt="test"
						title="Build a Landing Page with Chakra UI"
						link="/posts/morning-hikes"
						tags={['storybook', 'ui', 'guide']}
					/>
				</div>
				<Button variant="secondary">Read more ></Button>
			</div>
		</div>
	</section>
	<Footer />
</article> -->
