/**
 * =========================================================================
 * BACKEND INTEGRATION POINT: USER PROFILE & REGISTRATION API
 * =========================================================================
 * Expected Flask Endpoints:
 * - GET  /api/user/profile          -> Current user profile details
 * - PUT  /api/user/profile          -> Update user details / team
 * - GET  /api/user/submissions      -> User submission records
 * - POST /api/user/register-event   -> Register for BitHunt Parsec 7.0
 * =========================================================================
 */

import { apiRequest } from './client';

export const userApi = {
  /**
   * Get hunter profile
   */
  async getProfile() {
    try {
      // =========================================================================
      // BACKEND INTEGRATION POINT:
      // Replace with Flask call: GET /api/user/profile
      // =========================================================================
      return await apiRequest('/api/user/profile');
    } catch {
      const stored = localStorage.getItem('bithunt_mock_user');
      if (stored) {
        return JSON.parse(stored);
      }
      return {
        id: 'usr_guest_01',
        name: 'Victor Von Coder',
        email: 'operative@parsec.iitdh.ac.in',
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
    }
  },

  /**
   * Update profile
   */
  async updateProfile(profileData) {
    try {
      // =========================================================================
      // BACKEND INTEGRATION POINT:
      // Replace with Flask call: PUT /api/user/profile
      // =========================================================================
      return await apiRequest('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
    } catch {
      const current = await this.getProfile();
      const updated = { ...current, ...profileData };
      localStorage.setItem('bithunt_mock_user', JSON.stringify(updated));
      return updated;
    }
  }
};
