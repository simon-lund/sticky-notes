<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	import { signIn } from '@auth/sveltekit/client';

	onMount(() => {
		if ($page.url.searchParams.get('error') === 'OAuthAccountNotLinked') {
			toast.error('Please use the provider originally used to sign up', { position: 'top-center' });
		}
	});
</script>

<style>
    .btn-login {
        @apply flex gap-2 items-center font-bold px-4 py-2 bg-amber-200 rounded-lg shadow-md;
    		@apply transition-transform duration-200 ease-in-out active:scale-95;
		}
</style>

<main class="grow flex flex-col gap-6 items-center justify-center pb-48">
	<div>
			<span class="block text-center font-bold text-xl sm:text-4xl">
				Welcome to
			</span>
		<h1 class="text-center font-bold text-4xl sm:text-6xl">Sticky Notes</h1>
	</div>
	<div class="flex flex-col sm:flex-row gap-4">
		<button class="btn-login" on:click={() => signIn('github', {callbackUrl: '/'})}>
			<img src="/github-mark.svg" alt="GitHub Logo" class="w-6 h-6" />
			Login with GitHub
		</button>
		<button class="btn-login" on:click={() => signIn('discord', {callbackUrl: '/'})}>
			<img src="/discord-mark.svg" alt="Discord Logo" class="w-6 h-6" />
			Login with Discord
		</button>
	</div>
</main>

<footer class="flex bg-amber-200 p-4 items-center justify-center">
	<p class="text-sm">
		Made with ❤️ by <a href="https://simon-lund.github.io" class="underline">Simon Lund</a>
	</p>
</footer>
