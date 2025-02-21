<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import * as VIAM from '@viamrobotics/sdk';
	import { goto } from '$app/navigation';
	import { robotClientStore } from '../stores';
	import { PUBLIC_MACHINE_URL } from '$env/static/public';
	import Image from './Image.svelte';
	import Video from './Video.svelte';
	import { get } from 'svelte/store';

	const host = PUBLIC_MACHINE_URL;
	let accessToken: string;
	let machineClient: VIAM.RobotClient | null = null;

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
			robotClientStore.set(client);
			return client;
		} catch (error) {
			throw new Error('Failed to connect to Viam Machine.');
		}
	}

	onMount(async () => {
		accessToken = getContext('accessToken') as string;
		if (!accessToken) {
			goto('/');
		} else {
			machineClient = get(robotClientStore);
			if (!machineClient) {
				machineClient = await connectMachine(accessToken, host);
			}
		}
	});
</script>

<h2>My Viam Machine</h2>
{#if machineClient}
	{#if machineClient.isConnected()}
		<h3>Camera Image</h3>
		<Image {machineClient} cameraName="camera" />
		<h3>Camera Video Stream</h3>
		<Video {machineClient} cameraName="camera" />
	{:else}
		<p>Not connected to Viam Machine</p>
	{/if}
{:else}
	<p>Connecting to Viam Machine...</p>
{/if}
