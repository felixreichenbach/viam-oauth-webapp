<script lang="ts">
	import * as VIAM from '@viamrobotics/sdk';

	export let machineClient: VIAM.RobotClient;
	export let cameraName: string;

	let imageUrl: string | undefined;
	let error: Error | undefined;

	/**
	 * Fetches the image from the specified camera and updates the imageUrl.
	 * @param name - The name of the camera.
	 */
	function getImage() {
		try {
			const camera = new VIAM.CameraClient(machineClient, cameraName);
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

	// Reactive statement to fetch a new image whenever the cameraName changes
	$: if (cameraName) {
		getImage();
	}
</script>

{#if error}
	<p>Failed to get image from camera.</p>
	<p>{error.message}</p>
{:else if imageUrl}
	<img src={imageUrl} alt="Camera" />
{:else}
	<p>Getting image...</p>
{/if}
<button on:click={getImage}>Refresh Image</button>

<style>
	img {
		width: 25%;
	}
</style>
