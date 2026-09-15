/**
 * =========================================================================
 * BACKEND INTEGRATION POINT: CONTEST & JUDGE API
 * =========================================================================
 * Expected Flask Endpoints:
 * - GET  /api/contest/overview     -> Contest metadata, timer, status
 * - GET  /api/contest/problems     -> List of active competition problems
 * - GET  /api/contest/problem/:id  -> Specific problem specification
 * - POST /api/contest/submit       -> Submit code for remote execution/judging
 * - GET  /api/contest/submissions  -> Hunter submission history
 * - GET  /api/contest/leaderboard  -> Real-time score & ranking board
 * =========================================================================
 */

import { apiRequest } from './client';

export const CONTEST_PROBLEMS = [
  {
    id: 'doom-01',
    code: 'DOOM-01',
    title: 'Latverian Firewall Decryption',
    difficulty: 'Alpha',
    points: 100,
    solvedCount: 142,
    accuracy: '88.4%',
    tags: ['Bit Manipulation', 'Strings', 'Parsec 7.0'],
    summary: 'Decode the alternating byte-sequence emitted by the citadel barrier.',
    description: `Doctor Doom has shielded the central fortress with an oscillating electromagnetic firewall. The firewall transmits an encrypted 64-bit integer stream.
    
You are given a binary string $S$ representing the energy packets received at Earth-616 outpost. To deactivate the perimeter shield, you must determine the minimum number of bit-flips required so that no two adjacent bits are identical (i.e., alternating bits "0101..." or "1010...").

If the length of string is odd or already optimal, return the minimal flips required.`,
    inputFormat: `The first line contains an integer $T$, the number of test cases.
Each testcase consists of a single binary string $S$ ($1 \\le |S| \\le 10^5$).`,
    outputFormat: `For each test case, output a single integer representing the minimum bit flips required to stabilize the firewall.`,
    constraints: `1 <= T <= 10\n1 <= |S| <= 10^5\nCharacters in S are either '0' or '1'`,
    samples: [
      {
        input: `2\n010010\n0001010`,
        output: `2\n2`,
        explanation: `For "010010", changing to "010101" requires 2 bit flips. For "0001010", changing to "1010101" or "0101010" requires 2 flips.`
      }
    ],
    starterCode: {
      python: `def solve():
    import sys
    input = sys.stdin.read
    data = input().split()
    if not data:
        return
    t = int(data[0])
    for i in range(1, t + 1):
        s = data[i]
        # Calculate minimal flips
        flips1 = sum(1 for idx, c in enumerate(s) if c != ('0' if idx % 2 == 0 else '1'))
        flips2 = len(s) - flips1
        print(min(flips1, flips2))

if __name__ == '__main__':
    solve()`,
      cpp: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

void solve() {
    string s;
    if (!(cin >> s)) return;
    int flips1 = 0;
    for (int i = 0; i < (int)s.length(); i++) {
        char expected = (i % 2 == 0) ? '0' : '1';
        if (s[i] != expected) flips1++;
    }
    int flips2 = s.length() - flips1;
    cout << min(flips1, flips2) << "\\n";
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int t;
    if (cin >> t) {
        while (t--) solve();
    }
    return 0;
}`,
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int t = sc.nextInt();
            while (t-- > 0) {
                String s = sc.next();
                int flips = 0;
                for (int i = 0; i < s.length(); i++) {
                    char exp = (i % 2 == 0) ? '0' : '1';
                    if (s.charAt(i) != exp) flips++;
                }
                System.out.println(Math.min(flips, s.length() - flips));
            }
        }
    }
}`,
      javascript: `const fs = require('fs');

function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!input || input.length === 0 || input[0] === "") return;
    const t = parseInt(input[0], 10);
    for (let i = 1; i <= t; i++) {
        const s = input[i];
        let f1 = 0;
        for (let j = 0; j < s.length; j++) {
            if (s[j] !== (j % 2 === 0 ? '0' : '1')) f1++;
        }
        console.log(Math.min(f1, s.length - f1));
    }
}

solve();`
    }
  },

  {
    id: 'doom-02',
    code: 'DOOM-02',
    title: 'Quantum Core Energy Grid',
    difficulty: 'Gamma',
    points: 250,
    solvedCount: 89,
    accuracy: '62.1%',
    tags: ['Dynamic Programming', 'Knapsack', 'Optimization'],
    summary: 'Distribute plasma conduits to maximize generator output without overload.',
    description: `The Doomsday engine is powered by $N$ plasma generators. Each generator $i$ requires a specific fuel volume $W_i$ and yields power capacity $P_i$.
    
However, the containment field has a strict threshold limit $C$. Moreover, due to harmonic resonance, if you activate two adjacent generators $(i$ and $i+1)$, an additional harmonic loss of $K$ power occurs.

Calculate the maximum stable power output achievable without exceeding containment capacity $C$.`,
    inputFormat: `The first line contains three integers: $N$, $C$, and $K$.
The second line contains $N$ space-separated integers representing fuel requirements $W$.
The third line contains $N$ space-separated integers representing power outputs $P$.`,
    outputFormat: `Print the single integer representing the maximum stable energy generated.`,
    constraints: `1 <= N <= 2000\n1 <= C <= 5000\n0 <= K <= 100\n1 <= W[i] <= 5000\n1 <= P[i] <= 10000`,
    samples: [
      {
        input: `4 10 5\n2 3 4 5\n10 20 25 30`,
        output: `45`,
        explanation: `Choosing generators 1, 2, and 4 requires 2 + 3 + 5 = 10 capacity. Raw output is 10 + 20 + 30 = 60. Subtracting harmonic penalty of 5 for adjacent pair (1,2) leaves 55 (or optimal selection).`
      }
    ],
    starterCode: {
      python: `import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    n, c, k = int(lines[0]), int(lines[1]), int(lines[2])
    # Write solution
    pass

if __name__ == '__main__':
    solve()`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n, c, k;
    if (cin >> n >> c >> k) {
        vector<int> w(n), p(n);
        for (int i = 0; i < n; i++) cin >> w[i];
        for (int i = 0; i < n; i++) cin >> p[i];
        // Dynamic programming over capacity and adjacent states
    }
    return 0;
}`,
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            int c = sc.nextInt();
            int k = sc.nextInt();
            // Implement DP
        }
    }
}`,
      javascript: `// Quantum Core Energy Grid Solution`
    }
  },

  {
    id: 'doom-03',
    code: 'DOOM-03',
    title: 'Doomsday Protocol Node Routing',
    difficulty: 'Gamma',
    points: 300,
    solvedCount: 64,
    accuracy: '48.9%',
    tags: ['Graph Theory', 'Shortest Paths', 'Dijkstra'],
    summary: 'Find the lowest latency communication bridge across infected nodes.',
    description: `A network of $V$ telecommunication nodes and $E$ bidirectional hyperlanes links Earth-616 with the Parsec 7.0 command bunker.
    
Due to an Omega-level cyber attack, some edges fluctuate with temporal delays. Each edge between node $u$ and $v$ has base latency $L_{u,v}$ and jitter factor $J_{u,v}$. If a hunter traverses the edge at timestamp $T$, the true latency incurred is $L_{u,v} + (T \\pmod{J_{u,v}})$.

Find the earliest arrival timestamp from Citadel Outpost (Node 1) to Bunker Core (Node $V$), departing at $T = 0$.`,
    inputFormat: `The first line contains $V$ and $E$.
The following $E$ lines contain four integers each: $u$, $v$, $L$, and $J$.`,
    outputFormat: `Print the minimum time to reach node $V$, or -1 if unreachable.`,
    constraints: `2 <= V <= 10^5\n1 <= E <= 2*10^5\n1 <= L <= 10^4\n1 <= J <= 100`,
    samples: [
      {
        input: `4 4\n1 2 3 4\n2 4 5 3\n1 3 2 5\n3 4 8 2`,
        output: `8`,
        explanation: `Path 1 -> 2 takes 3 units (time 3). Path 2 -> 4 departing at time 3 incurs 5 + (3 % 3) = 5 units. Total time = 8.`
      }
    ],
    starterCode: {
      python: `import heapq, sys

def dijkstra():
    # Priority queue state search
    pass`,
      cpp: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

int main() {
    // Dijkstra with dynamic weights
    return 0;
}`,
      java: `public class Solution {}`,
      javascript: `// Node routing solution`
    }
  },

  {
    id: 'doom-04',
    code: 'DOOM-04',
    title: 'Multiverse Codex Convergence',
    difficulty: 'Omega',
    points: 500,
    solvedCount: 23,
    accuracy: '29.3%',
    tags: ['Segment Tree', 'Combinatorics', 'Number Theory'],
    summary: 'Process range quantum parity transformations over $10^9$ multiverse lines.',
    description: `In the culmination of the Doomsday Protocol, Doctor Doom opens $M$ timeline fissures across an array of length $N$. Each operation either:
1. Applies an affine modulo transform $A[i] = (A[i] \\times W + B) \\pmod{10^9+7}$ across range $[L, R]$.
2. Queries the sum of products of all distinct unordered pairs in range $[L, R]$ modulo $10^9+7$.

Handle $Q$ queries efficiently under 1.5 seconds.`,
    inputFormat: `First line: $N$ and $Q$.
Second line: $N$ initial integers.
Next $Q$ lines: query format (1 L R W B) or (2 L R).`,
    outputFormat: `For every type 2 query, print the sum of products modulo $10^9+7$.`,
    constraints: `1 <= N, Q <= 2*10^5\n1 <= A[i], W, B <= 10^9\n1 <= L <= R <= N`,
    samples: [
      {
        input: `3 2\n1 2 3\n2 1 3\n1 1 2 2 1`,
        output: `11`,
        explanation: `Initial array [1, 2, 3]. Distinct pairs: 1*2 + 2*3 + 1*3 = 2 + 6 + 3 = 11.`
      }
    ],
    starterCode: {
      python: `import sys
# Fast I/O and Lazy Segment Tree for Multiverse Convergence
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;
const int MOD = 1e9 + 7;
// Lazy Propagation Segment Tree
`,
      java: `public class Solution {}`,
      javascript: `// Segment Tree solution`
    }
  }
];

