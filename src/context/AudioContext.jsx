import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContextState = createContext(null);

export const AudioProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true);
  const audioCtxRef = useRef(null);
  const ambientOscRef = useRef(null);
  const ambientGainRef = useRef(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Start low-frequency sci-fi hum
  const startAmbientHum = () => {
    if (isMuted) return;
    initAudio();
    if (!audioCtxRef.current) return;

    try {
      if (ambientOscRef.current) return; // already active

      const ctx = audioCtxRef.current;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Deep cinematic drone
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, ctx.currentTime); // 55Hz (A1)

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(110, ctx.currentTime); // 110Hz (A2)

      // Lowpass filter to keep it moody and atmospheric
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, ctx.currentTime);
      filter.Q.setValueAtTime(4, ctx.currentTime);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      ambientOscRef.current = [osc1, osc2];
      ambientGainRef.current = gain;
    } catch (e) {
      console.warn('Audio synthesis notice:', e);
    }
  };

  const stopAmbientHum = () => {
    if (ambientOscRef.current) {
      try {
        ambientOscRef.current.forEach(osc => osc.stop());
      } catch {
        // already stopped
      }
      ambientOscRef.current = null;
      ambientGainRef.current = null;
    }
  };

  const toggleMute = () => {
    initAudio();
    setIsMuted(prev => {
      const next = !prev;
      if (next) {
        stopAmbientHum();
      } else {
        setTimeout(() => startAmbientHum(), 100);
      }
      return next;
    });
  };

  // High-tech UI click chirp
  const playClick = () => {
    if (isMuted) return;
    initAudio();
    if (!audioCtxRef.current) return;

    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio context may be restricted
    }
  };

  // Tech hover chirp
  const playHover = () => {
    if (isMuted) return;
    initAudio();
    if (!audioCtxRef.current) return;

    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // Audio context restricted
    }
  };

  // Doctor Doom power surge / ocular ignition sound
  const playEnergySurge = () => {
    if (isMuted) return;
    initAudio();
    if (!audioCtxRef.current) return;

    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.6);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {}
  };

  // Success chime
  const playSuccess = () => {
    if (isMuted) return;
    initAudio();
    if (!audioCtxRef.current) return;

    try {
      const ctx = audioCtxRef.current;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
      });
    } catch {}
  };

  useEffect(() => {
    return () => stopAmbientHum();
  }, []);

  return (
    <AudioContextState.Provider value={{ isMuted, toggleMute, playClick, playHover, playEnergySurge, playSuccess }}>
      {children}
    </AudioContextState.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContextState);
  if (!context) {
    return {
      isMuted: true,
      toggleMute: () => {},
      playClick: () => {},
      playHover: () => {},
      playEnergySurge: () => {},
      playSuccess: () => {}
    };
  }
  return context;
};
