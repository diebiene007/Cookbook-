export type Season = 'Frühling' | 'Sommer' | 'Herbst' | 'Winter' | 'Zeitlos';

export type Category = 
  | 'Frühstück & Bowls' 
  | 'Hauptgerichte' 
  | 'Snacks & Desserts' 
  | 'Saucen & Basics' 
  | 'Drinks';

export type MasterVariant = 6 | 8 | 10 | 12;

export interface IngredientItem {
  id: string;
  amount?: string;
  name: string;
  isGarnishCompact?: boolean;
}

export interface IngredientGroup {
  id: string;
  header: string; // e.g. "CHICKEN GYROS", "ZUM FÜLLEN", "EXTRAS"
  items: IngredientItem[];
}

export interface IngredientColumn {
  groups: IngredientGroup[];
}

export interface RecipeStep {
  id: string;
  stepNumber: number;
  title: string; // KURZER TITEL IN GROSSBUCHSTABEN
  text: string;  // Kurzer präziser Handlungstext
}

export interface QuickFacts {
  portions: string | number; // e.g. "4 Portionen" or 4
  activeTimeMin: number;
  passiveTimeMin: number;
  totalTimeMin: number;
  utensils: string;
}

export interface NutritionInfo {
  calories: number; // kcal pro Portion
  carbs: number;    // g pro Portion
  protein: number;  // g pro Portion
  fat: number;      // g pro Portion
}

export interface RecipePageData {
  id: string;
  title: string;
  season: Season;
  category: Category;
  tags: [string, string, string, string]; // Exakt 4 Tags in GROSSBUCHSTABEN
  photoUrl: string;
  photoAlt?: string;
  pageBackgroundId?: string; // Saisonaler A4-Rezeptseiten-Hintergrund (5 Motive je Saison + Neutral)
  customBackgroundId?: string; // Optionaler Food-Foto Backdrop Stilmuster
  quickFacts: QuickFacts;
  columnLeft: IngredientColumn;
  columnRight: IngredientColumn;
  steps: RecipeStep[];
  masterVariant: MasterVariant;
  nutrition: NutritionInfo;
  watchOutTip: string;
  source?: string;
  footerText: string;
  notes?: string;
  photoAssetId?: string;
  createdAt?: string;
  updatedAt?: string;
  savedAt?: string;
}

export type QualityCheckStatus = 'passed' | 'failed' | 'unchecked';

export interface QualityCheckItem {
  id: string;
  number: number;
  label: string;
  rule: string;
  category: 'Masterlayout' | 'Metadaten' | 'Auf einen Blick' | 'Zutaten' | 'Zubereitung' | 'Nährwerte & Tipps' | 'Foto & Finish';
  status: QualityCheckStatus;
  passed: boolean; // status === 'passed'
  message: string;
  canAutoFix?: boolean;
  autoFixAction?: string;
}

export interface QualityReport {
  items: QualityCheckItem[];
  passedCount: number;
  uncheckedCount: number;
  failedCount: number;
  totalCount: number;
  isReadyForPublish: boolean;
}
