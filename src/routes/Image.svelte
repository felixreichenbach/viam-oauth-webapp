<script lang="ts">
	import { onMount } from 'svelte';
	import * as VIAM from '@viamrobotics/sdk';

	export let machineClient: VIAM.RobotClient;
	export let cameraName: string;

	let imageUrl: string | undefined;
	let error: Error | undefined;

	async function getImage(name: string) {
		try {
			const camera = new VIAM.CameraClient(machineClient, name);
			const image = await camera.getImage();
			const blob = new Blob([image], { type: 'image/jpeg' });
			imageUrl = URL.createObjectURL(blob);
			error = undefined;
		} catch (err) {
			if (err instanceof Error) {
				error = err;
			} else {
				error = new Error('An unknown error occurred');
			}
			imageUrl = undefined;
		}
	}

	onMount(() => {
		getImage('camera'); // Replace 'camera' with your actual camera name
	});
</script>

<button on:click={() => getImage(cameraName)}>Refresh Image</button>

{#if error}
	<p>Failed to get image from camera.</p>
	<p>{error.message}</p>
{:else if imageUrl}
	<img src={imageUrl} alt="Camera" />
{:else}
	<p>Getting image...</p>
{/if}
