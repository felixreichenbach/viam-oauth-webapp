import type { Session } from 'svelte-kit-cookie-session';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			user?: any;
			clientId?: string;
			challenge?: string;
			stateValue?: string;
			fusionAuthURL: string;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
