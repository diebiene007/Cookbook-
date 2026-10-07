/**
 * IndexedDB Image Storage Abstraction.
 * Stores large AI-generated images locally as Blobs instead of bloating LocalStorage JSON with Base64.
 */

const DB_NAME = 'rezepte_durchs_jahr_images_db';
const DB_VERSION = 1;
const STORE_NAME = 'recipe_images';

let dbPromise: Promise<IDBDatabase> | null = null;
const blobUrlCache = new Map<string, string>();

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });

  return dbPromise;
}

/**
 * Converts a data: URL / base64 string to a Blob.
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(';base64,');
  const contentType = parts[0].split(':')[1] || 'image/jpeg';
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

/**
 * Checks whether a given string is a base64 / data URL.
 */
export function isDataUrl(url?: string): boolean {
  return typeof url === 'string' && url.startsWith('data:image/');
}

/**
 * Saves an image (DataURL or Blob) into IndexedDB.
 * Returns the asset ID.
 */
export async function saveImageBlob(id: string, dataOrBlob: string | Blob): Promise<string> {
  const db = await getDB();
  const blob: Blob = typeof dataOrBlob === 'string' ? dataUrlToBlob(dataOrBlob) : dataOrBlob;

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put({ id, blob, updatedAt: Date.now() });

    request.onsuccess = () => {
      // Create and cache object URL
      if (blobUrlCache.has(id)) {
        URL.revokeObjectURL(blobUrlCache.get(id)!);
      }
      const objectUrl = URL.createObjectURL(blob);
      blobUrlCache.set(id, objectUrl);
      resolve(id);
    };

    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieves an image as an Object URL from IndexedDB.
 */
export async function getImageBlob(id: string): Promise<string | null> {
  if (blobUrlCache.has(id)) {
    return blobUrlCache.get(id)!;
  }

  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result;
        if (result && result.blob instanceof Blob) {
          const objectUrl = URL.createObjectURL(result.blob);
          blobUrlCache.set(id, objectUrl);
          resolve(objectUrl);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Failed to retrieve image from IndexedDB', err);
    return null;
  }
}

/**
 * Deletes an image from IndexedDB.
 */
export async function deleteImageBlob(id: string): Promise<void> {
  if (blobUrlCache.has(id)) {
    URL.revokeObjectURL(blobUrlCache.get(id)!);
    blobUrlCache.delete(id);
  }

  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Failed to delete image from IndexedDB', err);
  }
}
