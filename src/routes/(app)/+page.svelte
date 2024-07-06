<script lang="ts">
	import '@xyflow/svelte/dist/style.css';
	import { writable } from 'svelte/store';
	import {
		SvelteFlow,
		Background,
		BackgroundVariant,
		Controls,
		MiniMap,
		type Node,
		Panel,
		useSvelteFlow
	} from '@xyflow/svelte';
	import { transformToNodes } from '$lib/utils';
	import Note from '$lib/components/note.svelte';
	import debounce from 'lodash/debounce';
	import { signOut } from '@auth/sveltekit/client';
	import { LogOutIcon, PlusIcon } from 'lucide-svelte';
	import { COLORS } from '$lib/constants';

	const { screenToFlowPosition } = useSvelteFlow();

	// Props
	export let data;

	// Stores
	const nodes = writable<Node[]>(transformToNodes(data.notes));
	const edges = writable([]); // we don't need edges, but it's required by the component

	// Vars
	let innerWidth = 0;
	let innerHeight = 0;

	// Functions
	async function nodedrag(event: CustomEvent<{ event: MouseEvent; targetNode: Node }>) {
		const node = event.detail.targetNode;
		const id = node.id;
		const { x, y } = node.position;

		await fetch(`/api/notes/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ x, y })
		});
	}

	async function addNote() {
		const {x,y} = screenToFlowPosition({x: innerWidth / 2, y: innerHeight / 2 - 100});

		const data = {
			content: '',
			x,
			y,
			color: COLORS[Math.floor(Math.random() * COLORS.length)],
			isMinimized: false
		};

		const note = await fetch('/api/notes', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});

		const node = transformToNodes([await note.json()])[0];
		nodes.update(n => [...n, node]);
	}
</script>

<style>
    main {
        height: 100vh;
    }

    .panel {
        @apply flex gap-4;
    }

    button {
        @apply flex items-center gap-1 bg-amber-100 border-black shadow-md rounded-md p-2;
    }
</style>

<svelte:window bind:innerWidth bind:innerHeight />

<main>
	<SvelteFlow nodeTypes={{note: Note}} {nodes} {edges} on:nodedrag={debounce(nodedrag, 500)}>
		<Panel position="top-right" class="panel">
			<div class="panel">
				<button on:click={addNote}>
					<PlusIcon size="20" />
					Add note
				</button>
				<button on:click={() => signOut()}>
					<LogOutIcon size="18" />
					Sign out
				</button>
			</div>
		</Panel>
		<!-- TODO: style controls	-->
		<Controls />
		<MiniMap />
		<Background bgColor="#caa478" patternColor="black" variant={BackgroundVariant.Dots} />
	</SvelteFlow>
</main>