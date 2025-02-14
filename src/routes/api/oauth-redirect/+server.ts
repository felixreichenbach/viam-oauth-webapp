import type { RequestHandler } from '@sveltejs/kit';
import { FusionAuthClient } from '@fusionauth/typescript-client';

const FUSION_AUTH_BASE_URL = import.meta.env.VITE_FUSION_AUTH_URL;
const FUSION_AUTH_CLIENT_ID = import.meta.env.VITE_FUSION_AUTH_CLIENT_ID;
const FUSION_AUTH_CLIENT_SECRET = import.meta.env.VITE_FUSION_AUTH_CLIENT_SECRET;

const client = new FusionAuthClient('noapikeyneeded', FUSION_AUTH_BASE_URL);

export const GET: RequestHandler = async ({ url, locals }) => {
	const code = url.searchParams.get('code');
	const verifier = locals.session.data.verifier;

	if (!code || !verifier) {
		return new Response('Missing code or verifier', { status: 400 });
	}

	try {
		const response = await client.exchangeOAuthCodeForAccessTokenUsingPKCE(
			code,
			FUSION_AUTH_CLIENT_ID,
			FUSION_AUTH_CLIENT_SECRET,
			'http://localhost:5173/api/oauth-redirect',
			verifier
		);

		const accessToken = response.response.access_token;
		if (!accessToken) {
			return new Response('Failed to retrieve access token', { status: 500 });
		}
		locals.session.data.accessToken = accessToken;

		const userResponse = await client.retrieveUserUsingJWT(accessToken);
		// Check if user is provided in the response
		if (!userResponse.response.user?.email) {
			return new Response('No user email provided', { status: 500 });
		} else {
			locals.session.data.user = userResponse.response.user.email;
		}

		return new Response(null, {
			status: 302,
			headers: {
				location: '/'
			}
		});
	} catch (err) {
		console.error(err);
		return new Response('Error exchanging OAuth code for access token', { status: 500 });
	}
};
