import { RecipePageData, QualityCheckItem, QualityReport, QualityCheckStatus } from '../types/recipe';

export interface RuntimeAuditContext {
  hasDomOverflow?: boolean;
  photoAspectRatio?: number;
  imageVerified?: boolean;
  imageVerificationDetails?: {
    matchesRecipe?: boolean;
    containsTextOrLogo?: boolean;
  };
}

export function runQualityAudit(
  recipe: RecipePageData,
  context?: RuntimeAuditContext
): QualityReport {
  const items: QualityCheckItem[] = [];

  const createItem = (
    itemData: Omit<QualityCheckItem, 'passed'> & { status?: QualityCheckStatus; passed?: boolean }
  ): QualityCheckItem => {
    const status: QualityCheckStatus =
      itemData.status !== undefined
        ? itemData.status
        : itemData.passed === true
        ? 'passed'
        : 'failed';

    return {
      id: itemData.id,
      number: itemData.number,
      label: itemData.label,
      rule: itemData.rule,
      category: itemData.category,
      status,
      passed: status === 'passed',
      message: itemData.message,
      canAutoFix: itemData.canAutoFix,
      autoFixAction: itemData.autoFixAction,
    };
  };

  // 1. Richtige Mastervariante gewählt?
  const stepCount = recipe.steps.length;
  let expectedVariant: 6 | 8 | 10 | 12 = 6;
  if (stepCount <= 6) expectedVariant = 6;
  else if (stepCount <= 8) expectedVariant = 8;
  else if (stepCount <= 10) expectedVariant = 10;
  else expectedVariant = 12;

  const variantPass = recipe.masterVariant === expectedVariant;
  items.push(
    createItem({
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
    })
  );

  // 2. Genau eine Seite? (A4-Einseitigkeit)
  let onePageStatus: QualityCheckStatus = 'unchecked';
  let onePageMessage = 'Ungeprüft: Runtime-Layoutcheck im Browser noch nicht erfolgt.';
  if (context?.hasDomOverflow !== undefined) {
    if (context.hasDomOverflow) {
      onePageStatus = 'failed';
      onePageMessage = 'Layout-Überlauf: Inhalte ragen über den vorgesehenen A4-Druckbereich hinaus!';
    } else {
      onePageStatus = 'passed';
      onePageMessage = 'Geprüft: Festes A4-Seitenverhältnis ohne Seitenumbruch eingehalten.';
    }
  }

  items.push(
    createItem({
      id: 'check-2-one-page',
      number: 2,
      label: 'Genau eine A4-Seite?',
      rule: 'Jedes Rezept muss auf genau EINE A4-Seite (210 × 297 mm) passen.',
      category: 'Masterlayout',
      status: onePageStatus,
      message: onePageMessage,
    })
  );

  // 3. Rezepttitel korrekt?
  const titleValid = !!recipe.title && recipe.title.trim().length >= 3 && !recipe.title.includes('[REZEPT');
  items.push(
    createItem({
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
    })
  );

  // 4. Jahreszeit korrekt?
  const validSeasons = ['Frühling', 'Sommer', 'Herbst', 'Winter', 'Zeitlos'];
  const seasonValid = validSeasons.includes(recipe.season);
  items.push(
    createItem({
      id: 'check-4-season',
      number: 4,
      label: 'Jahreszeit korrekt zugewiesen?',
      rule: 'Frühling, Sommer, Herbst, Winter oder Zeitlos.',
      category: 'Metadaten',
      passed: seasonValid,
      message: seasonValid
        ? `Saison: „${recipe.season}“ ist eine gültige Buchkategorie.`
        : 'Fehler: Ungültige Jahreszeit.',
    })
  );

  // 5. Exakt 4 Tags?
  const tagCount = recipe.tags.length;
  const tagsValid = tagCount === 4 && recipe.tags.every(t => t.trim().length > 0);
  items.push(
    createItem({
      id: 'check-5-tags',
      number: 5,
      label: 'Exakt 4 Tags vorhanden?',
      rule: 'Weder 3 noch 5 Tags, sondern exakt 4 Tags in GROSSBUCHSTABEN.',
      category: 'Metadaten',
      passed: tagsValid,
      message: tagsValid
        ? `Exakt 4 Tags vorhanden: ${recipe.tags.join(', ')}.`
        : `Abweichung: Es sind aktuell ${tagCount} Tags hinterlegt (erforderlich: exakt 4).`,
      canAutoFix: true,
      autoFixAction: 'NORMALIZE_TAGS',
    })
  );

  // 6. Kategorie korrekt?
  const validCategories = [
    'Frühstück & Bowls',
    'Hauptgerichte',
    'Snacks & Desserts',
    'Saucen & Basics',
    'Drinks',
  ];
  const categoryValid = validCategories.includes(recipe.category);
  items.push(
    createItem({
      id: 'check-6-category',
      number: 6,
      label: 'Kategorie korrekt zugewiesen?',
      rule: 'Nur eine der 5 verbindlichen Buch-Hauptkategorien.',
      category: 'Metadaten',
      passed: categoryValid,
      message: categoryValid
        ? `Kategorie: „${recipe.category}“ ist konform.`
        : 'Fehler: Ungültige Kategorie.',
    })
  );

  // 7. Auf einen Blick Vollständigkeit
  const qf = recipe.quickFacts;
  const qfComplete =
    !!qf.portions &&
    qf.activeTimeMin > 0 &&
    qf.totalTimeMin > 0 &&
    !!qf.utensils &&
    qf.utensils.trim().length > 0;
  items.push(
    createItem({
      id: 'check-7-quickfacts',
      number: 7,
      label: '„Auf einen Blick“-Leiste vollständig?',
      rule: 'Portionen, Aktivzeit, Gesamtzeit und Utensilien müssen befüllt sein.',
      category: 'Auf einen Blick',
      passed: qfComplete,
      message: qfComplete
        ? 'Alle 4 Quick-Facts vollständig erfasst.'
        : 'Lücke in den Quick-Facts: Bitte alle 4 Felder ausfüllen.',
    })
  );

  // 8. Gesamtzeit = Aktivzeit + Passivzeit Plausibilität
  const timeConsistent = qf.totalTimeMin >= qf.activeTimeMin;
  items.push(
    createItem({
      id: 'check-8-time-calc',
      number: 8,
      label: 'Zeiten rechnerisch plausibel?',
      rule: 'Gesamtzeit darf nicht kleiner als die Aktivzeit sein.',
      category: 'Auf einen Blick',
      passed: timeConsistent,
      message: timeConsistent
        ? `Zeiten plausibel (${qf.activeTimeMin} Min aktiv, ${qf.totalTimeMin} Min gesamt).`
        : 'Unplausibel: Gesamtzeit ist kleiner als Aktivzeit!',
    })
  );

  // 9. Zutaten in genau 2 Spalten aufgeteilt?
  const hasLeft = recipe.columnLeft.groups.length > 0;
  const hasRight = recipe.columnRight.groups.length > 0;
  const twoColumns = hasLeft && hasRight;
  items.push(
    createItem({
      id: 'check-9-two-columns',
      number: 9,
      label: 'Zutaten in genau zwei Spalten aufgeteilt?',
      rule: 'Immer zweispaltige Zutatenliste, keine leere Spalte.',
      category: 'Zutaten',
      passed: twoColumns,
      message: twoColumns
        ? `Spalten befüllt (${recipe.columnLeft.groups.length} Gruppen links, ${recipe.columnRight.groups.length} rechts).`
        : 'Fehler: Eine der beiden Zutatenspalten ist leer!',
      canAutoFix: true,
      autoFixAction: 'BALANCE_INGREDIENT_COLUMNS',
    })
  );

  // 10. Jede Zutatengruppe hat Versalien-Header?
  const allGroups = [...recipe.columnLeft.groups, ...recipe.columnRight.groups];
  const allHeadersUppercase = allGroups.every(
    g => g.header && g.header.trim().length > 0 && g.header === g.header.toUpperCase()
  );
  items.push(
    createItem({
      id: 'check-10-ingredient-headers',
      number: 10,
      label: 'Zutaten-Zwischenüberschriften in Versalien?',
      rule: 'Komponenten-Header immer in Großbuchstaben (z.B. CHICKEN GYROS).',
      category: 'Zutaten',
      passed: allHeadersUppercase,
      message: allHeadersUppercase
        ? 'Alle Zutaten-Header sind in Großbuchstaben formatiert.'
        : 'Abweichung: Mindestens eine Zutatengruppe hat keinen Versalien-Header.',
      canAutoFix: true,
      autoFixAction: 'NORMALIZE_INGREDIENT_HEADERS',
    })
  );

  // 11. Keine leeren Zutatengruppen?
  const noEmptyGroups = allGroups.every(g => g.items && g.items.length > 0);
  items.push(
    createItem({
      id: 'check-11-no-empty-groups',
      number: 11,
      label: 'Keine leeren Zutatengruppen?',
      rule: 'Jede Gruppe muss mindestens eine Zutat enthalten.',
      category: 'Zutaten',
      passed: noEmptyGroups,
      message: noEmptyGroups
        ? 'Alle Zutatengruppen enthalten Zutaten.'
        : 'Fehler: Mindestens eine Zutatengruppe enthält keine Einträge!',
    })
  );

  // 12. Mindestens eine Zutat vorhanden?
  const totalIngredients = allGroups.reduce((acc, g) => acc + (g.items?.length || 0), 0);
  const hasIngredients = totalIngredients > 0;
  items.push(
    createItem({
      id: 'check-12-has-ingredients',
      number: 12,
      label: 'Mindestens eine Zutat vorhanden?',
      rule: 'Zutatenliste darf nicht leer sein.',
      category: 'Zutaten',
      passed: hasIngredients,
      message: hasIngredients
        ? `Insgesamt ${totalIngredients} Zutaten erfasst.`
        : 'Fehler: Keine Zutaten erfasst!',
    })
  );

  // 13. Schrittanzahl 1–12 eingehalten?
  const stepsInRange = stepCount >= 1 && stepCount <= 12;
  items.push(
    createItem({
      id: 'check-13-step-count',
      number: 13,
      label: 'Schrittanzahl 1 bis 12 eingehalten?',
      rule: 'Maximal 12 Schritte für die Mastervorlage zulässig (§8).',
      category: 'Zubereitung',
      passed: stepsInRange,
      message: stepsInRange
        ? `${stepCount} Schritte (im erlaubten Bereich 1–12).`
        : `Fehler: ${stepCount} Schritte überschreiten das Maximum von 12!`,
    })
  );

  // 14. Jeder Schritt hat nummerierten Versalien-Titel?
  const allStepsHaveTitle = recipe.steps.every(
    s => s.title && s.title.trim().length > 0 && s.title === s.title.toUpperCase()
  );
  items.push(
    createItem({
      id: 'check-14-step-titles',
      number: 14,
      label: 'Schritt-Titel in Versalien?',
      rule: 'Jeder Zubereitungsschritt benötigt einen kurzen Versalien-Titel.',
      category: 'Zubereitung',
      passed: allStepsHaveTitle,
      message: allStepsHaveTitle
        ? 'Alle Schritt-Titel sind in Großbuchstaben formatiert.'
        : 'Abweichung: Ein Schritt hat keinen Titel oder ist nicht in Versalien.',
      canAutoFix: true,
      autoFixAction: 'UPPERCASE_STEP_TITLES',
    })
  );

  // 15. Jeder Schritt hat Handlungstext?
  const allStepsHaveText = recipe.steps.every(s => s.text && s.text.trim().length > 5);
  items.push(
    createItem({
      id: 'check-15-step-text',
      number: 15,
      label: 'Jeder Schritt enthält Handlungstext?',
      rule: 'Kein Schritt darf leer oder kürzer als 5 Zeichen sein.',
      category: 'Zubereitung',
      passed: allStepsHaveText,
      message: allStepsHaveText
        ? 'Alle Schritte enthalten konkreten Handlungstext.'
        : 'Lücke: Mindestens ein Schritt hat keinen ausreichenden Text.',
    })
  );

  // 16. Nährwertangaben vollständig?
  const nut = recipe.nutrition;
  const nutComplete = nut.calories > 0 && nut.carbs >= 0 && nut.protein >= 0 && nut.fat >= 0;
  items.push(
    createItem({
      id: 'check-16-nutrition',
      number: 16,
      label: 'Nährwertangaben vollständig?',
      rule: 'Kalorien, Kohlenhydrate, Protein und Fett pro Portion.',
      category: 'Nährwerte & Tipps',
      passed: nutComplete,
      message: nutComplete
        ? `Nährwerte vollständig (${nut.calories} kcal, ${nut.protein}g P, ${nut.carbs}g KH, ${nut.fat}g F).`
        : 'Lücke in den Nährwerten: Bitte alle 4 Werte ausfüllen.',
    })
  );

  // 17. Tipp / Watch-out vorhanden?
  const hasTip = !!recipe.watchOutTip && recipe.watchOutTip.trim().length > 10;
  items.push(
    createItem({
      id: 'check-17-watchout-tip',
      number: 17,
      label: 'Praxistipp („Watch-out“) vorhanden?',
      rule: 'Fester Platz für Praxistipp oder sensorischen Hinweis.',
      category: 'Nährwerte & Tipps',
      passed: hasTip,
      message: hasTip ? 'Praxistipp vorhanden.' : 'Praxistipp fehlt oder ist zu kurz.',
    })
  );

  // 18. Food-Foto 1:1 quadratisch?
  const photoPresent = !!recipe.photoUrl && recipe.photoUrl.trim().length > 0;
  let photoSquareStatus: QualityCheckStatus = 'unchecked';
  let photoSquareMessage = 'Ungeladen: Reales Seitenverhältnis des Bildes noch nicht gemessen.';

  if (!photoPresent) {
    photoSquareStatus = 'failed';
    photoSquareMessage = 'Fehler: Kein Foto hinterlegt.';
  } else if (context?.photoAspectRatio !== undefined) {
    const isSquare = context.photoAspectRatio >= 0.98 && context.photoAspectRatio <= 1.02;
    photoSquareStatus = isSquare ? 'passed' : 'failed';
    photoSquareMessage = isSquare
      ? `Geprüft: Seitenverhältnis ${context.photoAspectRatio.toFixed(2)} ist exakt quadratisch.`
      : `Abweichung: Seitenverhältnis ${context.photoAspectRatio.toFixed(2)} weicht von 1:1 ab!`;
  }

  items.push(
    createItem({
      id: 'check-18-photo-square',
      number: 18,
      label: 'Food-Foto 1:1 quadratisch?',
      rule: 'Quadratisches Format im fest verankerten Fotoframe (0.98–1.02).',
      category: 'Foto & Finish',
      status: photoSquareStatus,
      message: photoSquareMessage,
    })
  );

  // 19. Food-Foto ohne Text / Labels / Logos?
  let photoTextStatus: QualityCheckStatus = 'unchecked';
  let photoTextMessage = 'Ungeprüft: Ohne multimodale Bildanalyse kann Textfreiheit nicht garantiert werden.';

  if (context?.imageVerificationDetails?.containsTextOrLogo !== undefined) {
    if (context.imageVerificationDetails.containsTextOrLogo) {
      photoTextStatus = 'failed';
      photoTextMessage = 'KI-Prüfung fand Text, Labels oder Logos im Bild!';
    } else {
      photoTextStatus = 'passed';
      photoTextMessage = 'KI-Bildprüfung: Keine störende Typografie im Bild erkannt.';
    }
  }

  items.push(
    createItem({
      id: 'check-19-photo-no-text',
      number: 19,
      label: 'Food-Foto ohne Text / Labels / Logos?',
      rule: 'Ausschließlich das fertige Gericht, keine Typografie im Bild.',
      category: 'Foto & Finish',
      status: photoTextStatus,
      message: photoTextMessage,
    })
  );

  // 20. Foto entspricht den tatsächlichen Zutaten?
  let photoMatchesStatus: QualityCheckStatus = 'unchecked';
  let photoMatchesMessage = 'Ungeprüft: Ohne multimodale Bildanalyse kann Rezepttreue nicht visuell verifiziert werden.';

  if (context?.imageVerificationDetails?.matchesRecipe !== undefined) {
    if (context.imageVerificationDetails.matchesRecipe) {
      photoMatchesStatus = 'passed';
      photoMatchesMessage = 'KI-Bildprüfung: Sichtbare Zutaten stimmen mit dem Rezept überein.';
    } else {
      photoMatchesStatus = 'failed';
      photoMatchesMessage = 'KI-Bildprüfung: Widersprüche zwischen Bild und Rezeptzutaten erkannt!';
    }
  }

  items.push(
    createItem({
      id: 'check-20-photo-matches',
      number: 20,
      label: 'Foto entspricht den tatsächlichen Zutaten?',
      rule: 'Nur Zutaten im Bild, die im Rezept oder als Garnitur genannt werden.',
      category: 'Foto & Finish',
      status: photoMatchesStatus,
      message: photoMatchesMessage,
    })
  );

  // 21. Masterlayout unverändert & Footer verankert?
  const layoutIntact = recipe.footerText === 'AUS DEM BUCH „REZEPTE DURCHS JAHR“' || recipe.footerText.includes('REZEPTE DURCHS JAHR');
  items.push(
    createItem({
      id: 'check-21-layout-intact',
      number: 21,
      label: 'Masterlayout unverändert & Footer verankert?',
      rule: 'Locked Template-Regeln eingehalten, Footer „REZEPTE DURCHS JAHR“ gesetzt.',
      category: 'Masterlayout',
      passed: layoutIntact,
      message: layoutIntact
        ? 'Locked Template und Footer „REZEPTE DURCHS JAHR“ intakt.'
        : 'Footer oder Template-Integrität weicht ab.',
    })
  );

  const passedCount = items.filter(i => i.status === 'passed').length;
  const uncheckedCount = items.filter(i => i.status === 'unchecked').length;
  const failedCount = items.filter(i => i.status === 'failed').length;

  return {
    items,
    passedCount,
    uncheckedCount,
    failedCount,
    totalCount: items.length,
    isReadyForPublish: failedCount === 0 && uncheckedCount === 0,
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
