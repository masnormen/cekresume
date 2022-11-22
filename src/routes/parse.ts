import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async ({ request }) => {
	const randomNum = ((Math.random() * 6) | 0) + 1;
	const postingList = await fetch(`https://api.lever.co/v0/postings/leverdemo?skip=${randomNum}&limit=1&mode=json`);
	const [{ applyUrl }] = await postingList.json();

	const data = await request.formData();

	const response = await fetch('https://jobs.lever.co/parseResume', {
		method: 'POST',
		headers: {
			Referer: applyUrl,
			Origin: 'https://jobs.lever.co/',
		},
		body: data,
	});

	console.log(response);

	if (!response.ok) {
		return {
			status: 500,
			headers: {
				contentType: 'application/json',
			},
			body: JSON.stringify({
				error: await response.text(),
			}),
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
