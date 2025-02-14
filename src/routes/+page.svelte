<script lang="ts">
	import type { PageProps } from './$types';
	// Get data from backend
	let { data }: PageProps = $props();
	$inspect(data);

	const href =
		data.session.fusionAuthURL +
		'/oauth2/authorize?client_id=' +
		data.session.clientId +
		'&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fapi%2Foauth-redirect&scope=offline_access&state=' +
		data.session.stateValue +
		'&code_challenge=' +
		data.session.challenge +
		'&code_challenge_method=S256';
</script>

<h1>Welcome to Viam OAuth</h1>
<a {href}>Login</a>
