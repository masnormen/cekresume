import type { RequestHandler } from '@sveltejs/kit';
import { parse } from 'node-html-parser';
import type { ParsedResume } from 'src/types/resume';

export const post: RequestHandler = async ({ request }) => {
	const randomNum = ((Math.random() * 6) | 0) + 1;
	const postingList = await fetch(`https://api.lever.co/v0/postings/leverdemo?skip=${randomNum}&limit=1&mode=json`);
	const [{ applyUrl }] = await postingList.json();

	const postingPage = await fetch(applyUrl);
	const postingDom = parse(await postingPage.text());
	const csrfToken = postingDom.getElementById('csrf-token').getAttribute('value');
	const postingId = postingDom.getElementById('posting-id').getAttribute('value');

	const formData = await request.formData();
	formData.append('postingId', postingId);
	formData.append('csrf', csrfToken);

	const response = await fetch('https://jobs.lever.co/parseResume', {
		method: 'POST',
		headers: {
			Referer: 'https://jobs.lever.co/',
			Origin: 'https://jobs.lever.co/',
		},
		body: formData,
	});

	if (!response.ok) {
		return {
			status: 500,
			headers: {
				contentType: 'application/json',
			},
			body: {
				error: response.text(),
			},
		};
	}

	return {
		status: 200,
		headers: {
			contentType: 'application/json',
		},
		body: await response.json(),
	};
};
