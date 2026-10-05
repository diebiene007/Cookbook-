import React from 'react';
import { Season } from '../types/recipe';
import { SeasonalBackgroundLayer } from './SeasonalBackgroundLayer';

interface SeasonalBackgroundThumbnailProps {
  pageBackgroundId: string;
  season: Season | 'Neutral';
  className?: string;
}

/**
 * Renders an exact miniature visual thumbnail of the recipe page background artwork.
 */
export const SeasonalBackgroundThumbnail: React.FC<SeasonalBackgroundThumbnailProps> = ({
  pageBackgroundId,
  season,
  className = 'w-10 h-14',
}) => {
  const effectiveSeason: Season = season === 'Neutral' ? 'Frühling' : season;

  return (
    <div
      className={`relative rounded-md border border-[#44382e] overflow-hidden shrink-0 shadow-xs select-none bg-[#FFF7F0] ${className}`}
      style={{
        aspectRatio: '794 / 1123',
      }}
    >
      <SeasonalBackgroundLayer
        pageBackgroundId={pageBackgroundId}
        season={effectiveSeason}
        isThumbnail={true}
      />
    </div>
  );
};
