import { error, type RequestEvent } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';


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