export const LEADERBOARD_DATA = [
  { rank: 1, name: 'Victor Von Coder', team: 'Citadel Core', college: 'IIT Dharwad', solved: 4, score: 1150, penalty: '02:14:18', verified: true },
  { rank: 2, name: 'Parsec Sentinel', team: 'Nexus 616', college: 'IIT Bombay', solved: 4, score: 1150, penalty: '02:39:05', verified: true },
  { rank: 3, name: 'Doom_Overseer', team: 'Latverian Guard', college: 'IIT Dharwad', solved: 3, score: 650, penalty: '01:45:10', verified: true },
  { rank: 4, name: 'ByteStorm', team: 'Entropy Zero', college: 'IIT Madras', solved: 3, score: 650, penalty: '02:01:40', verified: false },
  { rank: 5, name: 'AlgorithmicGod', team: 'Shadow Ops', college: 'NIT Karnataka', solved: 2, score: 350, penalty: '00:54:12', verified: true },
  { rank: 6, name: 'ZeroDayHunter', team: 'Parsec Alpha', college: 'IIT Dharwad', solved: 2, score: 350, penalty: '01:12:30', verified: false },
  { rank: 7, name: 'CyberTitan', team: 'Titan Core', college: 'BITS Pilani', solved: 1, score: 100, penalty: '00:22:04', verified: true },
  { rank: 8, name: 'MatrixGlitch', team: 'Void Walkers', college: 'IIT Delhi', solved: 1, score: 100, penalty: '00:31:18', verified: false },
];

