import { BackgroundCategory, CustomBackground } from '../types/backgrounds';

export const DEFAULT_BACKGROUND_CATEGORIES: BackgroundCategory[] = [
  {
    id: 'neutral',
    label: 'Standard / Neutral',
    description: 'Klassischer neutraler Hintergrund ohne saisonspezifische Tönung',
    accentColor: '#9c8e82',
  },
  {
    id: 'fruehling',
    label: 'Frühling',
    description: 'Frische, zarte Lichtstimmung, helles Naturleinen, sanfter weißer Marmor',
    accentColor: '#689f72',
  },
  {
    id: 'sommer',
    label: 'Sommer',
    description: 'Warme mediterrane Terrakotta, sonnendurchfluteter Kalkstein & Olivenholz',
    accentColor: '#d6833b',
  },
  {
    id: 'herbst',
    label: 'Herbst',
    description: 'Gedeckte warme Erdtöne, samtiges Walnussholz, matter Schiefer & Ocker',
    accentColor: '#b45d2f',
  },
  {
    id: 'winter',
    label: 'Winter',
    description: 'Klares nordisches Licht, matter Blauschiefer, kühles weißes Porzellan',
    accentColor: '#4f7b99',
  },
  {
    id: 'zeitlos',
    label: 'Zeitlos / Ganzjährig',
    description: 'Minimalistischer warmer Studio-Kalkstein, unaufdringliche Naturtexturen',
    accentColor: '#8a796b',
  },
];

