<script lang="ts">
	import { onMount, setContext } from 'svelte';
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

	//setContext('accessToken', 'accessToken');

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

	onMount(async () => {
		accessToken = getCookie('access_token');
		if (accessToken) {
			setContext('accessToken', accessToken);
		}
	});
</script>

<h1>Welcome to Viam OAuth</h1>
{#if !accessToken}
	<a {href}>Login</a>
{:else}
	<Cloud />
	<Machine />
{/if}
