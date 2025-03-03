<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import * as VIAM from '@viamrobotics/sdk';
	import { goto } from '$app/navigation';
	import { PUBLIC_MACHINE_URL } from '$env/static/public';
	import Image from './Image.svelte';
	import Video from './Video.svelte';

	const host = PUBLIC_MACHINE_URL;
	let accessToken: string;
	let machineClient: VIAM.RobotClient | null = null;
	let status: string = 'disconnected';

	/**
	 * Connects to the Viam machine using the provided access token.
	 * @param accessToken - The access token for authentication.
	 * @param host - The host URL of the Viam machine.
	 * @returns A promise that resolves when the connection is established.
	 */
	function connectMachine(accessToken: string, host: string) {
		machineClient = null;
		status = 'connecting';
		console.log(status);
		try {
			VIAM.createRobotClient({
				host,
				credentials: {
					type: 'access-token',
					payload: accessToken
				},
				signalingAddress: 'https://app.viam.com:443'
			}).then((client) => {
				machineClient = client;
				status = 'connected';
			});
		} catch (error) {
			throw new Error('Failed to connect to Viam Machine.');
		}
	}

	/**
	 * Disconnects from the Viam machine.
	 * Sets the machineClient to null and updates the status.
	 */
	function disconnectMachine() {
		if (machineClient) {
			status = 'disconnecting';
			machineClient.disconnect().then(() => {
				machineClient = null;
				status = 'disconnected';
			});
		}
	}

	/**
	 * Lifecycle function that runs when the component is mounted.
	 * Retrieves the access token from the context and attempts to connect to the Viam machine.
	 */
	onMount(() => {
		accessToken = getContext('accessToken') as string;
		if (!accessToken) {
			goto('/');
		} else {
			if (!machineClient) {
				connectMachine(accessToken, host);
			}
		}
	});
</script>

<h2>My Viam Machine</h2>

{#if status === 'connecting'}
	<p>Connecting...</p>
{:else if machineClient}
	<h3>Camera Image</h3>
	<Image {machineClient} cameraName="camera" />
	<h3>Camera Video Stream</h3>
	<Video {machineClient} cameraName="camera" />
	<button on:click={disconnectMachine}>Disconnect</button>
{:else}
	<p>Machine disconnected</p>
	<button on:click={() => connectMachine(accessToken, host)}>Connect</button>
{/if}
