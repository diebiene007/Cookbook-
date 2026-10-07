import { RecipePageData } from '../types/recipe';
import { DEFAULT_RECIPES } from '../data/defaultRecipes';
import { isDataUrl, isBlobUrl, saveImageBlob, getImageBlob, getImageBlobRaw, deleteImageBlob } from './imageStorage';
import { normalizeRecipeData } from './normalizeRecipe';

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
 * Note: Returned recipes may have placeholder photoUrls if their images are stored in IndexedDB.
 * Call hydrateLibraryRecipes() to resolve IndexedDB blobs.
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
          const migrated: RecipePageData[] = legacyParsed.map((r: any) => {
            const normalized = normalizeRecipeData(r);
            return {
              ...normalized,
              savedAt: r.savedAt || r.updatedAt || now,
              createdAt: r.createdAt || now,
              updatedAt: r.updatedAt || now,
            };
          });

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
 * Prepares a recipe for storage:
 * - Case A: Fresh data: URL -> store in IndexedDB under stable ID `recipe-image-${recipe.id}`, create runtime Object URL
 * - Case B: Hydrated blob: URL with matching asset ID -> retain asset, keep existing object URL
 * - Case C: Normal URL / static path -> if old photoAssetId was present, delete it from IndexedDB; photoAssetId = undefined
 */
export async function prepareRecipeForStorage(recipe: RecipePageData): Promise<{
  storageRecipe: RecipePageData;
  runtimeRecipe: RecipePageData;
}> {
  const copy = cloneRecipe(recipe);
  let photoAssetId = copy.photoAssetId;
  let runtimePhotoUrl = copy.photoUrl;

  if (isDataUrl(copy.photoUrl)) {
    // Case A: Fresh Base64 data URL
    try {
      const assetId = `recipe-image-${copy.id}`;
      await saveImageBlob(assetId, copy.photoUrl);
      photoAssetId = assetId;
      const objectUrl = await getImageBlob(assetId);
      if (objectUrl) {
        runtimePhotoUrl = objectUrl;
      }
    } catch (imgErr) {
      console.warn('Failed to save image to IndexedDB', imgErr);
    }
  } else if (isBlobUrl(copy.photoUrl) && photoAssetId) {
    // Case B: Hydrated Object URL with existing asset ID -> retain
    runtimePhotoUrl = copy.photoUrl;
  } else {
    // Case C: Normal URL (https://, /src/assets/...) or no photo
    // If the recipe previously held an IndexedDB image, clean it up!
    if (photoAssetId) {
      try {
        await deleteImageBlob(photoAssetId);
      } catch (delErr) {
        console.warn('Failed to delete outdated IndexedDB image', delErr);
      }
      photoAssetId = undefined;
    }
    runtimePhotoUrl = copy.photoUrl;
  }

  const storageRecipe: RecipePageData = {
    ...copy,
    photoAssetId,
    photoUrl: photoAssetId ? DEFAULT_RECIPES[0].photoUrl : runtimePhotoUrl,
  };

  const runtimeRecipe: RecipePageData = {
    ...copy,
    photoAssetId,
    photoUrl: runtimePhotoUrl,
  };

  return { storageRecipe, runtimeRecipe };
}

/**
 * Persists the library recipes to LocalStorage.
 * Large Base64 images are moved to IndexedDB and referenced by photoAssetId
 * to avoid localStorage quota errors.
 * Returns hydrated runtime recipes.
 */
export async function persistLibraryRecipes(recipes: RecipePageData[]): Promise<RecipePageData[]> {
  try {
    const sanitizedList: RecipePageData[] = [];
    const runtimeList: RecipePageData[] = [];

    for (const recipe of recipes) {
      const { storageRecipe, runtimeRecipe } = await prepareRecipeForStorage(recipe);
      sanitizedList.push(storageRecipe);
      runtimeList.push(runtimeRecipe);
    }

    localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(sanitizedList));
    return runtimeList;
  } catch (err) {
    console.error('Failed to persist library recipes', err);
    throw err;
  }
}

/**
 * Clones an existing IndexedDB asset from a source recipe into a distinct asset for a duplicated recipe.
 */
export async function cloneAssetForRecipe(sourceAssetId: string, targetRecipeId: string): Promise<string | null> {
  try {
    const rawBlob = await getImageBlobRaw(sourceAssetId);
    if (!rawBlob) return null;
    const newAssetId = `recipe-image-${targetRecipeId}`;
    await saveImageBlob(newAssetId, rawBlob);
    return newAssetId;
  } catch (err) {
    console.warn('Failed to clone IndexedDB image asset', err);
    return null;
  }
}

/**
 * Hydrates a single recipe with its IndexedDB image blob if photoAssetId is present.
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

/**
 * Hydrates an array of recipes from IndexedDB.
 */
export async function hydrateLibraryRecipes(recipes: RecipePageData[]): Promise<RecipePageData[]> {
  return Promise.all(recipes.map(hydrateRecipeImage));
}

/**
 * Deletes associated IndexedDB image asset for a recipe if present.
 */
export async function deleteRecipeAsset(photoAssetId?: string): Promise<void> {
  if (photoAssetId) {
    try {
      await deleteImageBlob(photoAssetId);
    } catch (err) {
      console.warn('Failed to delete recipe image asset', err);
    }
  }
}

