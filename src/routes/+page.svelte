<script lang="ts">
	import type { PageProps } from './$types';
	// Get data from backend
	let { data }: PageProps = $props();

	const href =
		data.fusionAuthURL +
		'/oauth2/authorize?client_id=' +
		data.clientId +
		'&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fapi%2Foauth-redirect&scope=offline_access&state=' +
		data.stateValue +
		'&code_challenge=' +
		data.challenge +
		'&code_challenge_method=S256';
</script>

<h1>Welcome to Viam OAuth</h1>
<a {href}>Login</a>
