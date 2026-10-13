import React, { useState } from 'react';
import { Season } from '../types/recipe';
import { getPageBackgroundById, getPageBackgroundImagePath } from '../data/recipePageBackgrounds';

interface SeasonalBackgroundLayerProps {
  pageBackgroundId?: string;
  season?: Season;
  isThumbnail?: boolean;
}

/**
 * Editorial Seasonal Background Layer.
 * - Base Warm Cream Paper: #FFF7F0
 * - High-resolution static PNG editorial artwork from /page-backgrounds/${id}.png
 * - Full coverage of A4 format (794x1123px or 100% in thumbnails)
 * - pointer-events: none, z-index: 0
 * - Clean handling for 'page-bg-neutral' (pure warm cream paper)
 * - Graceful fallback if image is missing or cannot be loaded
 */
export const SeasonalBackgroundLayer: React.FC<SeasonalBackgroundLayerProps> = ({
  pageBackgroundId,
  season = 'Frühling',
  isThumbnail = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const bg = getPageBackgroundById(pageBackgroundId, season);
  const imagePath = getPageBackgroundImagePath(bg.id);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${
        isThumbnail ? 'w-full h-full' : 'z-0'
      }`}
      style={{
        width: isThumbnail ? '100%' : '794px',
        height: isThumbnail ? '100%' : '1123px',
        backgroundColor: '#FFF7F0',
      }}
      aria-hidden="true"
    >
      {imagePath && !hasError && (
        <img
          src={imagePath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          onError={() => setHasError(true)}
          loading={isThumbnail ? 'lazy' : 'eager'}
          decoding="async"
        />
      )}
    </div>
  );
};
