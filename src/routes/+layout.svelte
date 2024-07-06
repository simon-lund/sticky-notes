<script>
	import '../app.css';
	import Pinboard from '$lib/components/pinboard.svelte';
	import { Toaster } from 'svelte-sonner';
</script>

<Toaster />
<Pinboard>
	<slot />
</Pinboard>