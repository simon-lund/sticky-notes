<script lang="ts">
	import { enhance } from '$app/forms';
	import Note from '$lib/components/note/note.svelte';
	import { PlusIcon } from 'lucide-svelte';

	// Window dimensions
	let w: number, h: number;

	export let data;
	$: notes = data.notes;
</script>
<style>
    .btn-floating {
        @apply absolute bottom-0 right-0 m-6 rounded-full;
    }
</style>

<svelte:window bind:innerWidth={w} bind:innerHeight={h} />
{#each notes as note (note.id)}
	<Note note={note} parentWidth={w} parentHeight={h} />
{/each}

<form method="POST" action="?/create" use:enhance>
	<button class="btn btn-floating" tabindex="0">
		<PlusIcon size="30" />
	</button>
</form>