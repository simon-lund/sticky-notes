import { StatusCodes } from 'http-status-codes';
import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/database';
import { getSession } from '$lib/utils';

export const PATCH: RequestHandler = async (event) => {
	const session = await getSession(event);

	const data = await event.request.json();

	// Validate the data
	// TODO: validate the data for better security and DX

	const note = await prisma.note.update({
		omit: {
			userId: true // Omit the userId from the response
		},
		where: {
			id: event.params.id,
			userId: session.user.id // Ensure the note belongs to the user
		},
		data
	});

	return json(note);
};

export const DELETE: RequestHandler = async (event) => {
	const session = await getSession(event);

	await prisma.note.delete({
		where: {
			id: event.params.id,
			userId: session.user.id // Ensure the note belongs to the user
		}
	});

	return new Response(null, { status: StatusCodes.NO_CONTENT });
};