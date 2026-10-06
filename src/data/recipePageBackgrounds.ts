import { Season } from '../types/recipe';

export interface RecipePageBackground {
  id: string;
  name: string;
  season: Season | 'Neutral';
  description: string;
  isDefault?: boolean;
  motifKey: string;
  accentColor: string;
}

export const RECIPE_PAGE_BACKGROUNDS: RecipePageBackground[] = [
  // ─── FRÜHLING (5 MOTIVE) ───────────────────────────────────
  {
    id: 'page-bg-fruehling-1',
    name: 'Frische Kräuter',
    season: 'Frühling',
    description: 'Basilikum- & Kräuterzweige mit frischen Blättern in den Ecken.',
    isDefault: true,
    motifKey: 'fruehling-kraeuter',
    accentColor: '#6E9864',
  },
  {
    id: 'page-bg-fruehling-2',
    name: 'Zarte Blätter',
    season: 'Frühling',
    description: 'Feine, leicht aquarellierte junge Blätter entlang des Seitenrandes.',
    motifKey: 'fruehling-blaetter',
    accentColor: '#7AA66E',
  },
  {
    id: 'page-bg-fruehling-3',
    name: 'Reduzierte Frühlingsblüten',
    season: 'Frühling',
    description: 'Dezente kleine Frühlingsblüten im reduzierten Editorial-Look.',
    motifKey: 'fruehling-blueten',
    accentColor: '#8EAA80',
  },
  {
    id: 'page-bg-fruehling-4',
    name: 'Botanical Line Art',
    season: 'Frühling',
    description: 'Sehr feine botanische Linienzeichnung mit sanften grünen Aquarellakzenten.',
    motifKey: 'fruehling-line-art',
    accentColor: '#5B7F52',
  },
  {
    id: 'page-bg-fruehling-5',
    name: 'Salbei-Aquarell',
    season: 'Frühling',
    description: 'Sehr weiche, diffuse Aquarellflächen in Salbei & zartem Lindgrün.',
    motifKey: 'fruehling-aquarell',
    accentColor: '#88B27F',
  },

  // ─── SOMMER (5 MOTIVE) ─────────────────────────────────────
  {
    id: 'page-bg-sommer-1',
    name: 'Kleiner Zitronenzweig',
    season: 'Sommer',
    description: 'Dezente Zitronenzweige mit kleiner Fruchtkontur im Randbereich.',
    motifKey: 'sommer-zitrone',
    accentColor: '#E29B38',
  },
  {
    id: 'page-bg-sommer-2',
    name: 'Olivenzweige',
    season: 'Sommer',
    description: 'Feine mediterrane Olivenzweige mit gedecktem Olivgrün am Rand.',
    isDefault: true,
    motifKey: 'sommer-oliven',
    accentColor: '#787352',
  },
  {
    id: 'page-bg-sommer-3',
    name: 'Rosmarin / Sommerkräuter',
    season: 'Sommer',
    description: 'Rosmarin- und Sommerkräuterzweige als elegante Randgestaltung.',
    motifKey: 'sommer-kraeuter',
    accentColor: '#8D7046',
  },
  {
    id: 'page-bg-sommer-4',
    name: 'Apricot-Honig-Aquarell',
    season: 'Sommer',
    description: 'Abstrakte sehr weiche Aquarellflächen in Honig, Apricot und Pfirsich.',
    motifKey: 'sommer-aquarell',
    accentColor: '#E6A35C',
  },
  {
    id: 'page-bg-sommer-5',
    name: 'Mediterrane botanische Line Art',
    season: 'Sommer',
    description: 'Feine organische mediterrane Formen und Pflanzenlinien am Rand.',
    motifKey: 'sommer-line-art',
    accentColor: '#BD8044',
  },

  // ─── HERBST (5 MOTIVE) ─────────────────────────────────────
  {
    id: 'page-bg-herbst-1',
    name: 'Elegantes Herbstlaub',
    season: 'Herbst',
    description: 'Feine botanische Herbstblätter in warmem Ocker & Terrakotta.',
    isDefault: true,
    motifKey: 'herbst-laub',
    accentColor: '#B85829',
  },
  {
    id: 'page-bg-herbst-2',
    name: 'Getrocknete Zweige',
    season: 'Herbst',
    description: 'Elegante feine Zweige mit einzelnen getrockneten Blättern am Rand.',
    motifKey: 'herbst-zweige',
    accentColor: '#965328',
  },
  {
    id: 'page-bg-herbst-3',
    name: 'Ocker-Terrakotta-Aquarell',
    season: 'Herbst',
    description: 'Sehr dezente organische Aquarellflächen in warmem Ocker & Terrakotta.',
    motifKey: 'herbst-aquarell',
    accentColor: '#C87B3E',
  },
  {
    id: 'page-bg-herbst-4',
    name: 'Herbst Botanical Line Art',
    season: 'Herbst',
    description: 'Feine Linienzeichnung von Blättern und Zweigen mit warmen Farbakzenten.',
    motifKey: 'herbst-line-art',
    accentColor: '#8C441E',
  },
  {
    id: 'page-bg-herbst-5',
    name: 'Warme organische Naturformen',
    season: 'Herbst',
    description: 'Reduzierte Kombination aus einzelnen Blättern und warmen Naturformen.',
    motifKey: 'herbst-natur',
    accentColor: '#A85A2A',
  },

  // ─── WINTER (5 MOTIVE) ─────────────────────────────────────
  {
    id: 'page-bg-winter-1',
    name: 'Kahle Winterzweige',
    season: 'Winter',
    description: 'Feine kahle Zweige in Rauchblau, Graublau und dezentem Winterfrost.',
    isDefault: true,
    motifKey: 'winter-zweige',
    accentColor: '#4F7285',
  },
  {
    id: 'page-bg-winter-2',
    name: 'Reduzierte Tannenzweige',
    season: 'Winter',
    description: 'Sehr dezente nordische Tannenzweige ohne Weihnachtsdekoration.',
    motifKey: 'winter-tannen',
    accentColor: '#436173',
  },
  {
    id: 'page-bg-winter-3',
    name: 'Eisblau-Rauchblau-Aquarell',
    season: 'Winter',
    description: 'Sehr weiche Aquarellflächen in Eisblau, Rauchblau und hellem Graublau.',
    motifKey: 'winter-aquarell',
    accentColor: '#6B8E9E',
  },
  {
    id: 'page-bg-winter-4',
    name: 'Nordic Botanical Line Art',
    season: 'Winter',
    description: 'Minimalistische botanische Linienzeichnung in kühlen Blautönen.',
    motifKey: 'winter-line-art',
    accentColor: '#3C5C6E',
  },
  {
    id: 'page-bg-winter-5',
    name: 'Abstrakte frostige Naturformen',
    season: 'Winter',
    description: 'Sehr abstrakte, weiche Winterformen in ruhigem Kaltton.',
    motifKey: 'winter-formen',
    accentColor: '#587B8C',
  },

  // ─── ZEITLOS (5 MOTIVE) ────────────────────────────────────
  {
    id: 'page-bg-zeitlos-1',
    name: 'Feine Leinenstruktur',
    season: 'Zeitlos',
    description: 'Subtile warme Leinenstruktur und feine Naturpapierfaser.',
    motifKey: 'zeitlos-leinen',
    accentColor: '#8C7B6E',
  },
  {
    id: 'page-bg-zeitlos-2',
    name: 'Organische Konturlinien',
    season: 'Zeitlos',
    description: 'Feine abstrakte organische Linien in Greige, Taupe und warmem Beige.',
    motifKey: 'zeitlos-linien',
    accentColor: '#7A6B5F',
  },
  {
    id: 'page-bg-zeitlos-3',
    name: 'Greige-Aquarell',
    season: 'Zeitlos',
    description: 'Sehr leichte abstrakte Steinton-Aquarellflächen.',
    motifKey: 'zeitlos-aquarell',
    accentColor: '#9C8C7E',
  },
  {
    id: 'page-bg-zeitlos-4',
    name: 'Monochrome botanische Kontur',
    season: 'Zeitlos',
    description: 'Extrem reduzierte monochrome botanische Line-Art.',
    motifKey: 'zeitlos-kontur',
    accentColor: '#6E5F53',
  },
  {
    id: 'page-bg-zeitlos-5',
    name: 'Minimal Paper',
    season: 'Zeitlos',
    description: 'Sehr ruhige Papier-/Steinstruktur mit dezenten organischen Formen.',
    isDefault: true,
    motifKey: 'zeitlos-paper',
    accentColor: '#807267',
  },

  // ─── NEUTRAL STANDARD ───────────────────────────────────────
  {
    id: 'page-bg-neutral',
    name: 'Neutral (#FFF7F0)',
    season: 'Neutral',
    description: 'Reiner warmer Cremegrund ohne saisonale Dekoration.',
    motifKey: 'neutral-clean',
    accentColor: '#9C8D80',
  },
];

