<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	// Store for the current foreground note
	const foreground = writable({ id: '', zIndex: 0 });
</script>
<script lang="ts">
	import debounce from 'lodash/debounce';
	import { onMount, tick } from 'svelte';
	import { draggable } from '@neodrag/svelte';
	import { GripHorizontalIcon, MaximizeIcon, MinimizeIcon, XIcon } from 'lucide-svelte';
	import type { EventElements, TNote } from '$lib/types';
	import ColorPicker from './color-picker.svelte';
	import Action from './action.svelte';

	//TODO: add callbacks for updates to prevent unnecessary data fetching

	// Vars
	let textarea: HTMLTextAreaElement;
	let invisible = true; // Hide note until it's mounted. This avoids jumpy notes
	let noteWidth: number;
	let noteHeight: number;

	// Props
	export let note: TNote;
	export let parentWidth: number;
	export let parentHeight: number;

	// Computed
	$:rows = note.isMinimized ? 1 : 8;
	$: x = note.x * parentWidth;
	$: y = note.y * parentHeight;
	$: {
		if (x && noteWidth) {
			if (x < 0) x = 10;
			else if (x + noteWidth > parentWidth) x = parentWidth - noteWidth - 10;
		}
		if (y && noteHeight) {
			if (y < 0) y = 10;
			else if (y + noteHeight > parentHeight) y = parentHeight - noteHeight - 10;
		}
	}

	// Methods
	async function minmax() {
		note.isMinimized = !note.isMinimized;

		await fetch(`/api/notes/${note.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ isMinimized: note.isMinimized })
		});
	}

	async function move({ offsetX, offsetY }: { offsetX: number, offsetY: number }) {
		const x = offsetX / parentWidth;
		const y = offsetY / parentHeight;

		// Update note
		note.x = x;
		note.y = y;

		await fetch(`/api/notes/${note.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ x, y })
		});
	}

	async function raise() {
		if(note.id === $foreground.id) return;

		const zIndex = $foreground.zIndex + 1;
		note.zIndex = zIndex;

		// Update foreground store
		$foreground = { id: note.id, zIndex };

		// Update database
		await fetch(`/api/notes/${note.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ zIndex })
		});
	}

	async function colorize(event: CustomEvent<{ color: string }>) {
		const color = event.detail.color;
		note.color = color;

		await fetch(`/api/notes/${note.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ color })
		});
	}

	async function setContent(event: EventElements<HTMLTextAreaElement>) {
		const content = event.currentTarget.value;
		note.content = content;

		await fetch(`/api/notes/${note.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ content })
		});
	}

	// Lifecycle
	onMount(() => {
		// Show note after mounting
		invisible = false;

		// Find the foreground note (runs once, for each note)
		foreground.update(prev => {
			if (note.zIndex < prev.zIndex) return prev;
			return { id: note.id, zIndex: note.zIndex };
		});
	});
</script>
<style>
    /* Note container */
    .note {
        @apply absolute flex flex-col w-64 p-2 space-y-3 rounded-lg shadow text-black/75;
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

<div role="button" tabindex="0" class="note" class:invisible
		 style:z-index={note.zIndex} style:background-color={note.color}
		 bind:clientHeight={noteHeight} bind:clientWidth={noteWidth}
		 on:mousedown={raise}
		 use:draggable={{
				bounds: 'parent',
				position: {x,y},
				onDragEnd: move,
				handle: '.handle'
		 }}
>
	<!-- Action bar -->
	<div class="actionbar">
		<div>
			<ColorPicker on:select={colorize} />
		</div>
		<div>
			<button title="Drag & Drop" class="handle active:cursor-move cursor-grab">
				<GripHorizontalIcon size="20" />
			</button>
		</div>
		<div class="flex items-center">
			<button title={note.isMinimized ? 'Maximize' : 'Minimize'} on:click|preventDefault={minmax}>
				{#if note.isMinimized}
					<MaximizeIcon size="16" />
				{:else}
					<MinimizeIcon size="16" />
				{/if}
			</button>
			<Action id={note.id} action="delete">
				<button title="Delete">
					<XIcon size="19" />
				</button>
			</Action>
		</div>
	</div>

	<!-- Content -->
	{#if note.isMinimized}
		<button title="Maximize" class="text-left truncate w-full" on:click={async () => {
			await minmax();
			await tick();
			textarea.focus();
		}}>
			{note?.content ?? ""}
		</button>
	{:else}
	<textarea
		bind:this={textarea}
		value={note.content}
		on:input={debounce(setContent, 500)}
		rows={rows}
		placeholder="Type something..."
		class="grow resize-none outline-none bg-transparent leading-tight placeholder-black/25"
	/>
	{/if}
</div>