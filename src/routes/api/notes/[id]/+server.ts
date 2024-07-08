import { StatusCodes } from 'http-status-codes';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/database';
import { getSession } from '$lib/utils';
import { Note } from '$lib/types';
import _ from 'lodash';

const isDefined = _.negate(_.isUndefined);

export const PATCH: RequestHandler = async (event) => {
	const session = await getSession(event);

	const data = await event.request.json();

	// Get all valid fields to prevent malicious data
	let note = {
		content: data?.content,
		x: data?.x,
		y: data?.y,
		zIndex: data?.zIndex,
		color: data?.color,
		isMinimized: data?.isMinimized
	};

	// Remove undefined values
	note = _.pickBy(note, isDefined);

	// Validate remaining fields
	try {
		for (const [key, value] of Object.entries(note)) {
			await Note.validateAt(key, value);
		}
	} catch {
		return error(StatusCodes.BAD_REQUEST, { message: 'Invalid data' });
	}

	note = await prisma.note.update({
		omit: {
			userId: true // Omit the userId from the response
		},
		where: {
			id: event.params.id,
			userId: session.user.id // Ensure the note belongs to the user
		},
		note
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