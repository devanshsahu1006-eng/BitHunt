import React from 'react';

/**
 * AtmosphericFilmOverlay
 * A quiet, elegant film grain and vignette overlay that lends photographic depth
 * without artificial technical HUD clutter.
 */
export const ScanlineOverlay = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden" aria-hidden="true">
      {/* Subtle organic film grain */}
      <div className="absolute inset-0 film-grain opacity-60" />

      {/* Deep cinematic edge vignette */}
      <div className="absolute inset-0 cinematic-vignette" />
    </div>
  );
};
