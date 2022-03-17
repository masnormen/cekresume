<script context="module" lang="ts">
	import { browser, dev } from '$app/env';
	export const hydrate = dev;
	export const router = browser;
	export const prerender = true;
</script>

<script lang="ts">
	// @hmr:keep-all
	import type { ParsedResume } from 'src/types/resume';

	import lookup from 'country-code-lookup';
	import GoMarkGithub from 'svelte-icons/go/GoMarkGithub.svelte';
	import FaGlobe from 'svelte-icons/fa/FaGlobe.svelte';
	import Dropzone from 'svelte-file-dropzone';

	import ResumeItem from '$lib/ResumeItem.svelte';
	import ResumeHeader from '$lib/ResumeHeader.svelte';

	enum AppState {
		Initial,
		FileChosen,
		FileUploading,
		FileParsed,
		Errored,
	}
	let state: AppState = AppState.Initial;
	let resume: ParsedResume = null;
	let file: File = null;
	let message: string = null;

	$: isDisabled = state === AppState.FileUploading || state === AppState.Errored;

	const handleChooseFile = async (e: CustomEvent) => {
		file = e.detail.acceptedFiles[0];
		state = AppState.FileChosen;
	};

	const handleUploadFile = async () => {
		state = AppState.FileUploading;

		const data = new FormData();
		data.append('resume', file);

		const response = await fetch('/parse', {
			method: 'POST',
			body: data,
		});

		if (!response.ok) {
			message = await response.text();
			state = AppState.Errored;
			return;
		}

		resume = await response.json();
		state = AppState.FileParsed;
	};
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<header class="flex min-h-full flex-col items-center justify-center bg-white">
	<div class="flex flex-col items-center justify-center">
		<div class="flex flex-col items-center justify-center space-y-5 py-20">
			<h1 class="text-4xl font-semibold text-gray-900">Cek Resume</h1>
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

