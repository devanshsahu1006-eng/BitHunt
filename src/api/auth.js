/**
 * =========================================================================
 * BACKEND INTEGRATION POINT: AUTHENTICATION API
 * =========================================================================
 * Expected Flask Endpoints:
 * - POST /api/auth/login    -> { email, password } => { token, user }
 * - POST /api/auth/register -> { name, email, password, teamName, college } => { token, user }
 * - POST /api/auth/logout   -> (Revoke session/token)
 * - GET  /api/auth/me       -> (Validate JWT token) => { user }
 * =========================================================================
 */

import { apiRequest, setAuthToken } from './client';

// Local storage key for persistent mock user
const MOCK_USER_KEY = 'bithunt_mock_user';

export const authApi = {
  /**
   * Login user
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    try {
      // =========================================================================
      // BACKEND INTEGRATION POINT:
      // Replace with Flask call: POST /api/auth/login
      // =========================================================================
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (response.token) {
        setAuthToken(response.token);
      }
      return response;
    } catch {
      // Simulated mock login
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network latency

      // Default Doom Hunter Mock Profile
      const mockUser = {
        id: 'usr_latveria_07',
        name: email.split('@')[0] || 'Victor Von Coder',
        email: email || 'hunter@earth616.org',
        role: 'Hunter Candidate',
        faction: 'The Strategist',
        clearanceLevel: 'OMEGA-4',
        college: 'IIT Dharwad',
        teamName: 'Parsec Protocol',
        registrationStatus: 'CONFIRMED',
        rank: 7,
        totalScore: 850,
        solvedProblems: 3,
        parsecId: 'PARSEC-7-DOOM-0042'
      };

      const mockToken = 'mock_jwt_token_earth616_' + Date.now();
      setAuthToken(mockToken);
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));

      return {
        token: mockToken,
        user: mockUser,
        message: 'Citadel Access Granted // Earth-616 Secure Node'
      };
    }
  },

  /**
   * Register new user
   */
  async register(userData) {
    try {
      // =========================================================================
      // BACKEND INTEGRATION POINT:
      // Replace with Flask call: POST /api/auth/register
      // =========================================================================
      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      if (response.token) {
        setAuthToken(response.token);
      }
      return response;
    } catch {
      // Mock registration fallback
      await new Promise(resolve => setTimeout(resolve, 900));

      const mockUser = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        name: userData.name || 'Operative',
        email: userData.email,
        role: 'Hunter Candidate',
        faction: userData.faction || 'The Strategist',
        clearanceLevel: 'OMEGA-1',
        college: userData.college || 'IIT Dharwad',
        teamName: userData.teamName || 'Nexus Strike',
        registrationStatus: 'CONFIRMED',
        rank: 42,
        totalScore: 0,
        solvedProblems: 0,
        parsecId: 'PARSEC-7-DOOM-' + Math.floor(1000 + Math.random() * 9000)
      };

      const mockToken = 'mock_jwt_token_earth616_' + Date.now();
      setAuthToken(mockToken);
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));

      return {
        token: mockToken,
        user: mockUser,
        message: 'Hunter Identity Registered in Doomsday Codex'
      };
    }
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      // =========================================================================
      // BACKEND INTEGRATION POINT:
      // Replace with Flask call: POST /api/auth/logout
      // =========================================================================
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      setAuthToken(null);
      localStorage.removeItem(MOCK_USER_KEY);
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    try {
      // =========================================================================
      // BACKEND INTEGRATION POINT:
      // Replace with Flask call: GET /api/auth/me
      // =========================================================================
      return await apiRequest('/api/auth/me');
    } catch {
      const stored = localStorage.getItem(MOCK_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    }
  }
};
