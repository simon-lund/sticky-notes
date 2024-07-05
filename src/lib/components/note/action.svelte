<script lang="ts">
	import { enhance } from '$app/forms';
	import type { TNote } from '$lib/types';
	import _ from 'lodash';

	export let id: string;
	export let action: 'update' | 'delete';
	export let form: HTMLFormElement | null = null;
	export let data: Partial<Pick<TNote, 'color' | 'isMinimized'>> = {};

	// Validate inputs
	switch (action) {
		case 'update':
			if (_.isEmpty(data))
				throw new Error(`Data should be passed for 'update' action`);
			break;
		case 'delete':
			if (!_.isEmpty(data)) throw new Error(`Data should not be passed for 'delete' action`);
			break;
		default:
			throw new Error(`Invalid action: ${action}`);
	}
</script>

<form bind:this={form} on:submit method="POST" action="?/{action}" class="flex items-center" use:enhance>
	<input type="hidden" name="id" value={id} />
	{#if data}
		{#each Object.keys(data) as key}
			<input type="hidden" name={key} value={data[key]} />
		{/each}
	{/if}
	<slot />
</form>