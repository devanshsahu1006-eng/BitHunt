import React, { useEffect, useRef, useState } from 'react';

/**
 * EnvironmentalDisturbanceCursor
 * Sophisticated, restrained energy cursor that subtly disturbs the atmospheric environment.
 * Almost invisible during normal movement; intensifies softly on interactive elements and clicks.
 */
export const DoomCursor = () => {
  const [isTouch, setIsTouch] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef(null);

  const mouse = useRef({ x: -200, y: -200 });
  const cursor = useRef({ x: -200, y: -200, vx: 0, vy: 0, speed: 0 });
  const particles = useRef([]);
  const shockwaves = useRef([]);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) {
      setIsTouch(true);
      return;
    }

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      const target = e.target;
      const isClickable = target.closest('button, a, input, select, textarea, [role="button"], .interactive-target');
      setIsHovered(!!isClickable);

      // Only spawn subtle disturbance particles if hovering or moving with high velocity
      const currentSpeed = cursor.current.speed;
      const shouldSpawn = isClickable || currentSpeed > 8;

      if (shouldSpawn && Math.random() < (isClickable ? 0.6 : 0.25)) {
        particles.current.push({
          x: cursor.current.x + (Math.random() - 0.5) * 6,
          y: cursor.current.y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.8 - cursor.current.vx * 0.05,
          vy: (Math.random() - 0.5) * 0.8 - cursor.current.vy * 0.05 - 0.2, // faint upward drift
          size: Math.random() * 2 + 1,
          alpha: isClickable ? 0.45 : 0.18,
          decay: 0.025,
          color: '#00e575'
        });
      }
    };

    const onMouseDown = (e) => {
      // Gentle, refined energy shockwave pulse on click
      shockwaves.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 2,
        maxRadius: 32,
        alpha: 0.6,
        lineWidth: 1.5
      });

      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.2;
        const speed = Math.random() * 2 + 1;
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2 + 1,
          alpha: 0.6,
          decay: 0.035,
          color: '#10b981'
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);

    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const prevX = cursor.current.x;
      const prevY = cursor.current.y;
      // Smooth interpolation (lerp 0.16)
      cursor.current.x += (mouse.current.x - cursor.current.x) * 0.16;
      cursor.current.y += (mouse.current.y - cursor.current.y) * 0.16;
      cursor.current.vx = cursor.current.x - prevX;
      cursor.current.vy = cursor.current.y - prevY;
      cursor.current.speed = Math.hypot(cursor.current.vx, cursor.current.vy);

      const { x, y } = cursor.current;

      // Draw subtle shockwaves
      for (let i = shockwaves.current.length - 1; i >= 0; i--) {
        const sw = shockwaves.current[i];
        sw.radius += 1.6;
        sw.alpha -= 0.035;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwaves.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 229, 117, ${sw.alpha})`;
        ctx.lineWidth = sw.lineWidth;
        ctx.stroke();
        ctx.restore();
      }

      // Draw faint disturbance smoke particles
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.size *= 0.98;

        if (p.alpha <= 0 || p.size < 0.4) {
          particles.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.restore();
      }

      // Draw faint atmospheric energy halo ONLY when hovering an interactive anchor
      if (isHovered && mouse.current.x > 0) {
        ctx.save();
        const aura = ctx.createRadialGradient(x, y, 2, x, y, 20);
        aura.addColorStop(0, 'rgba(0, 229, 117, 0.25)');
        aura.addColorStop(1, 'rgba(0, 229, 117, 0)');
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fillStyle = aura;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#f8fafc';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00e575';
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('resize', resize);
    };
  }, [isHovered]);

  if (isTouch) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 transition-opacity duration-300"
      aria-hidden="true"
    />
  );
};
