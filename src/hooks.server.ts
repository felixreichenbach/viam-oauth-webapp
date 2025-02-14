import type { Handle } from '@sveltejs/kit';
import { MemoryStore, sveltekitSessionHandle } from 'svelte-kit-sessions';

// You can do it like this, without passing a own handle function
// Docs: https://svelte.dev/docs/kit/hooks#Server-hooks-handle

declare module 'svelte-kit-sessions' {
	interface SessionData {
		stateValue?: string;
		user?: string;
		verifier?: string;
		accessToken?: string;
	}
}

export const handle: Handle = sveltekitSessionHandle({
	secret: 'secret',
	store: new MemoryStore() // other compatible stores are available
});
