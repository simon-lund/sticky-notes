<script>
	import { signOut } from '@auth/sveltekit/client';
	import { LogOutIcon } from 'lucide-svelte';
</script>

<slot />

<div class="absolute top-2 right-2">
		<button class="btn" on:click={() => signOut()}>
			<LogOutIcon size="20" />
			Sign out
		</button>
</div>
