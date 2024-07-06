import { type DefaultSession, SvelteKitAuth } from '@auth/sveltekit';
import { PrismaAdapter } from "@auth/prisma-adapter"
import GitHub from "@auth/sveltekit/providers/github"
import Discord from "@auth/sveltekit/providers/discord"
import { prisma } from '$lib/server/database';


declare module "@auth/sveltekit" {
	interface Session {
		user: {
			id: string
			/**
			 * By default, TypeScript merges new interface properties and overwrites existing ones.
			 * In this case, the default session user properties will be overwritten,
			 * with the new ones defined above. To keep the default session user properties,
			 * you need to add them back into the newly declared interface.
			 */
		} & DefaultSession["user"]
	}
}


export const { handle, signIn, signOut } = SvelteKitAuth({
	adapter: PrismaAdapter(prisma),
	trustHost: true,
	providers: [GitHub, Discord],
	callbacks: {
		session({ session }) {
			// Return the session object from the database as-is
			return session
		}
	},
	pages: {
		signIn: '/signin',
	}
})