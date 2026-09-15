import React from 'react';
import { useAudio } from '../../context/AudioContext';

/**
 * CyberButton
 * High-tech chamfered button with emerald plasma border and energy glow
 */
export const CyberButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  icon: Icon,
  href,
  ...props
}) => {
  const { playClick, playHover } = useAudio();

  const baseStyles = "relative inline-flex items-center justify-center font-orbitron uppercase tracking-wider font-semibold transition-all duration-300 select-none group focus:outline-none";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-6 py-2.5 text-sm gap-2",
    lg: "px-8 py-3.5 text-base gap-3",
    xl: "px-10 py-4 text-lg gap-3",
  };

  const variantStyles = {
    primary: "bg-doom-plasma text-doom-950 font-bold hover:bg-white hover:text-black shadow-[0_0_20px_rgba(0,255,136,0.5)] hover:shadow-[0_0_35px_rgba(0,255,136,0.85)] border border-doom-electric",
    secondary: "bg-doom-900/80 text-doom-plasma border border-doom-plasma/40 hover:border-doom-plasma hover:bg-doom-800/90 shadow-[0_0_15px_rgba(0,255,136,0.2)] hover:shadow-[0_0_25px_rgba(0,255,136,0.4)]",
    metallic: "bg-metallic-800/80 text-metallic-200 border border-metallic-600/50 hover:border-doom-plasma/60 hover:text-doom-plasma hover:bg-metallic-700/80",
    danger: "bg-red-950/80 text-red-400 border border-red-500/50 hover:bg-red-900/90 hover:border-red-400 hover:text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
    ghost: "bg-transparent text-metallic-300 hover:text-doom-plasma hover:bg-doom-950/50 border border-transparent hover:border-doom-plasma/30",
  };

  const clipClass = size === 'sm' ? 'hud-clip-sm' : 'hud-chamfer';

  const handleClick = (e) => {
    if (disabled) return;
    playClick();
    if (onClick) onClick(e);
  };

  const handleMouseEnter = () => {
    if (!disabled) playHover();
  };

  const content = (
    <>
      {/* Corner tech notch highlight */}
      <span className="absolute top-0 right-0 w-2 h-2 bg-white/20 pointer-events-none group-hover:bg-white transition-colors" />
      {Icon && <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${clipClass} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
        }`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${clipClass} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {content}
    </button>
  );
};
