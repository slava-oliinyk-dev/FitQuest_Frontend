import { getApiBaseUrl } from './getApiBaseUrl';

export async function apiRequest(endpoint, method = 'GET', body = null, options = {}) {
	const { headers = {}, withCredentials = false } = options;
	const BASE_URL = getApiBaseUrl();

	const config = {
		method,
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},

		credentials: withCredentials ? 'include' : 'same-origin',
	};

	if (body) {
		config.body = JSON.stringify(body);
	}

	try {
		const response = await fetch(`${BASE_URL}${endpoint}`, config);
		const responseText = await response.text();
		const isJsonResponse = response.headers.get('content-type')?.includes('application/json');

		const parseResponseBody = () => {
			if (!responseText) {
				return null;
			}

			if (!isJsonResponse) {
				return responseText;
			}

			try {
				return JSON.parse(responseText);
			} catch (error) {
				console.warn('Failed to parse response JSON', error);
				return null;
			}
		};

		const parsedBody = parseResponseBody();

		if (!response.ok) {
			let errorMessage = response.statusText;
			if (parsedBody && typeof parsedBody === 'object') {
				errorMessage = parsedBody.err || parsedBody.message || errorMessage;
			} else if (typeof parsedBody === 'string' && parsedBody.trim()) {
				errorMessage = parsedBody;
			}
			throw new Error(errorMessage);
		}

		return parsedBody;
	} catch (error) {
		console.error(`API request failed: ${error.message}`);
		throw error;
	}
}
