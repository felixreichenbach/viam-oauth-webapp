import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import pkceChallenge from 'pkce-challenge';

const fusionAuthURL = import.meta.env.VITE_FUSION_AUTH_URL;
const clientId = import.meta.env.VITE_FUSION_AUTH_CLIENT_ID;

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

	// Store the PKCE verifier in the session
	session.data.stateValue = stateValue;

	//generate the pkce challenge/verifier dict
	const pkce_pair = await pkceChallenge();
	// Store the PKCE verifier in session
	session.data.verifier = pkce_pair['code_verifier'];
	const challenge = pkce_pair['code_challenge'];

	const post = {
		user: session.data.user,
		clientId: clientId,
		challenge: challenge,
		stateValue: stateValue,
		fusionAuthURL: fusionAuthURL
	};
	if (post) {
		return post;
	}

	error(404, 'Not found');
};
