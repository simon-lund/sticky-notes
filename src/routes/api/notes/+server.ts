import { json, type RequestHandler } from '@sveltejs/kit';
import { getSession } from '$lib/utils';
import { prisma } from '$lib/server/database';

export const GET: RequestHandler = async (event) => {
	const session = await getSession(event);

	// Get the notes for the user
	const notes = await prisma.note.findMany({
		omit: {
			userId: true // Omit the userId from the response
		},
		where: {
			userId: session.user.id // Ensure the notes belong to the user
		}
	});

	return json(notes);
};


export const POST: RequestHandler = async (event) => {
	const session = await getSession(event);

	const data = await event.request.json();

	// Validate the data
	// TODO: validate the data for better security and DX

	// Create a new note
	const note = await prisma.note.create({
		data: {
			userId: session.user.id,
			content: data.content,
			x: data.x,
			y: data.y,
			color: data.color,
			isMinimized: data.isMinimized
		}
	});

	return json(note);
}