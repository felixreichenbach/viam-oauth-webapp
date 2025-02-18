<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import * as VIAM from '@viamrobotics/sdk';
	import { goto } from '$app/navigation';

	import { PUBLIC_MACHINE_URL } from '$env/static/public';

	const host = PUBLIC_MACHINE_URL;
	let accessToken: string;

	/**
	 * Connects to the Viam machine using the provided access token.
	 * @param accessToken - The access token for authentication.
	 * @returns A promise that resolves when the connection is established.
	 */
	async function connectMachine(accessToken: string, host: string): Promise<VIAM.RobotClient> {
		return await VIAM.createRobotClient({
			host,
			credentials: {
				type: 'access-token',
				payload: accessToken
			},
			signalingAddress: 'https://app.viam.com:443'
		});
	}

	onMount(async () => {
		accessToken = getContext('accessToken') as string;
		if (!accessToken) {
			goto('/');
		}
	});
</script>

<strong> My Viam Machine</strong>
{#await connectMachine(accessToken, host)}
	<p>Connecting to Viam Machine...</p>
{:then machineClient}
	<p>Viam Machine Metadata:</p>
	{#await machineClient.getCloudMetadata() then data}
		<pre>{JSON.stringify(data, null, 2)}</pre>
	{:catch error}
		<p>Failed to get metadata from Viam Machine.</p>
	{/await}
{:catch error}
	<p>Failed to connect to Viam Machine.</p>
{/await}
