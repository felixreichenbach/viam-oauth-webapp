<script lang="ts">
	import type { PageProps } from './$types';
	// Get data from backend
	let { data }: PageProps = $props();
	$inspect(data);
</script>

<h1>{'data.user'}</h1>
<div>{@html JSON.stringify(data)}</div>