export const DEFAULT_BACKGROUNDS: CustomBackground[] = [
  // Neutral Default
  {
    id: 'bg-neutral-standard',
    name: 'Neutraler Standard (#FFF7F0)',
    categoryId: 'neutral',
    description: 'Dezenter Studiountergrund, fügt sich 100% harmonisch in die Mastervorlage ein.',
    previewColor: '#FFF7F0',
    previewGradient: 'linear-gradient(135deg, #FFF7F0 0%, #F5ECE2 100%)',
    previewBorderColor: '#E5D7CA',
    backdropPrompt: 'Clean minimalist warm neutral culinary studio surface, soft diffused daylight, organic neutral linen, zero color cast.',
    mood: 'Neutral, minimalistisch, klassisch',
    isNeutralDefault: true,
  },

  // Frühling
  {
    id: 'bg-fruehling-leinen',
    name: 'Helles Frühlingsleinen & Morgensonne',
    categoryId: 'fruehling',
    description: 'Cremig-weißes Naturleinen mit sanftem, frischem Frühlingsstreiflicht.',
    previewColor: '#F4EFEA',
    previewGradient: 'linear-gradient(135deg, #F9F5F0 0%, #E8EFE6 100%)',
    previewBorderColor: '#D3DDD1',
    previewImageUrl: '/src/assets/images/spring_linen_preview_1791198793435.jpg',
    backdropPrompt: 'Light unbleached spring linen fabric surface, soft early morning window daylight, crisp fresh ambience, subtle hints of fresh green herbs.',
    mood: 'Frisch, hell, zart, natürlich',
  },
  {
    id: 'bg-fruehling-marmor',
    name: 'Sanfter weißer Carrara-Marmor',
    categoryId: 'fruehling',
    description: 'Matter, weicher weißer Naturstein mit feiner dezenter Äderung.',
    previewColor: '#ECECEB',
    previewGradient: 'linear-gradient(135deg, #F7F7F6 0%, #E7EAE6 100%)',
    previewBorderColor: '#CBD5CB',
    backdropPrompt: 'Matte honed white Carrara marble tabletop, delicate soft grey veining, airy diffused bright morning light, pristine organic culinary staging.',
    mood: 'Edel, luftig, klar, elegant',
  },

  // Sommer
  {
    id: 'bg-sommer-terrakotta',
    name: 'Mediterrane Terrakotta & Olivenholz',
    categoryId: 'sommer',
    description: 'Warmer getöpferter Ton und rustikales, sonnenverwöhntes Olivenholz.',
    previewColor: '#EED9C7',
    previewGradient: 'linear-gradient(135deg, #FBF2E9 0%, #EACDB8 100%)',
    previewBorderColor: '#DEC2AB',
    backdropPrompt: 'Warm sun-drenched terracotta tile and rustic olive wood surface, golden Mediterranean afternoon light, dry coastal herbs, warm rich tones.',
    mood: 'Sonnig, mediterran, warm, aromatisch',
  },
  {
    id: 'bg-sommer-kalkstein',
    name: 'Sonniger ägäischer Kalkstein',
    categoryId: 'sommer',
    description: 'Heller sandfarbener Kalkstein mit natürlicher Textur und warmen Schatten.',
    previewColor: '#F3ECE0',
    previewGradient: 'linear-gradient(135deg, #FAF5ED 0%, #EADDCB 100%)',
    previewBorderColor: '#D8C7B0',
    backdropPrompt: 'Aegean warm travertine limestone slab, direct warm summer sunlight with crisp soft shadows, breezy Mediterranean culinary backdrop.',
    mood: 'Lichtdurchflutet, urlaubshaft, warm',
  },

  // Herbst
  {
    id: 'bg-herbst-walnuss',
    name: 'Dunkles Walnussholz & Schiefer',
    categoryId: 'herbst',
    description: 'Tiefes warmes Walnussholz kombiniert mit mattem dunklem Naturschiefer.',
    previewColor: '#E2D3C4',
    previewGradient: 'linear-gradient(135deg, #ECE0D4 0%, #D4C1AF 100%)',
    previewBorderColor: '#C4AE9B',
    backdropPrompt: 'Rich dark walnut wood table surface with subtle aged matte slate coaster accent, warm ambient golden October glow, deep cozy autumn textures.',
    mood: 'Wärmend, erdig, gemütlich, tief',
  },
  {
    id: 'bg-herbst-ocker',
    name: 'Gedeckter Ocker & grobes Leinen',
    categoryId: 'herbst',
    description: 'Warme Kürbis- und Ockertöne mit rustikalem gewebtem Naturstoff.',
    previewColor: '#E6D7C3',
    previewGradient: 'linear-gradient(135deg, #F2E7D7 0%, #DFC9B0 100%)',
    previewBorderColor: '#CBB295',
    backdropPrompt: 'Coarse woven warm ochre linen cloth, handmade earthen ceramic tableware, warm dimming autumn daylight, comforting rustic atmosphere.',
    mood: 'Herbstlich, rustikal, behaglich',
  },

  // Winter
  {
    id: 'bg-winter-blauschiefer',
    name: 'Nordischer Blauschiefer & Gusseisen',
    categoryId: 'winter',
    description: 'Dunkler kühler Blauschiefer mit dezentem, schattenarmem Winterlicht.',
    previewColor: '#DEE4E8',
    previewGradient: 'linear-gradient(135deg, #EDF1F4 0%, #D1D9DE 100%)',
    previewBorderColor: '#B6C3CB',
    backdropPrompt: 'Nordic dark blue-grey slate slab, cool crisp low-angle winter daylight, matte dark cast iron accents, quiet minimalist Scandinavian aesthetic.',
    mood: 'Kühl, nordisch, minimalistisch, fokussiert',
  },
  {
    id: 'bg-winter-porzellan',
    name: 'Mattes weißes Porzellan & Silber',
    categoryId: 'winter',
    description: 'Reines mattes Porzellan mit kühler, eleganter Lichtführung.',
    previewColor: '#E8ECEE',
    previewGradient: 'linear-gradient(135deg, #F6F8F9 0%, #DDE3E6 100%)',
    previewBorderColor: '#C5D0D5',
    backdropPrompt: 'Matte cool white ceramic surface, pristine crisp winter lighting, delicate silver cutlery reflections, calm elegant seasonal backdrop.',
    mood: 'Puristisch, rein, elegant, winterlich',
  },

  // Zeitlos / Ganzjährig
  {
    id: 'bg-zeitlos-sandstein',
    name: 'Warmes Studio-Greige & Sandstein',
    categoryId: 'zeitlos',
    description: 'Ausgewogener Greige-Ton mit feinkörniger mineralischer Struktur.',
    previewColor: '#E8E2DA',
    previewGradient: 'linear-gradient(135deg, #F3EFE9 0%, #DDD5C9 100%)',
    previewBorderColor: '#CDC3B5',
    backdropPrompt: 'Fine-grained neutral greige sandstone tabletop, balanced neutral studio daylight, timeless editorial cookbook food photography surface.',
    mood: 'Universell, zeitlos, hochwertig, ausgewogen',
  },
  {
    id: 'bg-zeitlos-naturholz',
    name: 'Helle geölte Eiche',
    categoryId: 'zeitlos',
    description: 'Dezente Holzmaserung ohne aufdringliche Astlöcher oder Verfärbungen.',
    previewColor: '#EADFCF',
    previewGradient: 'linear-gradient(135deg, #F5EEE2 0%, #DECDB9 100%)',
    previewBorderColor: '#D0BC9F',
    backdropPrompt: 'Light natural oiled Scandinavian oak wood planks, soft natural overhead daylight, quiet minimal organic kitchen backdrop.',
    mood: 'Natürlich, wohnlich, unaufdringlich',
  },
];
