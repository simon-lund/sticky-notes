import { error, json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/database';
import { getSession } from '$lib/utils';
import { boolean } from 'yup';
import { COLORS } from '$lib/constants';
import { StatusCodes } from 'http-status-codes';
import { Note } from '$lib/types';

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

	// Get all valid fields to prevent malicious data
	let note = Note.cast({
		content: data.content ?? '',
		x: data.x ?? 0,
		y: data.y ?? 0,
		zIndex: data.zIndex ?? 0,
		color: data.color ?? COLORS[0],
		isMinimized: data.isMinimized ?? false
	});

	try {
		await Note.validate(note);
	} catch (e) {
		error(StatusCodes.BAD_REQUEST, { message: 'Invalid note data'});
	}

	// Create a new note
	// TODO: remove type error
	note = await prisma.note.create({
		data: {
			userId: session.user.id,
			...note
		}
	});

	return json(note);
}