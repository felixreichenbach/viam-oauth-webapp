<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import * as VIAM from '@viamrobotics/sdk';
	import { goto } from '$app/navigation';

	import { PUBLIC_MACHINE_URL } from '$env/static/public';
	import Image from './Image.svelte';
	import Video from './Video.svelte';

	const host = PUBLIC_MACHINE_URL;
	let accessToken: string;

	/**
	 * Connects to the Viam machine using the provided access token.
	 * @param accessToken - The access token for authentication.
	 * @returns A promise that resolves when the connection is established.
	 */
	async function connectMachine(accessToken: string, host: string): Promise<VIAM.RobotClient> {
		try {
			const client = await VIAM.createRobotClient({
				host,
				credentials: {
					type: 'access-token',
					payload: accessToken
				},
				signalingAddress: 'https://app.viam.com:443'
			});
			return client;
		} catch (error) {
			console.log('FELIX');
			throw new Error('Failed to connect to Viam Machine.');
		}
	}

	onMount(async () => {
		accessToken = getContext('accessToken') as string;
		if (!accessToken) {
			goto('/');
		}
	});
</script>

<h2>My Viam Machine</h2>
{#await connectMachine(accessToken, host)}
	<p>Connecting to Viam Machine...</p>
{:then machineClient}
	<h3>Viam Machine Metadata:</h3>
	{#await machineClient.getCloudMetadata() then data}
		<pre>{JSON.stringify(data, null, 2)}</pre>
	{:catch error}
		<p>Failed to get metadata from Viam Machine.</p>
	{/await}
	<h3>Camera Image</h3>
	<Image {machineClient} />
	<h3>Camera Video Stream</h3>
	<Video {machineClient} cameraName="camera" />
{:catch error}
	<p>Failed to connect to Viam Machine.</p>
	<p>{error.message}</p>
{/await}
