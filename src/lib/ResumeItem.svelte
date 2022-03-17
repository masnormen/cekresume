<script lang="ts">
	export let title: string;
	export let wide = false;
</script>

<div class:col-span-2={wide} class="flex flex-col">
	<div class="mb-2 text-base font-medium text-gray-900">{title}</div>
	<div class="flex flex-col space-y-1 break-words text-sm">
		<slot />
	</div>
</div>
