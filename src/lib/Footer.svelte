<script lang="ts">
	let year = new Date().getFullYear();
</script>

<footer class="flex min-h-full flex-col items-center justify-center bg-white py-28">
	<div class="flex flex-col items-center justify-center">
		<div class="flex flex-col items-center justify-center space-y-2">
			<div class="text-md font-medium text-gray-500">Cek Resume · © {year} Nourman Hajar</div>
			<div class="text-sm text-gray-500">
				Powered by Svelte. Inspired by
				<a class="text-blue-800" href="https://watermarkktp.com/" target="_blank">watermarkktp</a>.
			</div>
		</div>
	</div>
</footer>
