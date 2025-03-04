<script lang="ts">
	import * as VIAM from '@viamrobotics/sdk';

	export let machineClient: VIAM.RobotClient;
	export let cameraName: string;

	let imageUrl: string | undefined;
	let detections: VIAM.Detection[] | undefined;
	let classifications: VIAM.Classification[] | undefined;
	let extras: {} | undefined;
	let error: Error | undefined;

	/**
	 * Fetches the image from the specified camera and updates the imageUrl.
	 * @param name - The name of the camera.
	 */
	export function getImage() {
		try {
			const vision = new VIAM.VisionClient(machineClient, 'vision-sealant');
			vision
				.captureAllFromCamera(cameraName, {
					returnImage: true,
					returnDetections: true,
					returnClassifications: false,
					returnObjectPointClouds: false
				})
				.then((result) => {
					detections = result.detections;
					classifications = result.classifications;
					if (result.image) {
						const blob = new Blob([result.image.image], { type: 'image/jpeg' });
						imageUrl = URL.createObjectURL(blob);
						error = undefined;
					}
					extras = result.extras;
					console.log(extras);
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
	<tr>
		<td> <img src={imageUrl} alt="Camera" /></td>
		<td><pre>{JSON.stringify(detections, null, 2)}</pre></td>
	</tr>
{:else}
	<p>Getting image...</p>
{/if}

<style>
	img {
		width: 50%;
		height: auto;
	}
</style>
