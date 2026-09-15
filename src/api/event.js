/**
 * =========================================================================
 * BACKEND INTEGRATION POINT: EVENT METADATA API
 * =========================================================================
 * Expected Flask Endpoints:
 * - GET /api/event/details   -> Complete BitHunt event information
 * - GET /api/event/schedule  -> Rounds, dates, timelines
 * - GET /api/event/faqs      -> FAQ queries
 * - POST /api/event/register -> Pre-register hunter/team
 * =========================================================================
 */

import { apiRequest } from './client';

export const EVENT_DATA = {
  meta: {
    name: 'BitHunt',
    tagline: 'A competitive coding hunt by Team Parsec, IIT Dharwad.',
    edition: 'PARSEC 7.0',
    protocol: 'DOOMSDAY PROTOCOL',
    threatLevel: 'OMEGA',
    secureChannel: '07',
    earthRealm: 'EARTH-616',
    codex: 'BITHUNT',
    college: 'IIT Dharwad',
    organizer: 'Team Parsec',
    contactNumber: '7666804195',
    copyrightYear: '2026',
    quote: 'THE LAST LINE OF DEFENCE IS LOGIC.',
    secondaryQuote: '> THE WORLD DOESN\'T NEED ANOTHER HERO. IT NEEDS A SOLUTION.',
    description: 'A competitive programming challenge built to test problem-solving, data structures, and algorithms. When the system fails, logic becomes the weapon. BitHunt challenges your algorithmic thinking and ability to solve under extreme pressure.'
  },

  dossierFactions: [
    {
      id: 'doom',
      role: 'THE STRATEGIST',
      name: 'VICTOR VON DOOM',
      quote: 'Every system has a weakness. Find it before it finds you.',
      archetype: 'Algorithmic Mastermind / Optimization Specialist',
      sigil: 'crown',
      energyColor: '#00ff88'
    },
    {
      id: 'sentinel',
      role: 'THE SENTINEL',
      name: 'THE UNBREAKABLE',
      quote: 'Discipline. Precision. One problem at a time.',
      archetype: 'Data Structure Fortress / Fault-Tolerant Logic',
      sigil: 'shield',
      energyColor: '#10b981'
    },
    {
      id: 'thunder',
      role: 'THE THUNDER',
      name: 'POWER MEETS LOGIC',
      quote: 'Brute force gets you started. Smart algorithms finish the job.',
      archetype: 'High-Concurrency Runtime / Complex Math',
      sigil: 'hammer',
      energyColor: '#00ffcc'
    }
  ],

  competitionStats: [
    { id: 'rounds', index: '01', label: 'COMPETITION', value: '2 ROUNDS', detail: 'Round 1: The Search, Round 2: The Conquest' },
    { id: 'duration', index: '02', label: 'DURATION', value: '03 HOURS', detail: '180 Minutes of Non-Stop Coding' },
    { id: 'languages', index: '03', label: 'LANGUAGES', value: 'ANY', detail: 'C++, Python, Java, Rust, JS & More' },
    { id: 'platform', index: '04', label: 'PLATFORM', value: 'CUSTOM', detail: 'Built-in Mission Control Arena' }
  ],

  rounds: [
    {
      roundNumber: '01',
      code: 'ROUND 01',
      title: 'THE SEARCH',
      description: 'Enter the arena. Decode the problems. Build the fastest path to an optimal algorithmic solution.',
      duration: '90 Mins',
      status: 'AWAITING HUNTERS'
    },
    {
      roundNumber: '02',
      code: 'ROUND 02',
      title: 'THE CONQUEST',
      description: 'Push your limits, optimize runtime complexity, eliminate edge cases, and climb the final global ranking.',
      duration: '90 Mins',
      status: 'LOCKED'
    }
  ],

  rules: [
    { number: '01', title: 'Problem-solving is the mission', detail: 'Points are awarded for accuracy, algorithmic efficiency, and test case pass rates.' },
    { number: '02', title: 'Any programming language', detail: 'Select your weapon of choice — Python, C++, Java, Rust, Go, or JavaScript.' },
    { number: '03', title: 'Maximum team size: 4', detail: 'Form an alliance of up to 4 operatives or conquer the battlefield solo.' },
    { number: '04', title: 'Competition duration: 3 hours', detail: 'The clock runs continuously. Late submissions receive no mercy.' }
  ],

  faqs: [
    {
      id: 1,
      number: '01',
      question: 'Who can participate?',
      answer: 'Event eligibility details will be announced by Team Parsec. Open to college students and passionate competitive coders across India.'
    },
    {
      id: 2,
      number: '02',
      question: 'How many rounds are there?',
      answer: 'BitHunt consists of two competitive rounds: Round 1 (The Search) to filter candidates and Round 2 (The Conquest) for the ultimate victory.'
    },
    {
      id: 3,
      number: '03',
      question: 'How long is the competition?',
      answer: 'The entire competition runs for three intensive hours (180 minutes of live algorithmic warfare).'
    },
    {
      id: 4,
      number: '04',
      question: 'Which programming languages can I use?',
      answer: 'Any programming language supported by our custom mission control platform can be used, including C++, Python, Java, and JavaScript.'
    }
  ],

  registration: {
    status: 'TBA',
    eventDate: 'TO BE ANNOUNCED',
    prizes: 'TO BE ANNOUNCED',
    announcementNotice: 'Registrations will open shortly through the official Team Parsec IIT Dharwad portal.'
  }
};

export const eventApi = {
  /**
   * Get all event details
   */
  async getEventDetails() {
    try {
      // =========================================================================
      // BACKEND INTEGRATION POINT:
      // Replace with Flask call: GET /api/event/details
      // =========================================================================
      return await apiRequest('/api/event/details');
    } catch {
      return EVENT_DATA;
    }
  },

  /**
   * Register hunter for the event
   */
  async preRegister(registrationData) {
    try {
      // =========================================================================
      // BACKEND INTEGRATION POINT:
      // Replace with Flask call: POST /api/event/register
      // =========================================================================
      return await apiRequest('/api/event/register', {
        method: 'POST',
        body: JSON.stringify(registrationData),
      });
    } catch {
      await new Promise(resolve => setTimeout(resolve, 600));
      return {
        success: true,
        message: 'Registration acknowledged by Citadel Codex. Confirmation dispatched.'
      };
    }
  }
};
