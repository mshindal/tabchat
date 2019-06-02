const defaultOptions: RequestInit = {
	method: 'GET',
	mode: 'cors',
	headers: {
		'Content-Type': 'application/json'
	}
}

const throwError = (response: Response) => {
	const message = 
		// we can add friendly text for more status codes here as we need them
		response.status === 429 ? 'You\'re doing that too much' :
		'That didn\'t work'
	throw new Error(message);
}

export const superfetch = async (url: string, options?: RequestInit) => {
	const res = await fetch(url, {...defaultOptions, ...options});
	if (!res.ok) {
		throwError(res);
	}
	return await res.json();
}
