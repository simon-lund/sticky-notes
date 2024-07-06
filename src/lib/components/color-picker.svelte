<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { PaintbrushIcon } from 'lucide-svelte';
	import { clickOutside } from '$lib/actions/click-outside.js';
	import { COLORS } from '$lib/constants';

	const dispatch = createEventDispatcher();
	// TODO: add focus trap to prevent tabbing out and be able to cycle through colors (close with esc w/o change or enter -> apply color)
	let open = false;
</script>

<style>
    .color {
        @apply w-8 h-8 rounded-lg hover:border-2 border-black/75 cursor-pointer;
    }

    .tooltip {
        @apply absolute -bottom-10 -left-0;
        @apply inline-flex gap-2 p-2 bg-white rounded-lg shadow-md;
    }
</style>

<div class="relative inline-block" use:clickOutside on:clickOutside={() => open = false}>
	<button on:click={() => open = !open} title="Change color">
		<PaintbrushIcon size="20" />
	</button>

	{#if open}
		<div class="tooltip">
			{#each COLORS as color}
				<button
					class="color" style="background-color: {color}"
					on:click={() => {
						dispatch('select', {color});
						open = false;
					}}
				/>
			{/each}
		</div>
	{/if}
</div>