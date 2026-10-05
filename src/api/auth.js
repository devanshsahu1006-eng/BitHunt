/**
 * =========================================================================
 * BACKEND AUTHENTICATION API
 * =========================================================================
 * Connects directly to Flask backend /api/auth/* endpoints.
 * Session state is maintained via Flask-Login session cookies (with
 * credentials: 'include') and optional Bearer tokens.
 * =========================================================================
 */

import { apiRequest, setAuthToken } from './client';

export const authApi = {
  /**
   * Login user with email and password
   * POST /api/auth/login
   */
  async login(email, password) {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  /**
   * Register new candidate and squad
   * POST /api/auth/register
   */
  async register(userData) {
    const response = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  /**
   * Logout user — clears session on backend and token client-side
   * POST /api/auth/logout
   */
  async logout() {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      setAuthToken(null);
    }
  },

  /**
   * Get current authenticated user session
   * GET /api/auth/me
   */
  async getCurrentUser() {
    try {
      const response = await apiRequest('/api/auth/me');
      return response?.user || null;
    } catch {
      return null;
    }
  }
};
