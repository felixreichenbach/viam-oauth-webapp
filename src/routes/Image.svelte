<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import * as VIAM from '@viamrobotics/sdk';

	export let machineClient: VIAM.RobotClient;

	async function getImage(name: string) {
		const camera = await new VIAM.CameraClient(machineClient, name);
		const image = await camera.getImage();
		return image;
	}
</script>

<h3>Camera Image</h3>
{#await getImage('camera')}
	<p>Getting image...</p>
{:then image}
	<img src={URL.createObjectURL(new Blob([image]))} alt="Camera" />
{:catch error}
	<p>Failed to get image from camera.</p>
	<p>{error.message}</p>
{/await}
