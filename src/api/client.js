/**
 * =========================================================================
 * BACKEND INTEGRATION: API CLIENT
 * =========================================================================
 * - Development: When VITE_API_BASE_URL is unset/empty, requests to /api/*
 *   are proxied by Vite to the local Flask backend (http://localhost:5000),
 *   allowing local development with zero CORS or cookie friction.
 * 
 * - Production: Set VITE_API_BASE_URL in your Vercel Project Environment Variables
 *   (e.g., https://your-backend.onrender.com). All API calls will prepend this URL.
 * 
 * - Authentication: Flask-Login session cookies are sent automatically with
 *   credentials: 'include'. Bearer tokens are also attached if present.
 * =========================================================================
 */

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

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
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${path}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 502 || response.status === 503) {
      throw new Error(
        'Backend server is not running or unreachable at port 5000. Start it in a terminal using: python Backend/main.py'
      );
    }
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || errorData.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
}
