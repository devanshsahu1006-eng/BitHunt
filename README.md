# BitHunt // Parsec 7.0 — Doomsday Protocol

> **"WHEN THE SYSTEM COLLAPSES, LOGIC BECOMES THE WEAPON."**  
> An immersive, cinematic event website for **BitHunt**, the premier competitive programming battle hosted by **Team Parsec, IIT Dharwad**, inspired by the **Avengers: Doomsday / Doctor Doom** cinematic aesthetic.

[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3.1-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.19-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.186.0-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-MIT-00e575?style=for-the-badge)](LICENSE)

---

## 🌟 Visual & Architectural Highlights

### 1. Continuous 3-Scene Cinematic Background System
Rather than basic slide toggling, BitHunt utilizes a continuous, scroll-synchronized background choreography:
- **Scene 1: Citadel Awakening** (`doom-scene-1.webp`) — Slow camera zoom-out, subtle upward pedestal drift, and anamorphic rack focus.
- **Scene 2: The Stance of Power** (`doom-scene-2.webp`) — Dynamic camera push-in, horizontal parallax drift, and intermittent emerald lightning surges.
- **Scene 3: Multiverse Cosmic Convergence** (`doom-scene-3.webp`) — Dramatic pull-back unveiling a colossal multiversal fracture with rich emerald cosmic radiance.
- **Atmospheric Particle Canvas** — 45 floating emerald embers and metallic dust particles reacting to scroll speed and micro-mouse parallax at a guaranteed 60 FPS.
- **Vignette Contrast Protection** — Layered obsidian gradient masks ensuring 100% legibility and crisp typographic contrast.

### 2. Inscriptional Roman Typography Redesign
Inspired by classical Roman lapidary inscriptions and cast-bronze institutional plaques (e.g. *Xavier's School for Gifted Youngsters*):
- **Monumental `BIT HUNT` Logotype** — Titanium-to-gunmetal linear gradient, carved relief drop shadows, custom kerning spacer, and restrained ambient emerald bounce.
- **Classical Display Serifs (`Cinzel` & `Marcellus`)** — Sharp, chisel-cut bracketed serifs with balanced thick-thin contrast for all major titles.
- **Clean Editorial Body (`Inter`)** — Modern, comfortable sans-serif with `1.75` line-height for effortless reading.
- **Centralized Styling** — All typography configurations live centrally in `src/styles/typography.css`.
- **Blur-to-Sharp Emergence** — Natural cinematic reveal animations without noisy CRT or glitch effects.

### 3. Authentic Event Intelligence
- **Event**: BitHunt (Parsec 7.0)
- **Institution**: Indian Institute of Technology (IIT) Dharwad
- **Format**: 2 Tiers (*The Search* & *The Conquest*), 3-Hour Duration
- **Architecture**: Open language support (C++, Python, Java, Rust, JavaScript)
- **Official Inquiries**: `7666804195`

### 4. Interactive Arena & Full Application Flow
- **Live Arena & Problem Codex** with difficulty filters and real-time standings.
- **In-Browser Code Editor & Judge Simulator** with test cases, execution time telemetry, and memory profiling.
- **Hunter Command Center / Dashboard** with live countdown to Parsec 7.0 and platform dispatches.
- **Candidate Enlistment & Portal** (Login & Registration).
- **Web Audio Ambient Synthesizer** generating procedural soundscapes and tactical UI clicks with mute control.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/<YOUR_USERNAME>/BitHunt.git

# Navigate to project root
cd BitHunt

# Install dependencies
npm install
```

### 3. Running Locally
```bash
# Start local Vite development server
npm run dev
```
Open your browser at `http://localhost:5173/`.

### 4. Building for Production
```bash
# Compile and optimize code-split production bundle
npm run build

# Preview the production build locally
npm run preview
```

---

## 🏛️ Project Directory Structure

```text
BitHunt/
├── public/
│   ├── favicon.svg                   # Doomsday emerald sigil
│   └── images/
│       ├── doom-bg.webp              # Opening portrait
│       ├── doom-scene-1.webp         # Scene 1: Citadel Awakening
│       ├── doom-scene-2.webp         # Scene 2: Power Stance & Lightning
│       └── doom-scene-3.webp         # Scene 3: Multiverse Cosmic Convergence
├── src/
│   ├── api/                          # Backend Integration & Mock Store
│   │   ├── client.js                 # Fetch wrapper with JWT & VITE_API_BASE_URL
│   │   ├── auth.js                   # Authentication endpoints
│   │   ├── event.js                  # Authentic BitHunt event info & FAQs
│   │   ├── contest.js                # Problem catalog, judge simulator, leaderboard
│   │   └── user.js                   # User profile & registration records
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── CinematicScrollBackground.jsx # 3-Scene continuous scroll background
│   │   │   └── SceneContainer.jsx    # WebGL canvas wrapper
│   │   ├── common/
│   │   │   ├── CyberButton.jsx       # Tactical button component
│   │   │   └── GlassCard.jsx         # Frosted metallic card container
│   │   ├── effects/
│   │   │   ├── CinematicLoader.jsx   # Progressive physical illumination intro
│   │   │   └── DoomCursor.jsx        # Subtle emerald particle disturbance cursor
│   │   └── navbar/
│   │       └── Navbar.jsx            # Editorial transparent-to-smoke navigation
│   ├── context/
│   │   ├── AuthContext.jsx           # User authentication provider
│   │   └── AudioContext.jsx          # Web Audio procedural sound engine
│   ├── pages/
│   │   ├── Landing/                  # Main cinematic landing page
│   │   │   ├── LandingPage.jsx
│   │   │   └── sections/             # Hero, Mission, Factions, Protocol, Rules, FAQ, Register
│   │   ├── Contest/                  # Competition arena & problem explorer
│   │   ├── Dashboard/                # Candidate Command Center
│   │   ├── Login/                    # Portal authentication
│   │   ├── Problem/                  # Interactive code editor & testcase evaluator
│   │   └── Register/                 # Candidate registration
│   ├── styles/
│   │   └── typography.css            # Centralized inscriptional Roman typography
│   ├── App.jsx                       # Routing configuration
│   ├── index.css                     # Global Tailwind & base styling
│   └── main.jsx                      # React 18 root mount
├── .env.example                      # Environment variables template
├── .gitignore                        # Git exclusion rules
├── index.html                        # HTML entry point with preloaded assets
├── package.json                      # Dependencies and scripts
├── tailwind.config.js                # Tailwind theme configuration
└── vite.config.js                    # Vite build configuration
```

---

## 🔌 Backend Integration (Flask / Node.js)

BitHunt includes a complete frontend API abstraction layer located in `src/api/`. By default, it operates with realistic client-side mock data so the website is immediately testable out of the box.

To connect to a live Flask backend:
1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
2. Set `VITE_API_BASE_URL` to your backend address:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```
3. Endpoints expected:
   - `POST /api/auth/login`
   - `POST /api/auth/register`
   - `GET /api/contest/problems`
   - `GET /api/contest/leaderboard`
   - `POST /api/contest/submit`

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub (see instructions below).
2. Go to [Vercel](https://vercel.com/) and import your `BitHunt` repository.
3. Keep default settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**.

### Deploy to Netlify
1. Connect your repository on [Netlify](https://netlify.com/).
2. Set:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Click **Deploy site**.

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
