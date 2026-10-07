import { RecipePageData } from '../types/recipe';
import { DEFAULT_RECIPES } from '../data/defaultRecipes';
import { isDataUrl, saveImageBlob, getImageBlob } from './imageStorage';

export const LIBRARY_STORAGE_KEY = 'rezepte_durchs_jahr_library_v1';
export const LEGACY_STORAGE_KEY = 'rezepte_durchs_jahr_data_v1';
export const MIGRATION_DONE_KEY = 'rezepte_durchs_jahr_migrated_v1';

/**
 * Deep clones a recipe object so mutations on draftRecipe never mutate saved records.
 */
export function cloneRecipe(recipe: RecipePageData): RecipePageData {
  return JSON.parse(JSON.stringify(recipe));
}

/**
 * Loads the saved library recipes, handling one-time legacy migration or initial default setup.
 */
export function loadLibraryRecipes(): RecipePageData[] {
  try {
    // 1. Check existing new library storage
    const stored = localStorage.getItem(LIBRARY_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    // 2. One-time Migration check from legacy storage
    const hasMigrated = localStorage.getItem(MIGRATION_DONE_KEY);
    if (!hasMigrated) {
      const legacyStored = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyStored) {
        const legacyParsed = JSON.parse(legacyStored);
        if (Array.isArray(legacyParsed) && legacyParsed.length > 0) {
          const now = new Date().toISOString();
          const migrated: RecipePageData[] = legacyParsed.map((r: any) => ({
            ...r,
            savedAt: r.savedAt || r.updatedAt || now,
            createdAt: r.createdAt || now,
            updatedAt: r.updatedAt || now,
          }));

          localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(migrated));
          localStorage.setItem(MIGRATION_DONE_KEY, 'true');
          return migrated;
        }
      }
    }

    // 3. Initial Setup: Fallback to DEFAULT_RECIPES as initial saved library
    const now = new Date().toISOString();
    const initial: RecipePageData[] = DEFAULT_RECIPES.map(r => ({
      ...cloneRecipe(r),
      createdAt: now,
      updatedAt: now,
      savedAt: now,
    }));

    localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(initial));
    localStorage.setItem(MIGRATION_DONE_KEY, 'true');
    return initial;
  } catch (err) {
    console.error('Failed to load library recipes from storage', err);
    return DEFAULT_RECIPES.map(cloneRecipe);
  }
}

/**
 * Persists the library recipes to LocalStorage.
 * Large Base64 images are moved to IndexedDB and referenced by photoAssetId
 * to avoid localStorage quota errors.
 */
export async function persistLibraryRecipes(recipes: RecipePageData[]): Promise<void> {
  try {
    // Process recipes: offload data URLs to IndexedDB
    const sanitizedList: RecipePageData[] = [];

    for (const recipe of recipes) {
      const copy = cloneRecipe(recipe);

      if (isDataUrl(copy.photoUrl)) {
        try {
          const assetId = `img-${copy.id}-${Date.now()}`;
          await saveImageBlob(assetId, copy.photoUrl);
          copy.photoAssetId = assetId;
          // Keep a temporary lightweight placeholder or relative path in JSON
          copy.photoUrl = DEFAULT_RECIPES[0].photoUrl;
        } catch (imgErr) {
          console.warn('Failed to save image to IndexedDB, keeping URL', imgErr);
        }
      }

      sanitizedList.push(copy);
    }

    localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(sanitizedList));
  } catch (err) {
    console.error('Failed to persist library recipes', err);
    throw err;
  }
}

/**
 * Hydrates a recipe with its IndexedDB image blob if photoAssetId is present.
 */
export async function hydrateRecipeImage(recipe: RecipePageData): Promise<RecipePageData> {
  if (recipe.photoAssetId) {
    try {
      const blobUrl = await getImageBlob(recipe.photoAssetId);
      if (blobUrl) {
        return {
          ...recipe,
          photoUrl: blobUrl,
        };
      }
    } catch (err) {
      console.warn('Could not hydrate recipe image from IndexedDB', err);
    }
  }
  return recipe;
}
