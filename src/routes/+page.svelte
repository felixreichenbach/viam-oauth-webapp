<script lang="ts">
	import { onMount } from 'svelte';
	import * as VIAM from '@viamrobotics/sdk';

	const CLIENT_ID = import.meta.env.VITE_FUSION_AUTH_CLIENT_ID;
	const LOGIN_CALLBACK = 'http://localhost:5173/callback';

	const href =
		'https://auth.viam.com/oauth2/authorize?client_id=' +
		CLIENT_ID +
		'&response_type=code&redirect_uri=' +
		encodeURI(LOGIN_CALLBACK);

	let accessToken: string = '';
	let viamClient: VIAM.ViamClient | null = null;

	async function connect() {
		const opts: VIAM.ViamClientOptions = {
			credentials: {
				type: 'access-token',
				payload: accessToken
			}
		};

		viamClient = await VIAM.createViamClient(opts);
		const orglist = await viamClient.appClient.listOrganizations();
		//viamClient.dataClient.tabularDataByMQL('', [{ $limit: 1 }]);
		console.log('Connected to Viam');
		return orglist;
	}

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		accessToken = urlParams.get('access_token') ?? '';
	});
</script>

<h1>Welcome to Viam OAuth</h1>
{#if accessToken}
	<p>Hello World</p>
	{#await connect() then data}
		<p>My Organizations: "{JSON.stringify(data)}".</p>
	{/await}
{:else}
	<a {href}>Login</a>
{/if}
