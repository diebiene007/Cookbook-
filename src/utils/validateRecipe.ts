import { RecipePageData } from '../types/recipe';
import { normalizeRecipeData } from './normalizeRecipe';

export interface ImportValidationResult {
  validRecipes: RecipePageData[];
  invalidCount: number;
  errors: string[];
}

/**
 * Validates whether an unknown object has the necessary baseline structure to be considered a recipe.
 */
export function validateRecipeCandidate(item: any, index: number): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const prefix = `Rezept #${index + 1}`;

  if (!item || typeof item !== 'object') {
    return { isValid: false, errors: [`${prefix}: Ist kein gültiges Objekt.`] };
  }

  // Title check
  if (!item.title || typeof item.title !== 'string' || !item.title.trim()) {
    errors.push(`${prefix}: Titel fehlt oder ist leer.`);
  }

  // Basic ingredient structure check
  const hasColumnLeft = item.columnLeft && Array.isArray(item.columnLeft.groups);
  const hasColumnRight = item.columnRight && Array.isArray(item.columnRight.groups);
  const hasFlatIngredients = Array.isArray(item.ingredients);

  if (!hasColumnLeft && !hasColumnRight && !hasFlatIngredients) {
    errors.push(`${prefix}: Keine Zutatengruppen oder Zutatenlisten gefunden.`);
  }

  // Basic steps check
  if (!Array.isArray(item.steps) && !Array.isArray(item.instructions)) {
    errors.push(`${prefix}: Keine Zubereitungsschritte gefunden.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a parsed JSON payload and normalizes valid candidates.
 */
export function validateAndNormalizeRecipeImport(parsed: any): ImportValidationResult {
  if (!Array.isArray(parsed)) {
    return {
      validRecipes: [],
      invalidCount: 1,
      errors: ['Die importierte Datei muss eine JSON-Liste (Array) von Rezepten enthalten.'],
    };
  }

  if (parsed.length === 0) {
    return {
      validRecipes: [],
      invalidCount: 0,
      errors: ['Die importierte Liste enthält keine Rezepte.'],
    };
  }

  const validRecipes: RecipePageData[] = [];
  const allErrors: string[] = [];
  let invalidCount = 0;

  parsed.forEach((item, idx) => {
    const { isValid, errors } = validateRecipeCandidate(item, idx);
    if (isValid) {
      try {
        const normalized = normalizeRecipeData(item);
        validRecipes.push(normalized);
      } catch (err: any) {
        invalidCount++;
        allErrors.push(`Rezept #${idx + 1} (${item.title || 'Unbekannt'}): Fehler bei der Normalisierung (${err.message})`);
      }
    } else {
      invalidCount++;
      allErrors.push(...errors);
    }
  });

  return {
    validRecipes,
    invalidCount,
    errors: allErrors,
  };
}
