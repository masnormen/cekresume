<script lang="ts">
	import Footer from '$lib/Footer.svelte';
	import Header from '$lib/Header.svelte';
	import '../styles/app.css';
	import '../styles/tailwind.css';
</script>

<Header />

<main class="flex min-h-full flex-col items-center justify-center space-y-24 bg-white px-12 md:px-20">
	<slot />
</main>

<Footer />
