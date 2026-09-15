import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AudioProvider } from './context/AudioContext';
import { DoomCursor } from './components/effects/DoomCursor';
import { ScanlineOverlay } from './components/effects/ScanlineOverlay';
import { CinematicLoader } from './components/effects/CinematicLoader';
import { Navbar } from './components/navbar/Navbar';

// Lazy-loaded routes for 60fps performance and code splitting
const LandingPage = lazy(() => import('./pages/Landing/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./pages/Login/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/Register/RegisterPage').then(m => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ContestPage = lazy(() => import('./pages/Contest/ContestPage').then(m => ({ default: m.ContestPage })));
const ProblemPage = lazy(() => import('./pages/Problem/ProblemPage').then(m => ({ default: m.ProblemPage })));

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-doom-950 text-doom-plasma font-mono text-xs">
    <div className="flex items-center gap-3">
      <span className="w-2.5 h-2.5 rounded-full bg-doom-plasma animate-ping" />
      <span>TRANSITIONING CODEX INTERFACE...</span>
    </div>
  </div>
);

export default function App() {
  const [bootSequenceComplete, setBootSequenceComplete] = useState(false);

  return (
    <AuthProvider>
      <AudioProvider>
        <Router>
          {/* Initial Cinematic Marvel / Doomsday boot sequence */}
          {!bootSequenceComplete && (
            <CinematicLoader onComplete={() => setBootSequenceComplete(true)} />
          )}

          {/* Persistent Visual Effects Layer */}
          <DoomCursor />
          <ScanlineOverlay />

          {/* Header Navigation */}
          <Navbar />

          {/* Main Routing Architecture with Suspense */}
          <main className="relative z-10">
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/contest" element={<ContestPage />} />
                <Route path="/contest/problem/:id" element={<ProblemPage />} />
              </Routes>
            </Suspense>
          </main>
        </Router>
      </AudioProvider>
    </AuthProvider>
  );
}
