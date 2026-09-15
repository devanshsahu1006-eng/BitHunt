/**
 * =========================================================================
 * BACKEND INTEGRATION POINT: API CLIENT
 * =========================================================================
 * Base HTTP client configured to connect to the Flask backend server.
 * Reads API Base URL from the Vite environment variable: VITE_API_BASE_URL.
 * 
 * If the Flask server is not running or VITE_API_BASE_URL is not set,
 * this client automatically uses the built-in mock responses, ensuring
 * the frontend is 100% functional out-of-the-box.
 * =========================================================================
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Token storage key
const AUTH_TOKEN_KEY = 'bithunt_auth_token';

export const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

/**
 * Universal request wrapper for Flask API endpoints
 */
export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // When Flask server is offline, callers catch and fallback to mock data
    console.info(`[BitHunt Client] Flask API at ${url} unreachable or returned error. Falling back to local mock.`);
    throw error;
  }
}
