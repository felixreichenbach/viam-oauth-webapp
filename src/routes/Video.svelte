<script lang="ts">
	import * as VIAM from '@viamrobotics/sdk';

	export let machineClient: VIAM.RobotClient;
	export let cameraName: string;

	let videoElement: HTMLVideoElement | null = null;
	let streamClient: VIAM.StreamClient | null = null;
	let currentStream: MediaStream | null = null;

	/**
	 * Fetches the video stream from the specified camera and attaches it to the video element.
	 */
	function getStream() {
		if (streamClient && currentStream) {
			streamClient.remove(currentStream.id);
		}
		streamClient = new VIAM.StreamClient(machineClient);
		streamClient.getStream(cameraName).then((stream) => {
			currentStream = stream;
			if (videoElement) {
				videoElement.srcObject = stream;
			}
		});
	}

	// Reactive statement to fetch a new image whenever the cameraName changes
	$: if (cameraName) {
		getStream();
	}
</script>

<video bind:this={videoElement} controls autoplay><track kind="captions" /></video>

<style>
	video {
		width: 50%;
		height: auto;
	}
</style>
