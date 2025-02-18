<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import * as VIAM from '@viamrobotics/sdk';
	import { goto } from '$app/navigation';

	let orgID: string;
	let accessToken: string = '';

	/**
	 * Connects to the Viam client using the provided access token.
	 * @param accessToken - The access token for authentication.
	 * @returns A promise that resolves when the connection is established.
	 */
	async function connectCloud(accessToken: string): Promise<VIAM.ViamClient> {
		const opts: VIAM.ViamClientOptions = {
			credentials: {
				type: 'access-token',
				payload: accessToken
			}
		};
		return await VIAM.createViamClient(opts);
	}

	/**
	 * Retrieves the Viam organization ID.
	 * @returns A promise that resolves with the organization ID.
	 */
	async function getOrgID(viamClient: VIAM.ViamClient): Promise<string> {
		const orglist = await viamClient.appClient.listOrganizations();
		orgID = orglist[0].id ?? '';
		return orgID;
	}

	/**
	 * Retrieves the organization ID and tabular data.
	 * @returns A promise that resolves with the organization ID and tabular data.
	 */
	async function getData(viamClient: VIAM.ViamClient, orgID: string): Promise<any> {
		return viamClient.dataClient.tabularDataByMQL(orgID, [{ $limit: 1 }]);
	}

	onMount(async () => {
		accessToken = getContext('accessToken') as string;
		if (accessToken === '') {
			goto('/');
		}
	});
</script>

<h2>My Viam Cloud</h2>
{#await connectCloud(accessToken)}
	<p>Connecting...</p>
{:then client}
	{#if !client}
		<p>Failed to connect to Viam Cloud.</p>
	{:else}
		{#await getOrgID(client)}
			<p>Getting data...</p>
		{:then id}
			<h3>My Organization ID:</h3>
			<pre>{id}</pre>
		{/await}
		{#await getData(client, orgID)}
			<p>Getting data...</p>
		{:then data}
			<h3>My Tabular Data:"</h3>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		{/await}
	{/if}
{/await}
