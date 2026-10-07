import {
  RecipePageData,
  Season,
  Category,
  MasterVariant,
  IngredientColumn,
  RecipeStep,
  QuickFacts,
  NutritionInfo,
} from '../types/recipe';
import { getDefaultPageBackgroundForSeason, getPageBackgroundById } from '../data/recipePageBackgrounds';

const VALID_SEASONS: Season[] = ['Frühling', 'Sommer', 'Herbst', 'Winter', 'Zeitlos'];
const VALID_CATEGORIES: Category[] = [
  'Frühstück & Bowls',
  'Hauptgerichte',
  'Snacks & Desserts',
  'Saucen & Basics',
  'Drinks',
];

/**
 * Generates a stable unique ID with randomUUID and fallback.
 */
export function generateUniqueId(prefix: string = 'id'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  const random = Math.random().toString(36).substring(2, 10);
  const time = Date.now().toString(36);
  return `${prefix}-${time}-${random}`;
}

/**
 * Calculates the required MasterVariant based on the number of steps (§8).
 * 1-6 -> 6, 7-8 -> 8, 9-10 -> 10, 11-12 -> 12.
 */
export function calculateMasterVariant(stepCount: number): MasterVariant {
  if (stepCount <= 6) return 6;
  if (stepCount <= 8) return 8;
  if (stepCount <= 10) return 10;
  return 12;
}

/**
 * Normalizes raw recipe data from AI generation or JSON import into a strictly valid RecipePageData object.
 */
