<script lang="ts">
	import { onMount } from 'svelte';
	import * as VIAM from '@viamrobotics/sdk';

	export let machineClient: VIAM.RobotClient;
	export let cameraName: string;

	let videoElement: HTMLVideoElement | null = null;

	/**
	 * Fetches the video stream from the specified camera and attaches it to the video element.
	 */
	function getStream() {
		const streamClient = new VIAM.StreamClient(machineClient);
		streamClient.getStream(cameraName).then((stream) => {
			if (videoElement) {
				videoElement.srcObject = stream;
			}
		});
	}

	/**
	 * Lifecycle function that runs when the component is mounted.
	 * Calls the getStream function to fetch and display the video stream.
	 */
	onMount(() => {
		getStream();
	});
</script>

<video bind:this={videoElement} controls autoplay><track kind="captions" /></video>
