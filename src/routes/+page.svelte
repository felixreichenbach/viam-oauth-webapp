<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { goto } from '$app/navigation';
	import { jwtDecode } from 'jwt-decode';
	import {
		PUBLIC_FUSION_AUTH_CLIENT_ID,
		PUBLIC_FUSION_AUTH_URL,
		PUBLIC_LOGIN_CALLBACK
	} from '$env/static/public';
	import Machine from './Machine.svelte';
	import Cloud from './Cloud.svelte';

	const href = encodeURI(
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

	function deleteCookie(name: string): void {
		document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
	}

	// validate JWT access token
	// TODO: Check if there is a better way such as catch from connection etc.
	function isTokenValid(token: string): boolean {
		try {
			const decoded: any = jwtDecode(token);
			const currentTime = Math.floor(Date.now() / 1000);
			return decoded.exp > currentTime;
		} catch (e) {
			return false;
		}
	}

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
	<a {href}>Login</a>
{:else}
	<button
		on:click={() => {
			deleteCookie('access_token');
			accessToken = '';
			goto('/');
		}}
	>
		Logout
	</button>
	<Machine />
{/if}
