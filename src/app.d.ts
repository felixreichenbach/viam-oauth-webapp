import type { Session } from 'svelte-kit-cookie-session';

// Cookie session docs: https://www.npmjs.com/package/svelte-kit-cookie-session
type SessionData = {
	user?: any;
	clientId?: string;
	challenge?: string;
	stateValue?: string;
	fusionAuthURL?: string;
	verifier?: string;
	accessToken?: string;
};

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: Session<SessionData>;
		}
		interface PageData {
			session: SessionData;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
