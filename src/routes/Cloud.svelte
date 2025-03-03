<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import * as VIAM from '@viamrobotics/sdk';
	import { goto } from '$app/navigation';

	let orgID: string;
	let tabularData: any;
	let accessToken: string = '';
	let status: string = 'disconnected';
	let viamClient: VIAM.ViamClient | null = null;

	/**
	 * Connects to the Viam client using the provided access token.
	 * @param accessToken - The access token for authentication.
	 * @returns A promise that resolves when the connection is established.
	 */
	function connectCloud(accessToken: string) {
		status = 'connecting';
		const opts: VIAM.ViamClientOptions = {
			credentials: {
				type: 'access-token',
				payload: accessToken
			}
		};
		VIAM.createViamClient(opts)
			.then((client) => {
				viamClient = client;
				status = 'connected';
			})
			.catch((err) => {
				status = 'disconnected';
				console.error(err);
			});
	}

	/**
	 * Retrieves the Viam organization ID.
	 * @param viamClient - The Viam client instance.
	 * @returns A promise that resolves with the organization ID.
	 */
	async function getOrgID(viamClient: VIAM.ViamClient): Promise<string> {
		const orglist = await viamClient.appClient.listOrganizations();
		orgID = orglist[0].id ?? '';
		return orgID;
	}

	/**
	 * Retrieves the tabular data for the specified organization.
	 * @param viamClient - The Viam client instance.
	 * @param orgID - The organization ID.
	 * @returns A promise that resolves with the tabular data.
	 */
	async function getTabularData(viamClient: VIAM.ViamClient, orgID: string): Promise<any> {
		return viamClient.dataClient.tabularDataByMQL(orgID, [{ $limit: 1 }]);
	}

	/**
	 * Retrieves the organization ID and tabular data.
	 * @param viamClient - The Viam client instance.
	 * @returns A promise that resolves with the organization ID and tabular data.
	 */
	async function getData(viamClient: VIAM.ViamClient): Promise<void> {
		orgID = await getOrgID(viamClient);
		tabularData = await getTabularData(viamClient, orgID);
	}

	/**
	 * Lifecycle function that runs when the component is mounted.
	 * Retrieves the access token from the context and attempts to connect to the Viam client.
	 */
	onMount(() => {
		accessToken = getContext('accessToken') as string;
		if (accessToken === '') {
			goto('/');
		} else {
			connectCloud(accessToken);
		}
	});
</script>

<h2>My Viam Cloud</h2>
{#if status === 'connecting'}
	<p>Connecting...</p>
{:else if status === 'connected' && viamClient}
	{#await getData(viamClient)}
		<p>Getting data...</p>
	{:then}
		<h3>My Organization ID:</h3>
		<pre>{orgID}</pre>
		<h3>My Tabular Data:</h3>
		<pre>{JSON.stringify(tabularData, null, 2)}</pre>
	{/await}
{/if}
