import React from 'react';
import { Season } from '../types/recipe';

export interface SeasonTagTheme {
  colors: [string, string, string, string, string];
  textColor: string;
  borderColor: string;
  description: string;
  cssGradient: string;
}

/**
 * Editorial multi-stop seasonal color palettes (4-5 cohesive tonal stops per season).
 * Inspired by high-end cookbook photography, organic materials, and gentle natural light.
 * Rendered strictly horizontal (90deg) per individual tag.
 */
export const SEASON_TAG_GRADIENTS: Record<Season, SeasonTagTheme> = {
  Frühling: {
    colors: ['#7BA672', '#8FB984', '#A5CB96', '#BEDBA8', '#D3E6BE'],
    textColor: '#173014', // Natural deep forest/herb dark green
    borderColor: 'rgba(95, 140, 85, 0.28)',
    description: 'Frisches Blattgrün, Salbei und junges Frühlingsgrün',
    cssGradient: 'linear-gradient(90deg, #7BA672 0%, #8FB984 25%, #A5CB96 50%, #BEDBA8 75%, #D3E6BE 100%)',
  },
  Sommer: {
    colors: ['#E5914A', '#EFA259', '#F4B36A', '#F8C57C', '#FBD694'],
    textColor: '#381A05', // Deep warm espresso brown for high editorial contrast
    borderColor: 'rgba(190, 105, 35, 0.25)',
    description: 'Pfirsich-Apricot, reife Sommerfrüchte und warmer Blütenhonig',
    cssGradient: 'linear-gradient(90deg, #E5914A 0%, #EFA259 25%, #F4B36A 50%, #F8C57C 75%, #FBD694 100%)',
  },
  Herbst: {
    colors: ['#BC5F2B', '#CA6F35', '#D68142', '#E19352', '#EAA665'],
    textColor: '#261105', // Deep warm chestnut espresso
    borderColor: 'rgba(160, 70, 25, 0.28)',
    description: 'Kürbisorange, warmes Terrakotta, Rost und warmes Ocker',
    cssGradient: 'linear-gradient(90deg, #BC5F2B 0%, #CA6F35 25%, #D68142 50%, #E19352 75%, #EAA665 100%)',
  },
  Winter: {
    colors: ['#557A8E', '#688E9E', '#7EA3B3', '#97BAC8', '#B2D2DE'],
    textColor: '#101E26', // Deep slate black for crisp contrast and consistency with all categories
    borderColor: 'rgba(60, 95, 115, 0.25)',
    description: 'Nordisches Schiefergraublau, kühles Eisblau und frostiges Hellblau',
    cssGradient: 'linear-gradient(90deg, #557A8E 0%, #688E9E 25%, #7EA3B3 50%, #97BAC8 75%, #B2D2DE 100%)',
  },
  Zeitlos: {
    colors: ['#8F7A6C', '#9F8B7D', '#B09D90', '#C1B0A3', '#D2C3B7'],
    textColor: '#2B211A', // Deep warm taupe
    borderColor: 'rgba(120, 100, 85, 0.25)',
    description: 'Naturleinen, warmes Greige, Kalkstein und Sandstein',
    cssGradient: 'linear-gradient(90deg, #8F7A6C 0%, #9F8B7D 25%, #B09D90 50%, #C1B0A3 75%, #D2C3B7 100%)',
  },
};

/**
 * Returns the CSS properties for an individual tag with a smooth 5-stop horizontal gradient
 */
export function getSeasonTagStyle(season: Season | string | undefined): React.CSSProperties {
  const theme =
    (season && SEASON_TAG_GRADIENTS[season as Season]) ||
    SEASON_TAG_GRADIENTS['Zeitlos'];

  return {
    background: theme.cssGradient,
    color: theme.textColor,
    borderColor: theme.borderColor,
  };
}

/**
 * Reusable SeasonTag component adhering to editorial cookbook design guidelines
 */
export const SeasonTag: React.FC<{
  tag: string;
  season: Season | string | undefined;
  className?: string;
}> = ({ tag, season, className = '' }) => {
  const style = getSeasonTagStyle(season);

  return (
    <span
      style={style}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${className}`}
    >
      {tag}
    </span>
  );
};
