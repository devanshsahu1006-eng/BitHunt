/**
 * =========================================================================
 * CONTEST API
 * =========================================================================
 * Connects directly to Flask /api/contest/* endpoints.
 * Respects backend activation state and question availability.
 * Does NOT invent mock questions.
 * =========================================================================
 */

import { apiRequest } from './client';

export const contestApi = {
  /**
   * GET /api/contest/overview
   * Returns live Tech Team activation status, current round, timer, and score.
   */
  async getContestOverview() {
    try {
      return await apiRequest('/api/contest/overview');
    } catch {
      // Default to inactive/locked state if backend is unreachable
      return {
        title: 'BitHunt: The Doomsday Arena',
        round1Active: false,
        round2Active: false,
        currentRound: 1,
        isPresent: false,
        remainingSeconds: null,
        roundDurationSeconds: 1800,
        teamScore: 0,
      };
    }
  },

  /**
   * GET /api/contest/problems
   * Fetches real problems from the backend.
   * If round is inactive or no questions exist, returns an empty array.
   */
  async getProblems() {
    try {
      const data = await apiRequest('/api/contest/problems');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  /**
   * GET /api/contest/problems/:id
   * Fetches single problem detail.
   */
  async getProblemById(id) {
    try {
      return await apiRequest(`/api/contest/problems/${id}`);
    } catch {
      return null;
    }
  },

  /**
   * POST /api/contest/submit
   * Submits team answer to backend.
   */
  async submitSolution({ questionId, problemId, chosenOption, language, code }) {
    return await apiRequest('/api/contest/submit', {
      method: 'POST',
      body: JSON.stringify({
        questionId: questionId || problemId,
        chosenOption,
        language,
        code,
      }),
    });
  },

  /**
   * GET /api/contest/leaderboard
   * Fetches standings from backend.
   */
  async getLeaderboard() {
    try {
      const data = await apiRequest('/api/contest/leaderboard');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },
};
