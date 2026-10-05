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
  description: string;
  // Visual appearance preview
  previewColor: string;
  previewGradient?: string;
  previewBorderColor?: string;
  previewImageUrl?: string; // Optionales fotografisches Vorschaubild der echten Kulisse
  // Photographic styling description (used for editorial consistency and AI photo generation)
  backdropPrompt: string;
  // Tone & mood
  mood: string;
  // Indicator for the neutral base fallback
  isNeutralDefault?: boolean;
  isCustomUserCreated?: boolean;
}
