export type ParsedResume = {
	createdAt: number;
	lastStoryAt: number;
	names: string[];
	emails: Email[];
	phones: Phone[];
	links: Link[];
	location: Location;
	schools: School[];
	summary: Summary;
	positions: Position[];
};

export type Email = {
	value: string;
	canonical: string;
};

export type Phone = {
	value: string;
	type: string;
};

export type Link = {
	url: string;
	canonicalUrl: string;
	domain: string;
};

export type Location = {
	name: string;
	address: {
		CountryCode: string;
	};
};

export type Position = {
	start?: Time;
	isCurrent: boolean;
	end?: Time;
	title: string;
	org: string;
	summary: string;
};

export type Time = {
	year: number;
	month: number;
	timestamp: number;
};

export type School = {
	start: Time;
	end: Time;
	isCurrent: boolean;
	org: string;
	degree: string;
	gpa: string;
	summary: string;
};

export type Summary = {
	workTime: {
		years: number;
		months: number;
	};
	executiveSummary: string;
	skills: string;
};
