import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback intelligent parser if API key is not active
function ruleBasedParseRecipe(rawText: string) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const firstLine = lines[0] || 'REZEPTE DURCHS JAHR GERICHT';
  const title = firstLine.replace(/^[#*\s-]+/, '').toUpperCase().slice(0, 45);

  let season = 'Zeitlos';
  const lower = rawText.toLowerCase();
  if (lower.includes('spargel') || lower.includes('bärlauch') || lower.includes('frühling') || lower.includes('erdbeer')) {
    season = 'Frühling';
  } else if (lower.includes('sommer') || lower.includes('tomate') || lower.includes('zitrone') || lower.includes('grill') || lower.includes('pita') || lower.includes('gyros')) {
    season = 'Sommer';
  } else if (lower.includes('kürbis') || lower.includes('herbst') || lower.includes('pilz') || lower.includes('apfel') || lower.includes('maronen')) {
    season = 'Herbst';
  } else if (lower.includes('winter') || lower.includes('zimt') || lower.includes('eintopf') || lower.includes('rotkohl')) {
    season = 'Winter';
  }

  let category = 'Hauptgerichte';
  if (lower.includes('müsli') || lower.includes('bowl') || lower.includes('pancake') || lower.includes('quark') || lower.includes('frühstück')) {
    category = 'Frühstück & Bowls';
  } else if (lower.includes('kuchen') || lower.includes('cookie') || lower.includes('dessert') || lower.includes('riegel')) {
    category = 'Snacks & Desserts';
  } else if (lower.includes('sauce') || lower.includes('dip') || lower.includes('pesto') || lower.includes('dressing')) {
    category = 'Saucen & Basics';
  } else if (lower.includes('smoothie') || lower.includes('shake') || lower.includes('drink') || lower.includes('tee')) {
    category = 'Drinks';
  }

  // Tags
  const tags: [string, string, string, string] = ['SCHNELL', 'MEAL PREP', 'HIGH PROTEIN', 'HERZHAFT'];
  if (lower.includes('airfryer') || lower.includes('heißluft')) tags[2] = 'AIRFRYER';
  else if (lower.includes('one pot') || lower.includes('one-pot')) tags[2] = 'ONE POT';
  else if (lower.includes('vegan')) tags[2] = 'VEGAN';
  else if (lower.includes('vegetarisch') || lower.includes('fleischlos')) tags[2] = 'VEGETARISCH';

  return {
    title,
    season,
    category,
    tags,
    quickFacts: {
      portions: 2,
      activeTimeMin: 15,
      passiveTimeMin: 15,
      totalTimeMin: 30,
      utensils: 'Pfanne, Schneidebrett, Schüssel',
    },
    columnLeft: {
      groups: [
        {
          id: 'g1',
          header: 'BASIS ZUTATEN',
          items: [
            { id: 'i1', amount: '400 g', name: 'Hauptzutat nach Wahl' },
            { id: 'i2', amount: '1 EL', name: 'Olivenöl oder Ölspray' },
            { id: 'i3', amount: '1 Prise', name: 'Salz & schwarzer Pfeffer' },
          ],
        },
      ],
    },
    columnRight: {
      groups: [
        {
          id: 'g2',
          header: 'ZUM SERVIEREN',
          items: [
            { id: 'i4', amount: '1 Bund', name: 'Frische Kräuter' },
            { id: 'i5', amount: 'optional', name: 'Zitronenspalten & Topping' },
          ],
        },
      ],
    },
    steps: [
      { id: 's1', stepNumber: 1, title: 'ZUTATEN VORBEREITEN', text: 'Alle Zutaten waschen, zerkleinern und griffbereit bereitstellen.' },
      { id: 's2', stepNumber: 2, title: 'WÜRZEN & MARINIEREN', text: 'Die Hauptkomponenten mit Gewürzen und etwas Öl gründlich vermengen.' },
      { id: 's3', stepNumber: 3, title: 'GAREN & ANBRATEN', text: 'Bei mittlerer bis hoher Hitze unter gelegentlichem Wenden bissfest garen.' },
      { id: 's4', stepNumber: 4, title: 'ABSCHMECKEN', text: 'Mit Salz, Pfeffer und frischen Aromen final abschmecken.' },
      { id: 's5', stepNumber: 5, title: 'ANRICHTEN', text: 'Auf vorgewärmten Tellern oder in einer Bowl harmonisch platzieren.' },
      { id: 's6', stepNumber: 6, title: 'FINISH & SERVIEREN', text: 'Mit Kräutern und Toppings vollenden und heiß genießen.' },
    ],
    masterVariant: 6,
    nutrition: {
      calories: 450,
      carbs: 35,
      protein: 38,
      fat: 14,
    },
    watchOutTip: 'Garzeit nicht überziehen, damit Konsistenz und Saftigkeit optimal erhalten bleiben.',
    source: '',
    footerText: 'REZEPTE DURCHS JAHR',
  };
}

// API endpoint to parse recipe using Gemini according to editorial guidelines
app.post('/api/parse-recipe', async (req, res) => {
  const { rawText } = req.body;
  if (!rawText || typeof rawText !== 'string') {
    return res.status(400).json({ error: 'Rezepttext fehlt' });
  }

  if (!aiClient) {
    const fallback = ruleBasedParseRecipe(rawText);
    return res.json({ recipe: fallback, sourceNote: 'Lokale Regel-Engine (kein GEMINI_API_KEY konfiguriert)' });
  }

  try {
    const prompt = `Du bist die spezialisierte Chef-Editorial-Designerin und Rezept-Redakteurin für das Kochbuch „Rezepte durchs Jahr“.
Analysiere folgenden Rezept-Input und wandle ihn in das verbindliche Datenmodell der Masterseite um:

--- REZEPT INPUT ---
${rawText}
--- ENDE INPUT ---

VERBINDLICHE REGELN:
1. REZEPTTITEL: Kurz, prägnant, in GROSSBUCHSTABEN (z.B. "CHICKEN GYROS PITA BOWL").
2. JAHRESZEIT: Genau eine aus: "Frühling", "Sommer", "Herbst", "Winter", "Zeitlos".
3. KATEGORIE: Genau eine aus: "Frühstück & Bowls", "Hauptgerichte", "Snacks & Desserts", "Saucen & Basics", "Drinks".
4. TAGS: Exakt 4 kurze, passende Tags in GROSSBUCHSTABEN (z.B. HIGH PROTEIN, SCHNELL, AIRFRYER, MEAL PREP, ONE POT, VEGETARISCH, etc.). Niemals Platzhalter!
5. AUF EINEN BLICK: Portionen (Zahl oder z.B. "4 Portionen"), aktivTimeMin (Minuten), passiveTimeMin (Minuten), totalTimeMin (Minuten), utensils (wichtigste Küchenutensilien kurz kommagetrennt).
6. ZUTATEN: Niemals unstrukturierter Fließtext! Logisch auf columnLeft und columnRight aufteilen.
   - Jede Spalte hat 1 bis 3 Gruppen mit kurzen GROSSBUCHSTABEN-Zwischenüberschriften (z.B. "CHICKEN GYROS", "ZUM FÜLLEN", "SAUCE", "EXTRAS").
   - Jedes Item hat "amount" (z.B. "600 g", "1½", "Salz & Pfeffer", "optional") und "name" (z.B. "Hähnchenbrust").
   - Kleine optionale Garnituren kompakt halten (z.B. "Petersilie · Feta · Zitrone").
   - Beide Spalten visuell ausgewogen halten!
7. ZUBEREITUNG:
   - Nummerierte Schritte (maximal 12 Schritte!).
   - Jeder Schritt hat einen KURZEN TITEL IN GROSSBUCHSTABEN (z.B. "CHICKEN WÜRZEN", "KRUSPRIG GAREN") und einen präzisen, kompakten Handlungstext (kein Geschwafel).
   - Wähle als masterVariant die kleinste passende Variante:
     1-6 Schritte -> 6
     7-8 Schritte -> 8
     9-10 Schritte -> 10
     11-12 Schritte -> 12
8. NÄHRWERTE PRO PORTION:
   - calories (kcal Zahl)
   - carbs (Kohlenhydrate in g Zahl)
   - protein (Eiweiß in g Zahl)
   - fat (Fett in g Zahl)
   Realistisch berechnen bzw. schätzen.
9. ACHTE AUF:
   - Ein einziger wirklich praxisrelevanter, kritischer Hinweis (Gargrad, Kerntemperatur, Konsistenz, Airfryer-Tipp, Emulsion etc.).
10. QUELLE: Falls im Text genannt, formatiert wie "Adaptiert nach...", sonst leer "".
11. FOOTER: Immer "REZEPTE DURCHS JAHR".`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            season: { type: Type.STRING },
            category: { type: Type.STRING },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Exakt 4 Tags in Grossbuchstaben',
            },
            quickFacts: {
              type: Type.OBJECT,
              properties: {
                portions: { type: Type.STRING },
                activeTimeMin: { type: Type.INTEGER },
                passiveTimeMin: { type: Type.INTEGER },
                totalTimeMin: { type: Type.INTEGER },
                utensils: { type: Type.STRING },
              },
              required: ['portions', 'activeTimeMin', 'passiveTimeMin', 'totalTimeMin', 'utensils'],
            },
            columnLeft: {
              type: Type.OBJECT,
              properties: {
                groups: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      header: { type: Type.STRING },
                      items: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            amount: { type: Type.STRING },
                            name: { type: Type.STRING },
                          },
                          required: ['name'],
                        },
                      },
                    },
                    required: ['header', 'items'],
                  },
                },
              },
              required: ['groups'],
            },
            columnRight: {
              type: Type.OBJECT,
              properties: {
                groups: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      header: { type: Type.STRING },
                      items: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            amount: { type: Type.STRING },
                            name: { type: Type.STRING },
                          },
                          required: ['name'],
                        },
                      },
                    },
                    required: ['header', 'items'],
                  },
                },
              },
              required: ['groups'],
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  stepNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  text: { type: Type.STRING },
                },
                required: ['stepNumber', 'title', 'text'],
              },
            },
            masterVariant: { type: Type.INTEGER, description: '6, 8, 10 oder 12' },
            nutrition: {
              type: Type.OBJECT,
              properties: {
                calories: { type: Type.INTEGER },
                carbs: { type: Type.INTEGER },
                protein: { type: Type.INTEGER },
                fat: { type: Type.INTEGER },
              },
              required: ['calories', 'carbs', 'protein', 'fat'],
            },
            watchOutTip: { type: Type.STRING },
            source: { type: Type.STRING },
            footerText: { type: Type.STRING },
          },
          required: [
            'title', 'season', 'category', 'tags', 'quickFacts',
            'columnLeft', 'columnRight', 'steps', 'masterVariant',
            'nutrition', 'watchOutTip', 'footerText',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    // Ensure tags are exactly 4
    if (!Array.isArray(parsed.tags) || parsed.tags.length !== 4) {
      parsed.tags = ['SCHNELL', 'MEAL PREP', 'HIGH PROTEIN', 'HERZHAFT'];
    }
    // Ensure masterVariant conforms to step count
    const count = parsed.steps?.length || 6;
    if (count <= 6) parsed.masterVariant = 6;
    else if (count <= 8) parsed.masterVariant = 8;
    else if (count <= 10) parsed.masterVariant = 10;
    else parsed.masterVariant = 12;

    return res.json({ recipe: parsed, sourceNote: 'Gemini 3.8 Flash Editorial Engine' });
  } catch (err: any) {
    console.error('Error in /api/parse-recipe:', err);
    const fallback = ruleBasedParseRecipe(rawText);
    return res.json({ recipe: fallback, warning: err.message, sourceNote: 'Regel-Fallback nach API-Fehler' });
  }
});

// API endpoint to generate prompt for food photo or generate image
app.post('/api/generate-photo-prompt', (req, res) => {
  const { title, ingredients } = req.body;
  const prompt = `High-end editorial cookbook food photography of ${title || 'gourmet dish'}, prepared with ${ingredients || 'fresh seasonal ingredients'}. Warm natural daylight, organic beige ceramic tableware on natural linen surface, appetizing textures, minimalist styling, overhead 45 degree angle. Strictly square 1:1 composition, absolutely no text, no words, no watermarks, no graphic overlays.`;
  res.json({ prompt });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Produktionsassistent running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
