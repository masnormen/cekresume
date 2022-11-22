<script lang="ts">
	// @hmr:keep-all
	import type { ParsedResume } from 'src/types/resume';

	import * as animateScroll from 'svelte-scrollto';
	import SvelteSeo from 'svelte-seo';
	import Dropzone from 'svelte-file-dropzone';
	import lookup from 'country-code-lookup';

	import ResumeItem from '$lib/ResumeItem.svelte';
	import ResumeHeader from '$lib/ResumeHeader.svelte';

	import { SEO_CONST } from '$lib/constants';

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

	animateScroll.setGlobalOptions({
		offset: -70,
	});

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
		setTimeout(() => animateScroll.scrollTo({ element: '#resume', y: 200 }), 100);
	};
</script>

<SvelteSeo
	{...SEO_CONST}
	openGraph={{
		title: SEO_CONST.title,
		description: SEO_CONST.description,
		url: SEO_CONST.canonical,
		type: 'website',
		images: [
			{
				url: `${SEO_CONST.canonical}/thumbnail.png`,
				width: 1266,
				height: 703,
				alt: SEO_CONST.title,
			},
		],
	}}
	twitter={{
		title: SEO_CONST.title,
		description: SEO_CONST.description,
		image: `${SEO_CONST.canonical}/thumbnail.png`,
		imageAlt: SEO_CONST.title,
	}}
/>

<section id="uploader" class="flex w-full max-w-[1024px] flex-col space-y-14 md:flex-row md:space-y-0 md:space-x-14">
	<!-- File Uploader -->
	<Dropzone
		multiple={false}
		accept={['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
		disableDefaultStyles={true}
		containerClasses="flex flex-col grow items-center justify-center bg-gray-50 text-gray-400 text-md space-y-5 p-14 outline-dotted outline-3 outline-gray-200 rounded-md focus:outline-blue-300 hover:outline-blue-300 transition-all duration-300"
		on:drop={handleChooseFile}
		noKeyboard={isDisabled}
		noDrag={isDisabled}
		noClick={isDisabled}
	>
		{#if state === AppState.FileChosen}
			<span class="text-gray-400">Pilih <span class="font-semibold text-gray-600">{file.name}</span>?</span>
			<button
				type="button"
				class="flex justify-center rounded-md border border-transparent bg-green-200 px-4 py-2 font-medium text-green-700 hover:bg-green-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
				tabindex="0"
				on:click={handleUploadFile}
			>
				⬆️ Cek resume
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
				Klik untuk memilih file (pdf/docx)
			</button>
			<span>atau</span>
			<span>Seret file-mu ke sini</span>
		{/if}
	</Dropzone>

	<!-- Description -->
	<aside class="flex flex-col justify-center space-y-5 md:w-1/3">
		<p class="text-md leading-relaxed text-gray-600">
			<b>Cek Resume</b> dapat membantu mengecek apakah resume kamu dapat terbaca dengan baik oleh Application Tracking Systems
			(ATS). ATS sering digunakan oleh perusahaan dalam menyeleksi CV kandidat karyawan secara otomatis. Dengan website ini,
			kamu bisa terbantu untuk menulis resume yang ATS-friendly.
		</p>
		<p class="text-sm leading-relaxed text-red-600">
			<b>Update: Sejak Mei 2022, API Lever hanya menampilkan informasi dasar saja.</b>
		</p>
		<p class="text-xs leading-relaxed text-gray-400">
			<b>Tidak ada data yang disimpan oleh website ini.</b> Website ini menggunakan API dari
			<a class="font-semibold text-blue-600" href="https://www.lever.co/" target="_blank">Lever.co</a>. Beberapa
			perusahaan yang memakai Lever adalah: Netflix, Twitch, Quora, GoTo, Binance, dan Ruangguru. ATS lain mungkin
			memberikan hasil berbeda. Kode sumber dapat dilihat pada link GitHub tertera.
		</p>
	</aside>
</section>

{#if state === AppState.FileParsed}
	<section id="resume" class="space-y-6 text-center text-sm text-gray-500">
		<p>⬇️ Lihat resume yang telah di-parse ⬇️</p>
		<p>❓ = Data tidak ada/tidak terdeteksi</p>
	</section>

	<article
		class="flex w-full max-w-[1024px] grow flex-col space-y-14 break-words rounded-2xl border border-gray-50 p-8 text-xs shadow-lg shadow-gray-200"
	>
		<pre>{JSON.stringify(resume, null, 2)}</pre>
		<!-- ResumeHeader names={resume.names} summary={resume.summary.executiveSummary} />

		<section class="flex flex-col gap-6 px-14 md:grid md:grid-cols-3">
			<ResumeItem title="Contact Info">
				{#each resume.emails as { value }}
					<span class="text-gray-500">📧 {value}</span>
				{:else}
					<span class="text-gray-500">📧 ❓</span>
				{/each}
				{#each resume.phones as { value }}
					<span class="text-gray-500">☎️{value}</span>
				{:else}
					<span class="text-gray-500">☎️ ❓</span>
				{/each}
			</ResumeItem>

			<ResumeItem title="Location">
				<span class="text-gray-500">
					🌏 {resume.location.address.CountryCode.length > 0
						? lookup.byIso(resume.location.address.CountryCode).country
						: '❓'}
				</span>
				<span class="text-gray-500">🏠 {resume.location.name || '❓'}</span>
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
					{:else}
						❓
					{/each}
				</div>
			</ResumeItem>
		</section>

		<section class="col-span-3 flex flex-col space-y-4 px-14 pb-16">
			<span class="text-base font-medium text-gray-900">
				Experience (YoE: {resume.summary.workTime.months / 12} years)
			</span>
			<div class="flex flex-col space-y-4 text-sm">
				{#each resume.positions as job}
					<div class="space-y-2">
						<div class="flex w-full flex-col font-medium md:flex-row md:justify-between">
							<div class="flex flex-1 text-gray-800">🏢 {job.org}</div>
							<div class="text-gray-800 md:text-center">{job.title}</div>
							<div class="flex flex-1 text-gray-500 md:justify-end">
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

						<div class="text-gray-500">
							{job.summary.trim()}
						</div>
					</div>
				{:else}
					❓
				{/each}
			</div>
		</section> -->
	</article>
{/if}

<style>
	.loading {
		animation: loading 1.2s infinite ease-in-out;
	}

	@keyframes loading {
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
