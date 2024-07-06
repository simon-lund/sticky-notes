<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	// Store for the current foreground note
	const foreground = writable({ id: '', zIndex: 0 });
</script>
<script lang="ts">
	// TODO: needs typing
	import { useSvelteFlow } from '@xyflow/svelte';
	import debounce from 'lodash/debounce';
	import { onMount, tick } from 'svelte';
	import { GripHorizontalIcon, MaximizeIcon, MinimizeIcon, XIcon } from 'lucide-svelte';
	import type { EventElements } from '$lib/types';
	import ColorPicker from '$lib/components/color-picker.svelte';

	const { deleteElements } = useSvelteFlow();

	// Props
	export let data;

	// Vars
	let textarea: HTMLTextAreaElement;
	let id: string = data.id;
	let zIndex: number = data.zIndex;
	let content: string = data.content;
	let color: string = data.color;
	let isMinimized: boolean = data.isMinimized;

	// Computed
	$: rows = isMinimized ? 1 : 8;

	// Functions
	async function minmax() {
		isMinimized = !isMinimized;

		await fetch(`/api/notes/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ isMinimized: isMinimized })
		});
	}

	// TODO: fix bug. sometimes other notes are raised which were not clicked
	async function raise() {
		if (id === $foreground.id) return;

		zIndex = $foreground.zIndex + 1;

		// Update foreground store
		$foreground = { id, zIndex };

		await fetch(`/api/notes/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ zIndex })
		});
	}

	async function colorize(event: CustomEvent<{ color: string }>) {
		color = event.detail.color;

		await fetch(`/api/notes/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ color })
		});
	}

	async function setContent(event: EventElements<HTMLTextAreaElement>) {
		content = event.target.value;

		await fetch(`/api/notes/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ content })
		});
	}

	async function deleteSelf() {
		// Remove the note from SvelteFlow
		await deleteElements({ nodes: [{ id }] });

		await fetch(`/api/notes/${id}`, {
			method: 'DELETE'
		});
	}

	// Lifecycle
	onMount(() => {
		// Find the foreground note (runs once, for each note)
		foreground.update(prev => {
			if (zIndex < prev.zIndex) return prev;
			return { id, zIndex };
		});
	});
</script>

<style>
    /* Note container */
    .note {
        @apply flex flex-col w-64 p-2 space-y-3 rounded-lg shadow text-black/75 cursor-default;
    }

    /* Action bar for the note */
    .actionbar {
        @apply grid grid-cols-3;
        @apply [&>*]:flex [&>*]:gap-2 [&>*]:items-center [&>*:nth-child(2)]:justify-center [&>*:nth-child(3)]:justify-end
    }

    /* Custom scrollbar for the textarea */
    textarea::-webkit-scrollbar {
        @apply w-1
    }

    textarea::-webkit-scrollbar-thumb {
        @apply bg-black/25 hover:bg-black rounded-full;
    }

    textarea::-webkit-scrollbar-track {
        @apply bg-transparent;
    }
</style>

<div role="button" tabindex="0" class="note" style:background-color={color} on:mousedown={raise}>
	<div class="actionbar">
		<div>
			<ColorPicker on:select={colorize} />
		</div>
		<div>
			<button title="Drag & Drop" class="drag-handle active:cursor-move cursor-grab">
				<GripHorizontalIcon size="20" />
			</button>
		</div>
		<div>
			<div class="flex items-center gap-1">
				<button title={isMinimized ? 'Maximize' : 'Minimize'} on:click|preventDefault={minmax}>
					{#if isMinimized}
						<MaximizeIcon size="16" />
					{:else}
						<MinimizeIcon size="16" />
					{/if}
				</button>
				<button title="Delete" on:click={deleteSelf}>
					<XIcon size="19" />
				</button>
			</div>
		</div>
	</div>
	<!-- Content -->
	{#if isMinimized}
		<button title="Maximize" class="text-left truncate w-full" on:click={async () => {
			await minmax();
			await tick();
			textarea.focus();
		}}>
			{content ?? ""}
		</button>
	{:else}
	<textarea
		bind:this={textarea}
		value={content}
		on:input={debounce(setContent, 500)}
		rows={rows}
		placeholder="Type something..."
		class="grow resize-none outline-none bg-transparent leading-tight placeholder-black/25"
	/>
	{/if}
</div>
