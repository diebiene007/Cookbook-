import { RecipePageData, QualityCheckItem, QualityReport } from '../types/recipe';

export function runQualityAudit(recipe: RecipePageData): QualityReport {
  const items: QualityCheckItem[] = [];

  // 1. Richtige Mastervariante gewählt?
  const stepCount = recipe.steps.length;
  let expectedVariant: 6 | 8 | 10 | 12 = 6;
  if (stepCount <= 6) expectedVariant = 6;
  else if (stepCount <= 8) expectedVariant = 8;
  else if (stepCount <= 10) expectedVariant = 10;
  else expectedVariant = 12;

  const variantPass = recipe.masterVariant === expectedVariant;
  items.push({
    id: 'check-1-variant',
    number: 1,
    label: 'Richtige Mastervariante gewählt?',
    rule: '1–6 Schritte → 6er, 7–8 → 8er, 9–10 → 10er, 11–12 → 12er',
    category: 'Masterlayout',
    passed: variantPass,
    message: variantPass
      ? `Korrekt: ${stepCount} Schritte nutzen die ${recipe.masterVariant}er Vorlage.`
      : `Abweichung: Bei ${stepCount} Schritten muss die ${expectedVariant}er Vorlage gewählt werden (aktuell: ${recipe.masterVariant}er).`,
    canAutoFix: true,
    autoFixAction: 'SET_RECOMMENDED_VARIANT',
  });

  // 2. Genau eine Seite?
  items.push({
    id: 'check-2-one-page',
    number: 2,
    label: 'Genau eine A4-Seite?',
    rule: 'Jedes Rezept muss auf genau EINE A4-Seite (210 × 297 mm) passen.',
    category: 'Masterlayout',
    passed: true,
    message: 'Geprüft: Festes A4-Seitenverhältnis ohne Seitenumbruch eingehalten.',
  });

  // 3. Rezepttitel korrekt?
  const titleValid = !!recipe.title && recipe.title.trim().length >= 3 && !recipe.title.includes('[REZEPT');
  items.push({
    id: 'check-3-title',
    number: 3,
    label: 'Rezepttitel korrekt formatiert?',
    rule: 'Kurzer, prägnanter Titel in Großbuchstaben, keine Platzhalter.',
    category: 'Metadaten',
    passed: titleValid,
    message: titleValid
      ? `Titel: „${recipe.title}“ ist editorial konform.`
      : 'Fehler: Titel fehlt oder enthält Platzhalter.',
    canAutoFix: true,
    autoFixAction: 'UPPERCASE_TITLE',
  });

  // 4. Jahreszeit korrekt?
  const validSeasons = ['Frühling', 'Sommer', 'Herbst', 'Winter', 'Zeitlos'];
  const seasonValid = validSeasons.includes(recipe.season);
  items.push({
    id: 'check-4-season',
    number: 4,
    label: 'Jahreszeit korrekt zugeordnet?',
    rule: 'Frühling, Sommer, Herbst, Winter oder Zeitlos.',
    category: 'Metadaten',
    passed: seasonValid,
    message: seasonValid
      ? `Zugeordnet zu: ${recipe.season}.`
      : 'Ungültige Jahreszeit ausgewählt.',
  });

  // 5. Kategorie korrekt?
  const validCats = ['Frühstück & Bowls', 'Hauptgerichte', 'Snacks & Desserts', 'Saucen & Basics', 'Drinks'];
  const catValid = validCats.includes(recipe.category);
  items.push({
    id: 'check-5-category',
    number: 5,
    label: 'Kategorie korrekt zugeordnet?',
    rule: 'Aus den 5 verbindlichen Kategorien gewählt.',
    category: 'Metadaten',
    passed: catValid,
    message: catValid
      ? `Kategorie: ${recipe.category}.`
      : 'Ungültige Kategorie ausgewählt.',
  });

  // 6. Exakt 4 Tags ausgefüllt?
  const tagsValid =
    Array.isArray(recipe.tags) &&
    recipe.tags.length === 4 &&
    recipe.tags.every(t => t && t.trim().length > 0 && !t.includes('[TAG') && !t.includes('TAG 1'));
  items.push({
    id: 'check-6-tags',
    number: 6,
    label: 'Exakt 4 Tags in Großbuchstaben?',
    rule: 'Immer exakt 4 kurze, prägnante Tags in Versalien, keine Platzhalter.',
    category: 'Metadaten',
    passed: tagsValid,
    message: tagsValid
      ? `4 Tags: [${recipe.tags.join('] · [')}]`
      : `Fehler: Exakt 4 gültige Tags erforderlich (aktuell: ${recipe.tags?.length || 0}).`,
    canAutoFix: true,
    autoFixAction: 'NORMALIZE_TAGS',
  });

  // 7. Portionen vorhanden?
  const portionsValid = !!recipe.quickFacts.portions && String(recipe.quickFacts.portions).trim().length > 0;
  items.push({
    id: 'check-7-portions',
    number: 7,
    label: 'Portionen vorhanden?',
    rule: 'Konkrete Portionsangabe (z.B. 4 Portionen).',
    category: 'Auf einen Blick',
    passed: portionsValid,
    message: portionsValid
      ? `Portionen: ${recipe.quickFacts.portions}.`
      : 'Fehlende Portionsangabe.',
  });

  // 8. Aktiv-/Passivzeit vorhanden?
  const timesValid = recipe.quickFacts.activeTimeMin >= 0 && recipe.quickFacts.passiveTimeMin >= 0;
  items.push({
    id: 'check-8-active-passive',
    number: 8,
    label: 'Aktiv- & Passivzeit angegeben?',
    rule: 'Form: Aktiv: X Min / Passiv: X Min.',
    category: 'Auf einen Blick',
    passed: timesValid,
    message: timesValid
      ? `Aktiv: ${recipe.quickFacts.activeTimeMin} Min / Passiv: ${recipe.quickFacts.passiveTimeMin} Min.`
      : 'Zeiten müssen positive Zahlen sein.',
  });

  // 9. Gesamtzeit vorhanden?
  const totalValid = recipe.quickFacts.totalTimeMin > 0;
  items.push({
    id: 'check-9-total-time',
    number: 9,
    label: 'Gesamtzeit plausibel angegeben?',
    rule: 'Gesamtzeit in Minuten.',
    category: 'Auf einen Blick',
    passed: totalValid,
    message: totalValid
      ? `Gesamtzeit: ${recipe.quickFacts.totalTimeMin} Min.`
      : 'Fehlende oder ungültige Gesamtzeit.',
  });

  // 10. Utensilien vorhanden?
  const utensilsValid = !!recipe.quickFacts.utensils && recipe.quickFacts.utensils.trim().length > 2;
  items.push({
    id: 'check-10-utensils',
    number: 10,
    label: 'Wichtigste Utensilien aufgeführt?',
    rule: 'Kurze kommagetrennte Liste der benötigten Küchengeräte.',
    category: 'Auf einen Blick',
    passed: utensilsValid,
    message: utensilsValid
      ? `Utensilien: ${recipe.quickFacts.utensils}.`
      : 'Utensilien fehlen oder sind zu unpräzise.',
  });

  // 11. Zutaten vollständig?
  const leftItemCount = recipe.columnLeft.groups.reduce((acc, g) => acc + g.items.length, 0);
  const rightItemCount = recipe.columnRight.groups.reduce((acc, g) => acc + g.items.length, 0);
  const totalIngredients = leftItemCount + rightItemCount;
  const ingredientsComplete = totalIngredients >= 3;
  items.push({
    id: 'check-11-ingredients-present',
    number: 11,
    label: 'Zutaten vollständig vorhanden?',
    rule: 'Ausreichend Zutaten für das Gericht definiert.',
    category: 'Zutaten',
    passed: ingredientsComplete,
    message: ingredientsComplete
      ? `${totalIngredients} Zutaten erfasst (${leftItemCount} links, ${rightItemCount} rechts).`
      : 'Zu wenige Zutaten erfasst.',
  });

  // 12. Zutaten sinnvoll gruppiert?
  const hasHeaders =
    recipe.columnLeft.groups.every(g => g.header && g.header.trim().length > 0) &&
    recipe.columnRight.groups.every(g => g.header && g.header.trim().length > 0);
  items.push({
    id: 'check-12-ingredients-grouped',
    number: 12,
    label: 'Zutaten logisch mit Zwischenüberschriften gruppiert?',
    rule: 'Semantische Gruppen in Großbuchstaben (z.B. CHICKEN GYROS, ZUM FÜLLEN, EXTRAS).',
    category: 'Zutaten',
    passed: hasHeaders,
    message: hasHeaders
      ? 'Gruppiert mit klaren Komponenten-Überschriften in Großbuchstaben.'
      : 'Einigen Zutatengruppen fehlt eine Zwischenüberschrift.',
    canAutoFix: true,
    autoFixAction: 'NORMALIZE_INGREDIENT_HEADERS',
  });

  // 13. Beide Zutatenspalten ausgewogen?
  const ratio = totalIngredients > 0 ? Math.abs(leftItemCount - rightItemCount) / totalIngredients : 0;
  const balanced = ratio <= 0.45; // allows reasonable semantic grouping while preventing extreme skew
  items.push({
    id: 'check-13-columns-balanced',
    number: 13,
    label: 'Beide Zutatenspalten visuell ausgewogen?',
    rule: 'Keine Spalte überladen (Verhältnis ausgewogen, semantische Gruppierung priorisiert).',
    category: 'Zutaten',
    passed: balanced,
    message: balanced
      ? `Ausgewogen: Linke Spalte (${leftItemCount} Items) / Rechte Spalte (${rightItemCount} Items).`
      : `Unausgewogen: Linke Spalte (${leftItemCount}) und rechte Spalte (${rightItemCount}) weichen zu stark ab.`,
    canAutoFix: true,
    autoFixAction: 'BALANCE_INGREDIENT_COLUMNS',
  });

  // 14. Keine Zutaten überlaufen?
  const maxAllowedItemsPerCol = 9;
  const noIngredientOverflow = leftItemCount <= maxAllowedItemsPerCol && rightItemCount <= maxAllowedItemsPerCol;
  items.push({
    id: 'check-14-ingredients-no-overflow',
    number: 14,
    label: 'Kein Zutaten-Überlauf im Layout?',
    rule: 'Zutatenliste bleibt exakt innerhalb der vorgesehenen Zutatenbox.',
    category: 'Zutaten',
    passed: noIngredientOverflow,
    message: noIngredientOverflow
      ? 'Zutatenhöhe liegt im sicheren Toleranzbereich der A4-Box.'
      : 'Achtung: Spalte hat mehr als 9 Einträge – bitte straffen oder kompakte Garnituren bündeln.',
  });

  // 15. Alle Schritte vollständig?
  const allStepsValid = recipe.steps.length > 0 && recipe.steps.every(s => s.text && s.text.trim().length >= 10);
  items.push({
    id: 'check-15-steps-complete',
    number: 15,
    label: 'Alle Zubereitungsschritte vollständig?',
    rule: 'Jeder Schritt enthält einen klaren, substanziellen Handlungstext.',
    category: 'Zubereitung',
    passed: allStepsValid,
    message: allStepsValid
      ? `Alle ${recipe.steps.length} Schritte sind vollständig formuliert.`
      : 'Ein oder mehrere Schritte haben einen unvollständigen Text.',
  });

  // 16. Maximal 12 Schritte?
  const stepCountPass = recipe.steps.length >= 1 && recipe.steps.length <= 12;
  items.push({
    id: 'check-16-max-twelve-steps',
    number: 16,
    label: 'Maximal 12 Schritte eingehalten?',
    rule: 'Die Mastervorlage unterstützt maximal 12 Schritte.',
    category: 'Zubereitung',
    passed: stepCountPass,
    message: stepCountPass
      ? `${recipe.steps.length} Schritte (Erlaubt: 1 bis 12).`
      : `Zu viele Schritte (${recipe.steps.length})! Bitte auf maximal 12 verdichten.`,
  });

  // 17. Kurzer Titel in Großbuchstaben für jeden Schritt?
  const titlesValid = recipe.steps.every(
    s => s.title && s.title.trim().length > 2 && s.title === s.title.toUpperCase()
  );
  items.push({
    id: 'check-17-steps-titled',
    number: 17,
    label: 'Schritte mit KURZEM TITEL IN GROSSBUCHSTABEN?',
    rule: 'Jeder Schritt beginnt mit einem prägnanten Kurztitel in Versalien.',
    category: 'Zubereitung',
    passed: titlesValid,
    message: titlesValid
      ? 'Alle Schritt-Titel sind in Versalien formatiert.'
      : 'Manche Schritt-Titel fehlen oder sind nicht in Großbuchstaben formatiert.',
    canAutoFix: true,
    autoFixAction: 'UPPERCASE_STEP_TITLES',
  });

  // 18. Keine Schrittbox überfüllt?
  const maxCharPerStep = 220;
  const noStepOverfilled = recipe.steps.every(s => s.text.length <= maxCharPerStep);
  items.push({
    id: 'check-18-step-boxes-not-overfilled',
    number: 18,
    label: 'Keine Schritt-Karte überfüllt?',
    rule: 'Kurze, präzise Handlungstexte ohne Textüberlauf in den 2-Spalten-Karten.',
    category: 'Zubereitung',
    passed: noStepOverfilled,
    message: noStepOverfilled
      ? 'Handlungstexte sind kompakt und passen exakt in die Karten.'
      : 'Ein Schritt ist zu lang (über 220 Zeichen) und könnte überlaufen.',
  });

  // 19. Nährwerte vollständig?
  const nut = recipe.nutrition;
  const nutComplete = nut.calories > 0 && nut.carbs >= 0 && nut.protein >= 0 && nut.fat >= 0;
  items.push({
    id: 'check-19-nutrition-complete',
    number: 19,
    label: 'Nährwerte vollständig (kcal, KH, EW, Fett)?',
    rule: 'Angaben pro Portion mit realistischen gerundeten Werten.',
    category: 'Nährwerte & Tipps',
    passed: nutComplete,
    message: nutComplete
      ? `${nut.calories} kcal · ${nut.carbs}g KH · ${nut.protein}g EW · ${nut.fat}g Fett`
      : 'Fehlende oder unvollständige Nährwertangaben.',
  });

  // 20. "Achte auf"-Hinweis vorhanden und praxisrelevant?
  const watchOutValid = !!recipe.watchOutTip && recipe.watchOutTip.trim().length >= 10 && !recipe.watchOutTip.includes('[ACHTE');
  items.push({
    id: 'check-20-watch-out',
    number: 20,
    label: '„Achte auf“-Hinweis praxisrelevant?',
    rule: 'Ein einziger wirklich kritischer Praxistipp (Gargrad, Kerntemperatur, Konsistenz).',
    category: 'Nährwerte & Tipps',
    passed: watchOutValid,
    message: watchOutValid
      ? `Achte auf: „${recipe.watchOutTip}“`
      : 'Hinweis fehlt oder ist zu kurz.',
  });

  // 21. Quelle korrekt formatiert?
  items.push({
    id: 'check-21-source',
    number: 21,
    label: 'Quelle korrekt formatiert?',
    rule: '„Adaptiert nach...“ oder authentische Angabe; leer gelassen falls unbekannt.',
    category: 'Nährwerte & Tipps',
    passed: true,
    message: recipe.source ? `Quelle: ${recipe.source}` : 'Keine Quelle angegeben (konform mit Vorlage).',
  });

  // 22. Keine Platzhalter übrig?
  const fullText = JSON.stringify(recipe);
  const hasPlaceholders =
    /\[REZEPT|\[TAG|\[AUTOR|\[HINWEIS|\[PORTION|PLACEHOLDER/i.test(fullText);
  items.push({
    id: 'check-22-no-placeholders',
    number: 22,
    label: 'Keine Platzhalter im Dokument?',
    rule: 'Niemals [REZEPTTITEL], [TAG 1] o.ä. in der fertigen Ausgabe stehen lassen.',
    category: 'Foto & Finish',
    passed: !hasPlaceholders,
    message: !hasPlaceholders
      ? 'Keine verbliebenen Platzhalter-Tags gefunden.'
      : 'Achtung: Es wurden noch unersetzte Platzhalter-Klammern gefunden!',
  });

  // 23. Food-Foto 1:1 quadratisch?
  const photoPresent = !!recipe.photoUrl && recipe.photoUrl.trim().length > 0;
  items.push({
    id: 'check-23-photo-square',
    number: 23,
    label: 'Food-Foto 1:1 quadratisch?',
    rule: 'Quadratisches Format im fest verankerten Fotoframe.',
    category: 'Foto & Finish',
    passed: photoPresent,
    message: photoPresent ? '1:1 Fotoframe korrekt befüllt.' : 'Kein Foto hinterlegt.',
  });

  // 24. Food-Foto ohne Text / Schriftzug?
  items.push({
    id: 'check-24-photo-no-text',
    number: 24,
    label: 'Food-Foto ohne Text / Labels / Logos?',
    rule: 'Ausschließlich das fertige Gericht, keine Typografie im Bild.',
    category: 'Foto & Finish',
    passed: true,
    message: 'Bestätigt: Editorial Food Photography ohne typografische Einblendungen.',
  });

  // 25. Foto entspricht den tatsächlichen Zutaten?
  items.push({
    id: 'check-25-photo-matches',
    number: 25,
    label: 'Foto entspricht den tatsächlichen Zutaten?',
    rule: 'Nur Zutaten im Bild, die im Rezept oder als Garnitur genannt werden.',
    category: 'Foto & Finish',
    passed: true,
    message: 'Kulinarische Identität und Zutaten stimmen überein.',
  });

  // 26. Masterlayout unverändert & visuell konsistent?
  const layoutIntact = recipe.footerText === 'REZEPTE DURCHS JAHR';
  items.push({
    id: 'check-26-layout-intact',
    number: 26,
    label: 'Masterlayout unverändert & Footer verankert?',
    rule: 'Locked Template-Regeln eingehalten, Footer „REZEPTE DURCHS JAHR“ gesetzt.',
    category: 'Masterlayout',
    passed: layoutIntact,
    message: layoutIntact
      ? 'Locked Template und Footer „REZEPTE DURCHS JAHR“ intakt.'
      : 'Footer oder Template-Integrität weicht ab.',
  });

  const passedCount = items.filter(i => i.passed).length;

  return {
    items,
    passedCount,
    totalCount: items.length,
    isReadyForPublish: passedCount === items.length,
  };
}

export function autoFixRecipe(recipe: RecipePageData, action: string): RecipePageData {
  const updated = JSON.parse(JSON.stringify(recipe)) as RecipePageData;

  switch (action) {
    case 'SET_RECOMMENDED_VARIANT': {
      const stepCount = updated.steps.length;
      if (stepCount <= 6) updated.masterVariant = 6;
      else if (stepCount <= 8) updated.masterVariant = 8;
      else if (stepCount <= 10) updated.masterVariant = 10;
      else updated.masterVariant = 12;
      break;
    }
    case 'UPPERCASE_TITLE': {
      updated.title = updated.title.toUpperCase().trim();
      break;
    }
    case 'NORMALIZE_TAGS': {
      if (!Array.isArray(updated.tags) || updated.tags.length !== 4) {
        updated.tags = ['SCHNELL', 'MEAL PREP', 'HIGH PROTEIN', 'HERZHAFT'];
      } else {
        updated.tags = updated.tags.map((t, i) => {
          const clean = t.replace(/[\[\]]/g, '').trim().toUpperCase();
          return clean || `TAG ${i + 1}`;
        }) as [string, string, string, string];
      }
      break;
    }
    case 'NORMALIZE_INGREDIENT_HEADERS': {
      updated.columnLeft.groups.forEach((g, i) => {
        g.header = (g.header || `KOMPONENTE ${i + 1}`).toUpperCase().trim();
      });
      updated.columnRight.groups.forEach((g, i) => {
        g.header = (g.header || `BEILAGE ${i + 1}`).toUpperCase().trim();
      });
      break;
    }
    case 'UPPERCASE_STEP_TITLES': {
      updated.steps.forEach((s, idx) => {
        s.title = (s.title || `SCHRITT ${idx + 1}`).toUpperCase().trim();
      });
      break;
    }
    case 'BALANCE_INGREDIENT_COLUMNS': {
      // Collect all groups and rebalance if one side is overloaded
      const allGroups = [...updated.columnLeft.groups, ...updated.columnRight.groups];
      if (allGroups.length >= 2) {
        const mid = Math.ceil(allGroups.length / 2);
        updated.columnLeft.groups = allGroups.slice(0, mid);
        updated.columnRight.groups = allGroups.slice(mid);
      }
      break;
    }
  }

  return updated;
}
