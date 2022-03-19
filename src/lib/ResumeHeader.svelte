<script lang="ts">
	import GoPerson from 'svelte-icons/go/GoPerson.svelte';

	export let names: string[];
	export let summary: string;
</script>

<section class="relative flex flex-col space-y-6 rounded-t-2xl bg-gray-100 p-14">
	<div class="flex items-center space-x-4">
		<div class="flex h-14 w-14 items-center justify-center rounded-lg bg-white p-3 text-orange-700">
			<GoPerson />
		</div>
		<div>
			<div class="text-sm font-medium text-gray-900">Name</div>
			<div class="text-2xl font-medium text-gray-900">{names.join(' / ')}</div>
		</div>
	</div>
	<div class="w-full text-justify text-sm leading-relaxed">
		<span class="font-medium text-gray-800">Executive summary:</span>
		{#if summary.length > 0}
			<span class="text-gray-500">{summary}</span>
		{:else}
			❓
		{/if}
	</div>
</section>
