const BASE_URL = 'http://localhost:3003';

export async function apiRequest(endpoint, method = 'GET', body = null, options = {}) {
  const { headers = {}, withCredentials = false } = options;

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

    if (!response.ok) {
      let errorMessage = response.statusText;
      try {
        const errorData = await response.json();
        errorMessage = errorData.err || errorMessage;
      } catch (e) {
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    throw error;
  }
}
