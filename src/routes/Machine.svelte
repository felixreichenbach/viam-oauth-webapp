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
	let cameraNames: string[] = [];
	let selectedCameraName: string = '';

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
			})
				.then((client) => {
					machineClient = client;
					status = 'connected';
				})
				.then(() => {
					fetchCameraNames();
				});
		} catch (error) {
			throw new Error('Failed to connect to Viam Machine.');
		}
	}

	/**
	 * Fetches the camera names from the Viam machine and updates the cameraNames array.
	 * @param machineClient - The Viam machine client instance.
	 */
	async function fetchCameraNames() {
		if (machineClient) {
			const resources = await machineClient.resourceNames();
			cameraNames = resources
				.filter((resource) => resource.subtype === 'camera')
				.map((resource) => resource.name);
			if (cameraNames.length > 0) {
				selectedCameraName = cameraNames[0];
			}
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

	// Reactive statement to log when selectedCameraName changes
	$: {
		if (selectedCameraName) {
			console.log(`Selected camera name changed to: ${selectedCameraName}`);
		}
	}
</script>

<h2>My Viam Machine</h2>

{#if status === 'connecting'}
	<p>Connecting...</p>
{:else if machineClient}
	{#if cameraNames.length > 1}
		<h3>Select Camera</h3>
		<select bind:value={selectedCameraName}>
			{#each cameraNames as cameraName}
				<option value={cameraName}>{cameraName}</option>
			{/each}
		</select>
	{/if}
	{#if selectedCameraName !== ''}
		<h3>Camera Image</h3>
		<Image {machineClient} cameraName={selectedCameraName} />
		<h3>Camera Video Stream</h3>
		<Video {machineClient} cameraName={selectedCameraName} />
		<button on:click={disconnectMachine}>Disconnect</button>
	{:else}
		<p>Camera not available</p>
	{/if}
{:else}
	<p>Machine disconnected</p>
	<button on:click={() => connectMachine(accessToken, host)}>Connect</button>
{/if}
