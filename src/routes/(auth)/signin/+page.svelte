<script>
	import { GithubIcon } from 'lucide-svelte';
	import { signIn } from '@auth/sveltekit/client';
</script>

<style>
    .btn-login {
        @apply flex gap-2 items-center font-bold px-4 py-2 bg-amber-200 rounded-lg shadow-md;
    }
</style>

<div class="flex flex-col h-screen w-screen">
	<div class="grow flex flex-col gap-6 items-center justify-center pb-48">
		<div>
			<span class="block text-center font-bold text-4xl">
				Welcome to
			</span>
			<h1 class="text-center font-bold text-6xl">Sticky Notes</h1>
		</div>
		<button class="btn-login" on:click={() => signIn('github', {callbackUrl: '/'})}>
			<GithubIcon size="30" />
			Login with GitHub
		</button>
	</div>
	<footer class="flex bg-amber-200 p-4 items-center justify-center">
		<p class="text-sm">
			Made with ❤️ by <a href="https://simon-lund.github.io" class="underline">Simon Lund</a>
		</p>
	</footer>
</div>