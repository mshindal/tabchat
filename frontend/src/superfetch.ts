import { getStatusText } from 'http-status-codes'

const defaultOptions: RequestInit = {
	method: 'GET',
	mode: 'cors',
	headers: {
		'Content-Type': 'application/json'
	}
}

export const superfetch = async (url: string, options?: RequestInit) => {
	const res = await fetch(url, {...defaultOptions, ...options});
	if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${getStatusText(res.status)} ${text ? `(${text})` : ''}`);
	}
	return await res.json();
}