<main class="flex min-h-full flex-col items-center justify-center space-y-24 bg-white px-20">
	<section class="flex w-full max-w-[1024px] flex-col space-y-14 md:flex-row md:space-y-0 md:space-x-14">
		<!-- Information -->
		<aside class="flex flex-col justify-center space-y-5 md:w-1/3">
			<h2 class="text-2xl font-medium text-gray-900">Website apa ini?</h2>
			<p class="text-md leading-relaxed text-gray-600">
				<b>Cek Resume</b> membantu kamu untuk mengecek apakah resume kamu dapat terbaca dengan baik oleh Application Tracking
				Systems (ATS). ATS adalah sistem yang sering digunakan oleh perusahaan dalam menyeleksi kandidat karyawan. Dengan
				website ini, kamu bisa terbantu untuk menulis Resume yang ATS-friendly.
			</p>
			<p class="text-xs leading-relaxed text-gray-500">
				Website ini hanya alat bantu untuk menulis resume yang ATS-friendly. Website ini menggunakan API <i
					>resume parser</i
				>
				dari
				<b>Lever</b>. Contoh perusahaan yang memakai Lever adalah: Netflix, Twitch, Quora, GoTo, Binance, dan Ruangguru.
				Tidak ada data yang disimpan oleh website ini. Kode sumber dari website ini dapat dilihat pada link GitHub
				tertera.
			</p>
		</aside>

		<!-- File Uploader -->
		<Dropzone
			multiple={false}
			accept={['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
			disableDefaultStyles={true}
			containerClasses="flex flex-col grow items-center justify-center bg-gray-50 text-gray-400 text-md space-y-5 p-14 outline-dotted outline-3 outline-gray-200 rounded-md"
			on:drop={handleChooseFile}
			noKeyboard={isDisabled}
			noDrag={isDisabled}
			noClick={isDisabled}
		>
			{#if state === AppState.FileChosen}
				<span class="text-gray-400">Pilih <span class="font-semibold text-gray-600">{file.name}</span>?</span>
				<button
					type="button"
					class="flex justify-center rounded-md border border-transparent bg-orange-100 px-4 py-2 font-medium text-orange-900 hover:bg-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
					tabindex="0"
					on:click={handleUploadFile}
				>
					Cek resume saya
				</button>
			{:else if state === AppState.FileUploading}
				<div class="h-12 w-12 bg-black loading" />
				<span>Membaca resume...</span>
			{:else if state === AppState.Errored}
				<div class="h-12 w-12 bg-orange-400" />
				<span>Error: {message}</span>
			{:else}
				<button
					type="button"
					class="flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
					tabindex="0"
				>
					Klik untuk memilih file
				</button>
				<span>atau</span>
				<span>Seret file-mu ke sini</span>
			{/if}
		</Dropzone>
	</section>

	<section>
		<h1 class="text-md text-green-500">Berhasil <i>parse</i> resume!</h1>
	</section>

	{#if state === AppState.FileParsed}
		<article
			class="flex w-full max-w-[1024px] grow flex-col space-y-12 rounded-2xl border border-gray-100 shadow-2xl shadow-gray-300"
		>
			<!-- Summary -->
			<ResumeHeader names={resume.names} summary={resume.summary.executiveSummary} />

			<!-- Biodata -->
			<section class="grid grid-cols-1 gap-6 bg-white px-14 md:grid-cols-3">
				<ResumeItem title="Contact Info">
					{#each resume.emails as { value }}
						<span class="text-gray-500">📧 {value}</span>
					{:else}
						<span class="text-gray-500">📧 -</span>
					{/each}
					{#each resume.phones as { value }}
						<span class="text-gray-500">☎️{value}</span>
					{:else}
						<span class="text-gray-500">☎️ -</span>
					{/each}
				</ResumeItem>

				<ResumeItem title="Location">
					<span class="text-gray-500">
						🌏 {resume.location.address.CountryCode.length > 0
							? lookup.byIso(resume.location.address.CountryCode).country
							: '-'}
					</span>
					<span class="text-gray-500">🏠 {resume.location.name || '-'}</span>
				</ResumeItem>

				<ResumeItem title="Links">
					{#each resume.links as { url }}
						<a href={url} class="text-blue-500">{url}</a>
					{:else}
						<span class="text-gray-500">❓</span>
					{/each}
				</ResumeItem>

				<ResumeItem title="Education">
					{#each resume.schools as edu}
						<div class="mb-2 flex flex-col space-y-1">
							<span class="font-medium text-gray-800">🏫 {edu.org}</span>
							<span class="text-gray-500">{edu.degree}</span>
							<span class="text-gray-500">
								{#if edu.start}
									{new Date(edu.start.timestamp).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
								{:else}
									❓
								{/if}
								–
								{#if edu.end}
									{new Date(edu.end.timestamp).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
								{:else}
									❓
								{/if}
							</span>
							{#if edu.gpa}
								<span class="text-gray-500">GPA: {edu.gpa}</span>
							{/if}
							{#if edu.summary}
								<span class="text-gray-500">Summary: {edu.summary}</span>
							{/if}
						</div>
					{:else}
						<span class="text-gray-500">❓</span>
					{/each}
				</ResumeItem>

				<ResumeItem title="Listed Skills" wide={true}>
					<div class="flex flex-row flex-wrap gap-2">
						{#each resume.summary.skills.split(', ') as skill}
							<span class="rounded bg-orange-100 px-1.5 py-0.5 text-xs text-orange-600">{skill}</span>
						{/each}
					</div>
				</ResumeItem>
			</section>

			<!-- Experience -->
			<section class="col-span-3 flex flex-col space-y-4 bg-white px-14 pb-16">
				<span class="text-base font-medium text-gray-900">
					Experience (YoE: {resume.summary.workTime.months / 12} years)
				</span>
				<div class="flex flex-col gap-4 text-sm">
					{#each resume.positions as job}
						<div class="flex w-full flex-row justify-between font-medium">
							<div class="flex flex-1 text-gray-800">🏢 {job.org}</div>
							<div class="self-center text-center text-gray-800">{job.title}</div>
							<div class="flex flex-1 justify-end text-gray-500">
								{#if job.start}
									{new Date(job.start.timestamp).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
								{:else}
									❓
								{/if}
								–
								{#if job.end}
									{new Date(job.end.timestamp).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
								{:else}
									❓
								{/if}
							</div>
						</div>

						<div class="ml-6">
							<span class="text-gray-500">
								{job.summary.trim()}
							</span>
						</div>
					{/each}
				</div>
			</section>
		</article>
	{/if}

	<section class="flex w-full max-w-[1024px] grow flex-col rounded-2xl border border-2 shadow-2xl shadow-gray-300 ">
		<pre>{JSON.stringify(resume, null, 2)}</pre>
	</section>
</main>

<style>
	.loading {
		animation: sk-plane 1.2s infinite ease-in-out;
	}

	@keyframes sk-plane {
		0% {
			transform: perspective(120px) rotateX(0deg) rotateY(0deg);
		}
		50% {
			transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
		}
		100% {
			transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
		}
	}
</style>
