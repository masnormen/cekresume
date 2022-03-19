<script lang="ts">
	import FaGlobe from 'svelte-icons/fa/FaGlobe.svelte';
	import GoMarkGithub from 'svelte-icons/go/GoMarkGithub.svelte';
</script>

<header class="flex min-h-full flex-col items-center justify-center bg-white py-24">
	<div class="flex flex-col items-center justify-center">
		<div class="flex flex-col items-center justify-center space-y-5">
			<h1 class="text-4xl font-semibold text-gray-900"><a href="/">Cek Resume</a></h1>
			<nav class="text-md flex flex-row justify-center space-x-5 text-gray-600">
				<a href="https://github.com/masnormen/cekresume" target="_blank" rel="noopener noreferer" class="h-5 w-5">
					<GoMarkGithub />
				</a>
				<a href="https://nourman.id/" target="_blank" rel="noopener noreferer" class="h-5 w-5">
					<FaGlobe />
				</a>
			</nav>
		</div>
	</div>
</header>
