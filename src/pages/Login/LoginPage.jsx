import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Skull, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CyberButton } from '../../components/common/CyberButton';
import { GlassCard } from '../../components/common/GlassCard';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // =========================================================================
      // BACKEND INTEGRATION POINT
      // Flask endpoint expected:
      // POST /api/auth/login
      // Body: { email, password }
      // =========================================================================
      await login(email || 'hunter@earth616.org', password || 'secure_pass');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Access Denied // Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center relative">
      {/* Radial green backdrop glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.08)_0%,transparent_65%)] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <GlassCard className="p-8 space-y-6 border-doom-500/40 shadow-[0_0_50px_rgba(0,0,0,0.9)]">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#060908] border border-[#00e575]/40 mx-auto flex items-center justify-center text-[#00e575] shadow-lg">
              <Skull className="w-6 h-6" />
            </div>
            <div className="eyebrow-inscriptional text-[10px] text-metallic-400">
              Parsec 7.0 · Candidate Authentication
            </div>
            <h1 className="heading-display-md text-2xl sm:text-3xl text-white">
              Citadel <span className="text-[#00e575]">Portal</span>
            </h1>
            <p className="body-clean text-xs text-metallic-400">
              Enter your credentials to access the Hunter Command Center.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded bg-red-950/80 border border-red-500/40 text-xs font-mono text-red-300">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-metallic-300 uppercase flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-doom-plasma" />
                <span>Hunter Identifier / Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded bg-doom-900/80 border border-doom-500/30 text-sm text-white focus:outline-none focus:border-doom-plasma focus:ring-1 focus:ring-doom-plasma font-mono transition-all"
                placeholder="hunter@iitdh.ac.in"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-metallic-300 uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-doom-plasma" />
                <span>Security Cipher</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded bg-doom-900/80 border border-doom-500/30 text-sm text-white focus:outline-none focus:border-doom-plasma focus:ring-1 focus:ring-doom-plasma font-mono transition-all"
                placeholder="••••••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-metallic-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-doom-700 bg-doom-950 text-doom-plasma focus:ring-0" />
                <span>Remember Terminal</span>
              </label>
              <a href="#forgot" className="text-doom-300 hover:text-doom-plasma hover:underline">
                Reset Cipher?
              </a>
            </div>

            <CyberButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? 'VERIFYING CREDENTIALS...' : 'ACCESS COMMAND CENTER'}
            </CyberButton>
          </form>

          {/* Alternative Google Sign In */}
          <div className="pt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-doom-800"></div>
              <span className="flex-shrink mx-3 text-[10px] font-mono text-metallic-500 uppercase">
                OR FEDERATED ACCESS
              </span>
              <div className="flex-grow border-t border-doom-800"></div>
            </div>

            <button
              type="button"
              onClick={() => {
                login('operative@iitdh.ac.in', 'auth_session_token');
                navigate('/dashboard');
              }}
              className="w-full mt-2 py-2.5 px-4 rounded bg-metallic-900/80 border border-metallic-700/60 hover:border-doom-plasma/60 text-xs font-orbitron text-metallic-200 flex items-center justify-center gap-2 transition-all hover:text-white"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.2C.7 9.6 0 12 0 12s.7 2.4 1.9 4.8l3.7-2.1z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.2 7.5 23 12 23z"/>
              </svg>
              <span>CONTINUE WITH GOOGLE</span>
            </button>
          </div>

          {/* Footer Register Link */}
          <div className="text-center pt-2 text-xs font-mono text-metallic-400">
            <span>New candidate? </span>
            <Link to="/register" className="text-doom-plasma hover:underline font-bold">
              Register for BitHunt
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
