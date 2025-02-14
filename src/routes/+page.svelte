<script lang="ts">
	const CLIENT_ID = import.meta.env.VITE_FUSION_AUTH_CLIENT_ID;
	const LOGIN_CALLBACK = 'http://localhost:5173/callback';

	const href =
		'https://auth.viam.com/oauth2/authorize?client_id=' +
		CLIENT_ID +
		'&response_type=code&redirect_uri=' +
		encodeURI(LOGIN_CALLBACK);
</script>

<h1>Welcome to Viam OAuth</h1>
<a {href}>Login</a>
