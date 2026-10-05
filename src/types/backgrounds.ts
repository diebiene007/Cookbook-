import { Season } from './recipe';

export interface BackgroundCategory {
  id: string;
  label: string;
  description: string;
  accentColor: string;
  isCustom?: boolean;
}

export interface CustomBackground {
  id: string;
  name: string;
  categoryId: string; // e.g. 'fruehling', 'sommer', 'herbst', 'winter', 'zeitlos', or custom
  season?: Season;
  description: string;
  // Visual appearance preview
  previewColor: string;
  previewGradient?: string;
  previewBorderColor?: string;
  // Photographic styling description (used for editorial consistency and AI photo generation)
  backdropPrompt: string;
  // Tone & mood
  mood: string;
  // Indicator for the neutral base fallback or season default
  isNeutralDefault?: boolean;
  isSeasonalDefault?: boolean;
  isCustomUserCreated?: boolean;
  // Specific visual motif key for SVG rendering in MasterRecipePage
  motifKey?: string;
}
