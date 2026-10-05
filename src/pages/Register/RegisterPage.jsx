import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Skull, User, Mail, Lock, Phone, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CyberButton } from '../../components/common/CyberButton';
import { GlassCard } from '../../components/common/GlassCard';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    teamName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }
    if (formData.password.length <= 8) {
      setError('Password must be more than 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2 rounded bg-doom-900/80 border border-doom-500/30 text-sm text-white focus:outline-none focus:border-doom-plasma font-mono';

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.08)_0%,transparent_65%)] pointer-events-none" />

      <div className="max-w-lg w-full relative z-10">
        <GlassCard className="p-8 space-y-6 border-doom-500/40 shadow-[0_0_50px_rgba(0,0,0,0.9)]">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#060908] border border-[#00e575]/40 mx-auto flex items-center justify-center text-[#00e575] shadow-lg">
              <Skull className="w-6 h-6" />
            </div>
            <div className="eyebrow-inscriptional text-[10px] text-metallic-400">
              Parsec 7.0 · Candidate Enlistment
            </div>
            <h1 className="heading-display-md text-2xl sm:text-3xl text-white">
              Candidate <span className="text-[#00e575]">Registration</span>
            </h1>
            <p className="body-clean text-xs text-metallic-400">
              Join the Doomsday Protocol. Maximum team size: 4 hunters.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded bg-red-950/80 border border-red-500/40 text-xs font-mono text-red-300">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-metallic-300 uppercase flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-doom-plasma" />
                  <span>Hunter Name</span>
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Victor Von Coder"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-metallic-300 uppercase flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-doom-plasma" />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="hunter@iitdh.ac.in"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-metallic-300 uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-doom-plasma" />
                <span>Security Cipher</span>
              </label>
              <input
                type="password"
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={inputClass}
                placeholder="More than 8 characters"
              />
            </div>

            {/* Phone + Team */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-metallic-300 uppercase flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-doom-plasma" />
                  <span>Phone (10 digits)</span>
                </label>
                <input
                  type="tel"
                  required
                  name="phone"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="9876543210"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-metallic-300 uppercase flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-doom-plasma" />
                  <span>Squad Name</span>
                </label>
                <input
                  type="text"
                  required
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Parsec Protocol"
                />
              </div>
            </div>

            <CyberButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? 'INITIALIZING CODEX...' : 'CONFIRM ENLISTMENT'}
            </CyberButton>
          </form>

          {/* Footer */}
          <div className="text-center pt-2 text-xs font-mono text-metallic-400">
            <span>Already an authorized hunter? </span>
            <Link to="/login" className="text-doom-plasma hover:underline font-bold">
              Access Terminal
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