/**
 * Returns the 5 backgrounds for a specific season + Neutral option
 */
export function getPageBackgroundsForSeason(season: Season): RecipePageBackground[] {
  const seasonal = RECIPE_PAGE_BACKGROUNDS.filter(b => b.season === season);
  const neutral = RECIPE_PAGE_BACKGROUNDS.find(b => b.season === 'Neutral');
  return neutral ? [...seasonal, neutral] : seasonal;
}

/**
 * Returns the default page background for a given season
 */
export function getDefaultPageBackgroundForSeason(season: Season): RecipePageBackground {
  const def = RECIPE_PAGE_BACKGROUNDS.find(b => b.season === season && b.isDefault);
  if (def) return def;

  const firstSeason = RECIPE_PAGE_BACKGROUNDS.find(b => b.season === season);
  if (firstSeason) return firstSeason;

  return RECIPE_PAGE_BACKGROUNDS[RECIPE_PAGE_BACKGROUNDS.length - 1];
}

/**
 * Resolves the background object by ID, falling back to season default if invalid or mismatched
 */
export function getPageBackgroundById(id?: string, season: Season = 'Frühling'): RecipePageBackground {
  if (id) {
    const found = RECIPE_PAGE_BACKGROUNDS.find(b => b.id === id);
    if (found) {
      if (found.season === season || found.season === 'Neutral') {
        return found;
      }
    }
  }
  return getDefaultPageBackgroundForSeason(season);
}
