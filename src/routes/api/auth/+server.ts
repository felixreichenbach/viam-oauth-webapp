import type { RequestHandler } from '@sveltejs/kit';
import { FusionAuthClient } from '@fusionauth/typescript-client';
import { VITE_CLIENT_ID, VITE_CLIENT_SECRET, VITE_BASE_URL } from '$env/static/private';

const client = new FusionAuthClient('noapikeyneeded', VITE_BASE_URL);

export const GET: RequestHandler = async ({ url, locals }) => {
	const code = url.searchParams.get('code');
	const verifier = locals.session.data.verifier;

	if (!code || !verifier) {
		return new Response('Missing code or verifier', { status: 400 });
	}
	try {
		const response = await client.exchangeOAuthCodeForAccessTokenUsingPKCE(
			code,
			VITE_CLIENT_ID,
			VITE_CLIENT_SECRET,
			'http://localhost:5173/auth',
			verifier
		);

		const accessToken = response.response.access_token;
		if (!accessToken) {
			return new Response('Failed to retrieve access token', { status: 500 });
		}
		locals.session.data.accessToken = accessToken;

		const userResponse = await client.retrieveUserUsingJWT(accessToken);
		locals.session.data.user = userResponse.response.user;

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
