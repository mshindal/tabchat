import { getStatusText } from 'http-status-codes'

type ResponseHandler<T> = (response: Response) => Promise<T>;

export const emptyResponseHandler: ResponseHandler<void> = async response => {};

export const jsonResponseHandler: ResponseHandler<any> = async response => await response.json();

interface SuperfetchOptions extends RequestInit {
  responseHandler: ResponseHandler<any>;
}

const defaultOptions: SuperfetchOptions = {
  method: 'GET',
	mode: 'cors',
	headers: {
		'Content-Type': 'application/json'
	},
  responseHandler: jsonResponseHandler
}

export const superfetch = async (url: string, options?: Partial<SuperfetchOptions>) => {
  const mergedOptions = {...defaultOptions, ...options};
	const res = await fetch(url, mergedOptions);
	if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${getStatusText(res.status)} ${text ? `(${text})` : ''}`);
	}
	return await mergedOptions.responseHandler(res);
}

