<script lang="ts">
	import { onMount } from 'svelte';
	import * as VIAM from '@viamrobotics/sdk';

	export let machineClient: VIAM.RobotClient;
	export let cameraName: string;
	let videoElement: HTMLVideoElement | null = null;

	async function getStream(): Promise<MediaStream | undefined> {
		const streamClient = new VIAM.StreamClient(machineClient);
		const stream = await streamClient.getStream(cameraName);
		return stream;
	}

	onMount(async () => {
		const stream = await getStream();
		if (videoElement && stream) {
			videoElement.srcObject = stream;
			videoElement.play();
		}
	});
</script>

<video bind:this={videoElement} controls autoplay><track kind="captions" /></video>
