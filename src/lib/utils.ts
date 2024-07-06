import { error, type RequestEvent } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { type TNote } from '$lib/types';
import {type Node} from '@xyflow/svelte';


/**
 * Get the session from the event.
 * @param event
 * @returns session
 * @throws Error if the session is not found or the user ID is not found in the session
 */
export async function getSession(event: RequestEvent) {
	const session = await event.locals.auth();

	if (!session) error(StatusCodes.UNAUTHORIZED, "Unauthorized. Please log in.");
	if (!session?.user?.id) error(StatusCodes.INTERNAL_SERVER_ERROR, "User ID not found in session.");

	return session;
}

/**
 * Transform notes to svelteflow nodes.
 * @param data - notes
 */
export function transformToNodes(data: TNote[]): Node[] {
	return data.map((note) => ({
		id: note.id,
		position: {
			x: note.x,
			y: note.y
		},
		type: 'note',
		dragHandle: '.drag-handle',
		data: {
			id: note.id,
			zIndex: note.zIndex,
			content: note.content,
			color: note.color,
			isMinimized: note.isMinimized
		}
	}));
}