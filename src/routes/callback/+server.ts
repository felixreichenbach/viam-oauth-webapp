import type { RequestHandler } from '@sveltejs/kit';
import { FusionAuthClient } from '@fusionauth/typescript-client';

const FUSION_AUTH_BASE_URL = import.meta.env.VITE_FUSION_AUTH_URL;
const FUSION_AUTH_CLIENT_ID = import.meta.env.VITE_FUSION_AUTH_CLIENT_ID;
const FUSION_AUTH_CLIENT_SECRET = import.meta.env.VITE_FUSION_AUTH_CLIENT_SECRET;

export const GET: RequestHandler = async (event) => {
	const code = event.url.searchParams.get('code');
	if (!code) {
		return new Response('Missing code', { status: 400 });
	}

	const client = new FusionAuthClient('noapikeyneeded', FUSION_AUTH_BASE_URL);
	try {
		const response = await client.exchangeOAuthCodeForAccessToken(
			code,
			FUSION_AUTH_CLIENT_ID,
			FUSION_AUTH_CLIENT_SECRET,
			'http://localhost:5173/callback'
		);

		const accessToken = response.response.access_token;
		if (!accessToken) {
			return new Response('Failed to retrieve access token', { status: 500 });
		}
		// Store the access token in the session
		//locals.session.data.accessToken = accessToken;

		// Redirect to the home page with the access token
		return new Response(null, {
			status: 302,
			headers: {
				location: `/?access_token=${accessToken}`
			}
		});
	} catch (err) {
		console.error(err);
		return new Response('Error exchanging OAuth code for access token', { status: 500 });
	}
};