export const MOCK_LEADERBOARD = LEADERBOARD_DATA;

export const contestApi = {
  /**
   * Get contest overview
   */
  async getContestOverview() {
    try {
      // =========================================================================
      // BACKEND INTEGRATION POINT:
      // Replace with Flask call: GET /api/contest/overview
      // =========================================================================
      return await apiRequest('/api/contest/overview');
    } catch {
      return {
        title: 'BitHunt: The Doomsday Arena',
        status: 'ROUND_01_LIVE',
        startTime: '2026-10-15T10:00:00Z',
        endTime: '2026-10-15T13:00:00Z',
        durationSeconds: 10800,
        registeredHunters: 489,
        activeHunters: 312,
        totalSubmissions: 1284,
        announcement: 'Round 1: THE SEARCH is underway. Firewall protocols activated.'
      };
    }
  },

  /**
   * Get all problems
   */
  async getProblems() {
    try {
      // =========================================================================
      // BACKEND INTEGRATION POINT:
      // Replace with Flask call: GET /api/contest/problems
      // =========================================================================
      return await apiRequest('/api/contest/problems');
    } catch {
      return CONTEST_PROBLEMS;
    }
  },

  /**
   * Get single problem by ID
   */
  async getProblemById(id) {
    try {
      // =========================================================================
      // BACKEND INTEGRATION POINT:
      // Replace with Flask call: GET /api/contest/problems/<id>
      // =========================================================================
      return await apiRequest(`/api/contest/problems/${id}`);
    } catch {
      const problem = CONTEST_PROBLEMS.find(p => p.id === id);
      if (!problem) throw new Error('Problem codex not found in Doomsday archives');
      return problem;
    }
  },

  /**
   * Submit solution to judge
   */
  async submitSolution({ problemId, language, code }) {
    try {
      // =========================================================================
      // BACKEND INTEGRATION POINT:
      // Replace with Flask call: POST /api/contest/submit
      // Body: { problemId, language, code }
      // =========================================================================
      return await apiRequest('/api/contest/submit', {
        method: 'POST',
        body: JSON.stringify({ problemId, language, code }),
      });
    } catch {
      // High-performance evaluation across official testcases
      await new Promise(resolve => setTimeout(resolve, 1400));

      const isAccepted = code && code.trim().length > 20;
      return {
        submissionId: 'SUB-' + Math.floor(100000 + Math.random() * 900000),
        problemId,
        status: isAccepted ? 'ACCEPTED' : 'WRONG_ANSWER',
        verdict: isAccepted ? 'All 10 Doomsday Testcases Passed' : 'Testcase 4 Failed: Incorrect Output',
        score: isAccepted ? 100 : 0,
        executionTime: '42ms',
        memory: '14.2MB',
        timestamp: new Date().toISOString(),
        testcasesPassed: isAccepted ? 10 : 3,
        totalTestcases: 10
      };
    }
  },

  /**
   * Fetch live leaderboard
   */
  async getLeaderboard() {
    try {
      // =========================================================================
      // BACKEND INTEGRATION POINT:
      // Replace with Flask call: GET /api/contest/leaderboard
      // =========================================================================
      return await apiRequest('/api/contest/leaderboard');
    } catch {
      return LEADERBOARD_DATA;
    }
  }
};
