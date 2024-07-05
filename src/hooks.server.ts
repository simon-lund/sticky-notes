import { redirect, type Handle } from '@sveltejs/kit';
import { handle as authenticationHandle } from '$lib/server/auth';
import { sequence } from '@sveltejs/kit/hooks';

const authorizationHandle: Handle = async ({ event, resolve }) => {
	console.log('path', event.url.pathname);

	// Allow /signin to be accessed by anyone
	// If we don't do this, we'll end up in an infinite redirect loop
	if (event.url.pathname === '/signin') {
		return resolve(event);
	}

	// Protect any routes under
	if (event.url.pathname.startsWith('/')) {
		const session = await event.locals.auth();
		if (!session) {
			// Redirect to the signin page
			throw redirect(303, '/signin');
		}
	}

	// If the request is still here, just proceed as normally
	return resolve(event);
};

// First handle authentication, then authorization
// Each function acts as a middleware, receiving the request handle
// And returning a handle which gets passed to the next function
export const handle: Handle = sequence(authenticationHandle, authorizationHandle)