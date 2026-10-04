import { RecipePageData } from '../types/recipe';

export const DEFAULT_RECIPES: RecipePageData[] = [
  {
    id: 'chicken-gyros-pita-bowl',
    title: 'CHICKEN GYROS PITA BOWL',
    season: 'Sommer',
    category: 'Hauptgerichte',
    tags: ['HIGH PROTEIN', 'SCHNELL', 'AIRFRYER', 'MEAL PREP'],
    photoUrl: '/src/assets/images/chicken_gyros_bowl_1791146799733.jpg',
    photoAlt: 'Chicken Gyros Pita Bowl mit Gurke, Tomaten, Hummus und Feta',
    quickFacts: {
      portions: '4 Portionen',
      activeTimeMin: 20,
      passiveTimeMin: 15,
      totalTimeMin: 35,
      utensils: 'Airfryer (oder Pfanne), Schüssel, Schneidebrett',
    },
    columnLeft: {
      groups: [
        {
          id: 'cg-marinade',
          header: 'CHICKEN GYROS',
          items: [
            { id: 'i1', amount: '600 g', name: 'Hähnchenbrust' },
            { id: 'i2', amount: '1½', name: 'Bio-Zitronen, Abrieb & Saft' },
            { id: 'i3', amount: '2 TL', name: 'Knoblauchpulver' },
            { id: 'i4', amount: '1 TL', name: 'Salz & schwarzer Pfeffer' },
            { id: 'i5', amount: 'optional', name: 'Paprikapulver edelsüß' },
            { id: 'i6', amount: '1 EL', name: 'Öl oder Ölspray' },
          ],
        },
      ],
    },
    columnRight: {
      groups: [
        {
          id: 'cg-filling',
          header: 'ZUM FÜLLEN',
          items: [
            { id: 'i7', amount: '4', name: 'Dinkel-Pitas' },
            { id: 'i8', amount: '1 große', name: 'Gurke' },
            { id: 'i9', amount: '3', name: 'Tomaten' },
            { id: 'i10', amount: '1 kleine', name: 'Rote Zwiebel' },
            { id: 'i11', amount: '120 g', name: 'Hummus' },
          ],
        },
        {
          id: 'cg-extras',
          header: 'EXTRAS',
          items: [
            { id: 'i12', name: 'Petersilie · Feta · Zitrone', isGarnishCompact: true },
            { id: 'i13', amount: 'optional', name: 'Tzatziki' },
          ],
        },
      ],
    },
    steps: [
      {
        id: 's1',
        stepNumber: 1,
        title: 'CHICKEN WÜRZEN',
        text: 'Hähnchen in mundgerechte Streifen schneiden und mit Zitronenabrieb, Zitronensaft, Knoblauch, Salz, Pfeffer und Paprikapulver gründlich marinieren.',
      },
      {
        id: 's2',
        stepNumber: 2,
        title: 'KNUSPRIG GAREN',
        text: 'Im vorgeheizten Airfryer bei 190 °C ca. 12–15 Min goldbraun backen (nach der Hälfte der Zeit schütteln) oder in einer heißen Pfanne scharf anbraten.',
      },
      {
        id: 's3',
        stepNumber: 3,
        title: 'GEMÜSE VORBEREITEN',
        text: 'Gurke und Tomaten in gleichmäßige Würfel schneiden, die rote Zwiebel halbieren und in hauchfeine Streifen schneiden.',
      },
      {
        id: 's4',
        stepNumber: 4,
        title: 'PITAS ERWÄRMEN',
        text: 'Dinkel-Pitas kurz toasten oder für ca. 2 Min im noch warmen Airfryer aufbacken, sodass sie außen leicht knusprig und innen weich bleiben.',
      },
      {
        id: 's5',
        stepNumber: 5,
        title: 'BOWL ANRICHTEN',
        text: 'Pitas nach Wunsch vierteln oder füllen: Boden mit cremigem Hummus bestreichen, Gyros-Hähnchen und knackiges Gemüse darauf anrichten.',
      },
      {
        id: 's6',
        stepNumber: 6,
        title: 'FINISH & SERVIEREN',
        text: 'Mit zerbröckeltem Feta, frisch gehackter Petersilie und Zitronenspalten garnieren. Nach Belieben mit Tzatziki verfeinern.',
      },
    ],
    masterVariant: 6,
    nutrition: {
      calories: 485,
      carbs: 46,
      protein: 48,
      fat: 12,
    },
    watchOutTip: 'Airfryer variieren. 2–3 Min früher prüfen; Hähnchen auf ca. 74 °C Kerntemperatur garen.',
    source: 'Originalrezept „Rezepte durchs Jahr“',
    footerText: 'REZEPTE DURCHS JAHR',
  },
  {
    id: 'cremige-kuerbis-gnocchi',
    title: 'CREMIGE KÜRBIS-GNOCCHI MIT SALBEI',
    season: 'Herbst',
    category: 'Hauptgerichte',
    tags: ['VEGETARISCH', 'ONE POT', 'WÄRMEND', 'SCHNELL'],
    photoUrl: '/src/assets/images/pumpkin_gnocchi_1791146812345.jpg',
    photoAlt: 'Cremige Kürbis-Gnocchi mit krossem Salbei und Pinienkernen',
    quickFacts: {
      portions: '2 Portionen',
      activeTimeMin: 15,
      passiveTimeMin: 10,
      totalTimeMin: 25,
      utensils: 'Große Pfanne, Pürierstab, Sparschäler',
    },
    columnLeft: {
      groups: [
        {
          id: 'sauce-group',
          header: 'KÜRBISSAUCE',
          items: [
            { id: 'kg1', amount: '400 g', name: 'Hokkaido-Kürbis (gewürfelt)' },
            { id: 'kg2', amount: '150 ml', name: 'Gemüsebrühe' },
            { id: 'kg3', amount: '100 ml', name: 'Hafersahne oder Kochsahne' },
            { id: 'kg4', amount: '1 Prise', name: 'Muskatnuss & Pfeffer' },
            { id: 'kg5', amount: 'nach Geschmack', name: 'Meersalz' },
          ],
        },
      ],
    },
    columnRight: {
      groups: [
        {
          id: 'gnocchi-group',
          header: 'GNOCCHI & TOPPING',
          items: [
            { id: 'kg6', amount: '500 g', name: 'Frische Gnocchi' },
            { id: 'kg7', amount: '1 EL', name: 'Olivenöl oder Butter' },
            { id: 'kg8', amount: '1 Handvoll', name: 'Frische Salbeiblätter' },
            { id: 'kg9', amount: '30 g', name: 'Pinienkerne' },
          ],
        },
        {
          id: 'finish-group',
          header: 'FINISH',
          items: [
            { id: 'kg10', amount: '40 g', name: 'Parmesan, frisch gerieben' },
            { id: 'kg11', amount: 'optional', name: 'Chiliflocken' },
          ],
        },
      ],
    },
    steps: [
      {
        id: 'ks1',
        stepNumber: 1,
        title: 'KÜRBIS GAREN',
        text: 'Hokkaido mit Schale klein würfeln und in kochender Gemüsebrühe ca. 10 Min weich köcheln lassen.',
      },
      {
        id: 'ks2',
        stepNumber: 2,
        title: 'SAUCE PÜRIEREN',
        text: 'Hafersahne und Muskat zum weichen Kürbis geben und mit dem Pürierstab samtig cremig aufmixen.',
      },
      {
        id: 'ks3',
        stepNumber: 3,
        title: 'SALBEI KRUSPRIG BRATEN',
        text: 'In einer großen Pfanne Olivenöl erhitzen. Salbeiblätter ca. 1 Min kross anbraten und herausnehmen.',
      },
      {
        id: 'ks4',
        stepNumber: 4,
        title: 'PINIENKERNE RÖSTEN',
        text: 'Pinienkerne in der Restwärme kurz goldbraun anrösten und zu den Salbeiblättern legen.',
      },
      {
        id: 'ks5',
        stepNumber: 5,
        title: 'GNOCCHI BRATEN',
        text: 'Gnocchi in die Pfanne geben und 4–5 Min rundherum mit schöner Kruste goldgelb braten.',
      },
      {
        id: 'ks6',
        stepNumber: 6,
        title: 'VEREINEN & ANRICHTEN',
        text: 'Kürbissauce unterrühren, kurz binden lassen und mit Salbei, Pinienkernen und Parmesan anrichten.',
      },
    ],
    masterVariant: 6,
    nutrition: {
      calories: 520,
      carbs: 68,
      protein: 16,
      fat: 18,
    },
    watchOutTip: 'Hokkaido muss nicht geschält werden. Sauce erst ganz zum Schluss abschmecken, da Parmesan nachsalzt.',
    source: 'Rezepte durchs Jahr · Herbstausgabe',
    footerText: 'REZEPTE DURCHS JAHR',
  },
  {
    id: 'berry-protein-bowl',
    title: 'BERRY PROTEIN BOWL',
    season: 'Frühling',
    category: 'Frühstück & Bowls',
    tags: ['HIGH PROTEIN', 'FLUFFIG', 'MEAL PREP', 'SCHNELL'],
    photoUrl: '/src/assets/images/berry_protein_bowl_1791146822339.jpg',
    photoAlt: 'Fluffige Berry Protein Quark Bowl mit frischen Beeren und Mandeln',
    quickFacts: {
      portions: '1 Portion',
      activeTimeMin: 5,
      passiveTimeMin: 0,
      totalTimeMin: 5,
      utensils: 'Rührschüssel, Handrührgerät, Esslöffel',
    },
    columnLeft: {
      groups: [
        {
          id: 'creme-group',
          header: 'FLUFFIGE CREME',
          items: [
            { id: 'bp1', amount: '300 g', name: 'Magerquark oder Skyr' },
            { id: 'bp2', amount: '30 g', name: 'Proteinpulver Vanille' },
            { id: 'bp3', amount: '50 ml', name: 'Mineralwasser (stark kohlensäurehaltig)' },
            { id: 'bp4', amount: '1 Spritzer', name: 'Zitronensaft' },
          ],
        },
      ],
    },
    columnRight: {
      groups: [
        {
          id: 'top-group',
          header: 'BEEREN & TOPPINGS',
          items: [
            { id: 'bp5', amount: '80 g', name: 'Frische Beeren (Blaubeeren, Himbeeren)' },
            { id: 'bp6', amount: '15 g', name: 'Mandelblättchen, geröstet' },
            { id: 'bp7', amount: '1 TL', name: 'Blütenhonig' },
            { id: 'bp8', amount: 'Deko', name: 'Frische Minzblättchen' },
          ],
        },
      ],
    },
    steps: [
      {
        id: 'bs1',
        stepNumber: 1,
        title: 'CREME AUFSCHLAGEN',
        text: 'Quark, Proteinpulver und stark kohlensäurehaltiges Mineralwasser mit dem Handrührgerät 2 Min luftig aufschlagen.',
      },
      {
        id: 'bs2',
        stepNumber: 2,
        title: 'AROMATISIEREN',
        text: 'Einen kleinen Spritzer Zitronensaft unterheben, um die Süße des Vanillepulvers frisch abzurunden.',
      },
      {
        id: 'bs3',
        stepNumber: 3,
        title: 'MANDELN ANRÖSTEN',
        text: 'Mandelblättchen in einer kleinen Pfanne ohne Fett kurz schwenken, bis sie zart duften und bräunen.',
      },
      {
        id: 'bs4',
        stepNumber: 4,
        title: 'BEEREN VORBEREITEN',
        text: 'Frische Beeren kurz vorsichtig abbrausen und auf Küchenpapier gründlich trocken tupfen.',
      },
      {
        id: 'bs5',
        stepNumber: 5,
        title: 'BOWL ANRICHTEN',
        text: 'Die fluffig geschlagene Creme in eine Schale streichen und die Beeren darauf verteilen.',
      },
      {
        id: 'bs6',
        stepNumber: 6,
        title: 'FINISH MIT HONIG',
        text: 'Mit gerösteten Mandelblättchen, frischer Minze und einem feinen Faden Blütenhonig toppen.',
      },
    ],
    masterVariant: 6,
    nutrition: {
      calories: 360,
      carbs: 24,
      protein: 52,
      fat: 5,
    },
    watchOutTip: 'Das kalte Sprudelwasser macht die Creme extrem volumig und samtig ohne Sahne oder Fett.',
    source: 'Rezepte durchs Jahr · Frühling',
    footerText: 'REZEPTE DURCHS JAHR',
  },
  {
    id: 'lachs-teriyaki-sesam',
    title: 'LACHS MIT TERIYAKI & BROKKOLI',
    season: 'Winter',
    category: 'Hauptgerichte',
    tags: ['HIGH PROTEIN', 'ASIASTYLE', 'MEAL PREP', 'SCHNELL'],
    photoUrl: '/src/assets/images/chicken_gyros_bowl_1791146799733.jpg', // can be customized or replaced
    photoAlt: 'Glacierter Teriyaki Lachs mit Sesam-Brokkoli und Jasminreis',
    quickFacts: {
      portions: '2 Portionen',
      activeTimeMin: 15,
      passiveTimeMin: 15,
      totalTimeMin: 30,
      utensils: 'Pfanne, kleiner Topf, Backpinsel',
    },
    columnLeft: {
      groups: [
        {
          id: 'lt-fish',
          header: 'LACHS & MARINADE',
          items: [
            { id: 'lt1', amount: '350 g', name: 'Lachsfilet (ohne Haut)' },
            { id: 'lt2', amount: '3 EL', name: 'Sojasauce' },
            { id: 'lt3', amount: '1 EL', name: 'Ahornsirup oder Mirin' },
            { id: 'lt4', amount: '1 TL', name: 'Sesamöl geröstet' },
            { id: 'lt5', amount: '1 TL', name: 'Ingwer, frisch gerieben' },
          ],
        },
      ],
    },
    columnRight: {
      groups: [
        {
          id: 'lt-veg',
          header: 'BROKKOLI & REIS',
          items: [
            { id: 'lt6', amount: '1 Kopf', name: 'Brokkoli (in Röschen)' },
            { id: 'lt7', amount: '150 g', name: 'Jasminreis' },
            { id: 'lt8', amount: '1 EL', name: 'Sesamsamen (schwarz & weiß)' },
            { id: 'lt9', amount: '2 Stangen', name: 'Frühlingszwiebeln' },
          ],
        },
      ],
    },
    steps: [
      {
        id: 'lts1',
        stepNumber: 1,
        title: 'REIS ANSETZEN',
        text: 'Jasminreis gründlich waschen und mit der 1,8-fachen Menge Wasser und etwas Salz ca. 15 Min quellen lassen.',
      },
      {
        id: 'lts2',
        stepNumber: 2,
        title: 'GLASUR EINKOCHEN',
        text: 'Sojasauce, Ahornsirup, geröstetes Sesamöl und geriebenen Ingwer in einem kleinen Topf 2 Min leicht sirupartig einkochen.',
      },
      {
        id: 'lts3',
        stepNumber: 3,
        title: 'BROKKOLI DÄMPFEN',
        text: 'Brokkoliröschen in kochendem Salzwasser ca. 3–4 Min bissfest blanchieren und eiskalt abschrecken.',
      },
      {
        id: 'lts4',
        stepNumber: 4,
        title: 'LACHS ANBRATEN',
        text: 'Lachsfilets trocken tupfen und in einer beschichteten Pfanne mit wenig Öl ca. 3 Min von der ersten Seite scharf anbraten.',
      },
      {
        id: 'lts5',
        stepNumber: 5,
        title: 'WENDEN & GLASIEREN',
        text: 'Lachs vorsichtig wenden, Herdhitze reduzieren und die Teriyaki-Glasur großzügig mit dem Backpinsel auftragen.',
      },
      {
        id: 'lts6',
        stepNumber: 6,
        title: 'BROKKOLI ANGLASIEREN',
        text: 'Den Brokkoli kurz zum Lachs in die Pfanne geben und im verbliebenen Teriyaki-Jus durchschwenken.',
      },
      {
        id: 'lts7',
        stepNumber: 7,
        title: 'BOWL ZUSAMMENSTELLEN',
        text: 'Den duftenden Reis in Schalen füllen, Brokkoli anlegen und den glasierten Lachs mittig platzieren.',
      },
      {
        id: 'lts8',
        stepNumber: 8,
        title: 'SESAM FINISH',
        text: 'Mit reichlich geröstetem Sesam und feinen Frühlingszwiebelringen bestreuen und sofort servieren.',
      },
    ],
    masterVariant: 8,
    nutrition: {
      calories: 580,
      carbs: 58,
      protein: 42,
      fat: 19,
    },
    watchOutTip: 'Lachs im Kern glasig halten (ca. 52 °C Kerntemperatur), damit er wunderbar saftig bleibt.',
    source: 'Rezepte durchs Jahr · Winterausgabe',
    footerText: 'REZEPTE DURCHS JAHR',
  },
];
