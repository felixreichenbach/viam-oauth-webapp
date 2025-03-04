<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { goto } from '$app/navigation';
	import { jwtDecode } from 'jwt-decode';
	import {
		PUBLIC_FUSION_AUTH_CLIENT_ID,
		PUBLIC_FUSION_AUTH_URL,
		PUBLIC_LOGIN_CALLBACK
	} from '$env/static/public';
	import HPE from './HPE.svelte';
	import Cloud from './Cloud.svelte';

	// Construct the FusionAuth URL for OAuth authorization
	const fusionAuthURL = encodeURI(
		PUBLIC_FUSION_AUTH_URL +
			'/oauth2/authorize?client_id=' +
			PUBLIC_FUSION_AUTH_CLIENT_ID +
			'&response_type=code&redirect_uri=' +
			PUBLIC_LOGIN_CALLBACK
	);

	let accessToken: string | undefined;

	/**
	 * Retrieves the value of the specified cookie.
	 * @param name - The name of the cookie.
	 * @returns The value of the cookie, or undefined if the cookie is not found.
	 */
	function getCookie(name: string): string | undefined {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop()?.split(';').shift();
	}

	/**
	 * Deletes the specified cookie by setting its expiration date to a past date.
	 * @param name - The name of the cookie to delete.
	 */
	function deleteCookie(name: string): void {
		document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
		accessToken = '';
	}

	/**
	 * Validates the JWT access token.
	 * @param token - The JWT access token to validate.
	 * @returns True if the token is valid, false otherwise.
	 */
	function isTokenValid(token: string): boolean {
		try {
			const decoded: any = jwtDecode(token);
			const currentTime = Math.floor(Date.now() / 1000);
			return decoded.exp > currentTime;
		} catch (e) {
			return false;
		}
	}

	/**
	 * Lifecycle function that runs when the component is mounted.
	 * Retrieves the access token from the cookie and validates it.
	 * If the token is valid, sets the access token in the context.
	 * If the token is invalid, redirects to the login page.
	 */
	onMount(async () => {
		accessToken = getCookie('access_token');
		if (accessToken) {
			if (!isTokenValid(accessToken)) {
				accessToken = '';
				goto('/');
			}
			setContext('accessToken', accessToken);
		}
	});
</script>

<h1>Welcome to Viam OAuth</h1>
{#if !accessToken}
	<a href={fusionAuthURL}>Login</a>
{:else}
	<button
		on:click={() => {
			// TODO - logout from FusionAuth
			deleteCookie('access_token');
			goto('/');
		}}
	>
		Logout
	</button>
	<HPE />
{/if}

<style lang="postcss">
	@reference "tailwindcss/theme";
	:global(html) {
		background-color: theme(--color-gray-100);
	}
</style>