export function normalizeRecipeData(raw: any): RecipePageData {
  if (!raw || typeof raw !== 'object') {
    raw = {};
  }

  // 1. Valid Season
  let season: Season = 'Frühling';
  if (VALID_SEASONS.includes(raw.season)) {
    season = raw.season;
  } else if (typeof raw.season === 'string') {
    const sLower = raw.season.toLowerCase();
    if (sLower.includes('sommer')) season = 'Sommer';
    else if (sLower.includes('herbst')) season = 'Herbst';
    else if (sLower.includes('winter')) season = 'Winter';
    else if (sLower.includes('zeitlos')) season = 'Zeitlos';
  }

  // 2. Valid Category
  let category: Category = 'Hauptgerichte';
  if (VALID_CATEGORIES.includes(raw.category)) {
    category = raw.category;
  } else if (typeof raw.category === 'string') {
    const cLower = raw.category.toLowerCase();
    if (cLower.includes('frühstück') || cLower.includes('bowl')) category = 'Frühstück & Bowls';
    else if (cLower.includes('snack') || cLower.includes('dessert')) category = 'Snacks & Desserts';
    else if (cLower.includes('sauce') || cLower.includes('basic')) category = 'Saucen & Basics';
    else if (cLower.includes('drink') || cLower.includes('getränk')) category = 'Drinks';
  }

  // 3. Normalized Tags (Exakt 4 Tags in GROSSBUCHSTABEN)
  let rawTags: string[] = Array.isArray(raw.tags) ? raw.tags : [];
  rawTags = rawTags
    .map(t => (typeof t === 'string' ? t.trim().toUpperCase() : ''))
    .filter(t => t.length > 0);

  const fallbackTags = ['SCHNELL', 'MEAL PREP', 'HIGH PROTEIN', 'HERZHAFT'];
  const normalizedTags: [string, string, string, string] = [
    rawTags[0] || fallbackTags[0],
    rawTags[1] || fallbackTags[1],
    rawTags[2] || fallbackTags[2],
    rawTags[3] || fallbackTags[3],
  ];

  // 4. Normalized Ingredient Columns (Unique IDs for groups & items)
  const normalizeColumn = (col: any, defaultHeader: string): IngredientColumn => {
    const groups = Array.isArray(col?.groups) ? col.groups : [];
    if (groups.length === 0) {
      return {
        groups: [
          {
            id: generateUniqueId('group'),
            header: defaultHeader,
            items: [
              {
                id: generateUniqueId('item'),
                amount: '1 Portion',
                name: 'Zutat',
              },
            ],
          },
        ],
      };
    }

    return {
      groups: groups.map((g: any, gIdx: number) => ({
        id: g?.id && !g.id.startsWith('g') ? g.id : generateUniqueId(`group-${gIdx + 1}`),
        header: typeof g?.header === 'string' && g.header.trim() ? g.header.trim().toUpperCase() : defaultHeader,
        items: Array.isArray(g?.items)
          ? g.items.map((item: any, iIdx: number) => ({
              id: item?.id && !item.id.startsWith('i') ? item.id : generateUniqueId(`item-${iIdx + 1}`),
              amount: typeof item?.amount === 'string' ? item.amount.trim() : '',
              name: typeof item?.name === 'string' && item.name.trim() ? item.name.trim() : 'Zutat',
              isGarnishCompact: Boolean(item?.isGarnishCompact),
            }))
          : [],
      })),
    };
  };

  const columnLeft = normalizeColumn(raw.columnLeft, 'HAUPTKOMPONENTE');
  const columnRight = normalizeColumn(raw.columnRight, 'BEILAGE & FINISH');

  // 5. Normalized Steps (Sequential stepNumber & Unique IDs)
  const rawSteps = Array.isArray(raw.steps) ? raw.steps : [];
  let steps: RecipeStep[] = rawSteps.map((s: any, idx: number) => {
    const stepNum = idx + 1;
    return {
      id: s?.id && !s.id.startsWith('s') ? s.id : generateUniqueId(`step-${stepNum}`),
      stepNumber: stepNum,
      title: typeof s?.title === 'string' && s.title.trim() ? s.title.trim().toUpperCase() : `SCHRITT ${stepNum}`,
      text: typeof s?.text === 'string' ? s.text.trim() : '',
    };
  });

  if (steps.length === 0) {
    steps = [
      {
        id: generateUniqueId('step-1'),
        stepNumber: 1,
        title: 'VORBEREITUNG',
        text: 'Zutaten bereitstellen und zubereiten.',
      },
    ];
  }

  // Cap steps at max 12 according to §8
  if (steps.length > 12) {
    steps = steps.slice(0, 12);
  }

  // Re-number steps sequentially
  steps = steps.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));

  // 6. MasterVariant from step count
  const masterVariant = calculateMasterVariant(steps.length);

  // 7. Page Background ID
  let pageBackgroundId = raw.pageBackgroundId;
  if (!pageBackgroundId || getPageBackgroundById(pageBackgroundId, season).id !== pageBackgroundId) {
    pageBackgroundId = getDefaultPageBackgroundForSeason(season).id;
  }

  // 8. QuickFacts
  const rawQf = raw.quickFacts || {};
  const quickFacts: QuickFacts = {
    portions: typeof rawQf.portions === 'string' || typeof rawQf.portions === 'number' ? rawQf.portions : '2 Portionen',
    activeTimeMin: Number(rawQf.activeTimeMin) || 15,
    passiveTimeMin: Number(rawQf.passiveTimeMin) || 15,
    totalTimeMin: Number(rawQf.totalTimeMin) || (Number(rawQf.activeTimeMin) || 15) + (Number(rawQf.passiveTimeMin) || 15),
    utensils: typeof rawQf.utensils === 'string' && rawQf.utensils.trim() ? rawQf.utensils.trim() : 'Pfanne, Schneidebrett, Messer',
  };

  // 9. NutritionInfo
  const rawNut = raw.nutrition || {};
  const nutrition: NutritionInfo = {
    calories: Number(rawNut.calories) || 450,
    carbs: Number(rawNut.carbs) || 40,
    protein: Number(rawNut.protein) || 30,
    fat: Number(rawNut.fat) || 15,
  };

  // 10. Photo URL
  const photoUrl =
    typeof raw.photoUrl === 'string' && raw.photoUrl.trim()
      ? raw.photoUrl.trim()
      : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

  const now = new Date().toISOString();

  return {
    id: typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : generateUniqueId('recipe'),
    title: typeof raw.title === 'string' && raw.title.trim() ? raw.title.trim() : 'NEUES SAISONREZEPT',
    season,
    category,
    tags: normalizedTags,
    photoUrl,
    photoAlt: typeof raw.photoAlt === 'string' ? raw.photoAlt : undefined,
    pageBackgroundId,
    customBackgroundId: typeof raw.customBackgroundId === 'string' ? raw.customBackgroundId : undefined,
    quickFacts,
    columnLeft,
    columnRight,
    steps,
    masterVariant,
    nutrition,
    watchOutTip: typeof raw.watchOutTip === 'string' && raw.watchOutTip.trim() ? raw.watchOutTip.trim() : 'Auf moderate Hitze achten, damit die Aromen optimal erhalten bleiben.',
    source: typeof raw.source === 'string' ? raw.source : undefined,
    footerText: typeof raw.footerText === 'string' && raw.footerText.trim() ? raw.footerText.trim() : 'AUS DEM BUCH „REZEPTE DURCHS JAHR“',
    notes: typeof raw.notes === 'string' ? raw.notes : undefined,
    photoAssetId: typeof raw.photoAssetId === 'string' ? raw.photoAssetId : undefined,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : now,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : now,
    savedAt: typeof raw.savedAt === 'string' ? raw.savedAt : undefined,
  };
}
