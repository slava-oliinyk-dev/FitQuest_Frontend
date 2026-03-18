const normalizeBaseUrl = (value) => {
	if (typeof value !== 'string') return '';

	const trimmedValue = value.trim().replace(/\/+$/, '');
	return trimmedValue;
};

const isLocalHostname = (hostname) => {
	return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
};

export const getApiBaseUrl = () => {
	const envBaseUrl = normalizeBaseUrl(process.env.REACT_APP_API_URL);

	if (typeof window === 'undefined') {
		return envBaseUrl;
	}

	if (isLocalHostname(window.location.hostname)) {
		return envBaseUrl;
	}

	if (!envBaseUrl) {
		return '/api';
	}

	try {
		const resolvedUrl = new URL(envBaseUrl, window.location.origin);

		if (resolvedUrl.origin !== window.location.origin) {
			return '/api';
		}

		return normalizeBaseUrl(`${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`) || '/api';
	} catch (error) {
		console.warn('Failed to resolve API base URL. Falling back to same-origin /api.', error);
		return '/api';
	}
};
