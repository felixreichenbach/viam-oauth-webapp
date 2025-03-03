<script lang="ts">
	import { onMount } from 'svelte';
	import * as VIAM from '@viamrobotics/sdk';

	export let machineClient: VIAM.RobotClient;
	export let cameraName: string;

	let imageUrl: string | undefined;
	let error: Error | undefined;

	/**
	 * Fetches the image from the specified camera and updates the imageUrl.
	 * @param name - The name of the camera.
	 */
	function getImage(name: string) {
		try {
			const camera = new VIAM.CameraClient(machineClient, name);
			camera.getImage().then((image) => {
				const blob = new Blob([image], { type: 'image/jpeg' });
				imageUrl = URL.createObjectURL(blob);
				error = undefined;
			});
		} catch (err) {
			if (err instanceof Error) {
				console.log(err.message);
				error = err;
			} else {
				console.log('An unknown error occurred');
				error = new Error('An unknown error occurred');
			}
			imageUrl = undefined;
		}
	}

	/**
	 * Lifecycle function that runs when the component is mounted.
	 * Calls the getImage function to fetch and display the initial image.
	 */
	onMount(() => {
		getImage(cameraName);
	});
</script>

{#if error}
	<p>Failed to get image from camera.</p>
	<p>{error.message}</p>
{:else if imageUrl}
	<img src={imageUrl} alt="Camera" />
{:else}
	<p>Getting image...</p>
{/if}
<button on:click={() => getImage(cameraName)}>Refresh Image</button>
