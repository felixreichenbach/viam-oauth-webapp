import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import pkceChallenge from 'pkce-challenge';

const fusionAuthBaseURL = import.meta.env.VITE_FUSION_AUTH_URL;
const clientId = import.meta.env.VITE_FUSION_AUTH_CLIENT_ID;

/*
Maybe not needed if set in the load function
export const actions = {
	default: async ({ locals }) => {
		//const { user, fusionAuthURL = fusionAuthBaseURL } = locals.session.data;

		await locals.session.set({ fusionAuthURL: fusionAuthBaseURL, clientId: clientId });

		return {};
	}
};
*/

export const load: PageServerLoad = async (event) => {
	console.log(event);
	const { session } = event.locals;
	// FusionAuth Code
	const stateValue =
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15);

	//generate the pkce challenge/verifier dict
	const pkce_pair = await pkceChallenge();
	// Store the PKCE verifier in session
	const challenge = pkce_pair['code_challenge'];

	// Set the session cookie
	session.set({
		stateValue: stateValue,
		verifier: pkce_pair['code_verifier'],
		fusionAuthURL: fusionAuthBaseURL,
		clientId: clientId,
		challenge: challenge
	});

	const post = {
		session: session.data
	};
	if (post) {
		return post;
	}

	error(404, 'Not found');
};
