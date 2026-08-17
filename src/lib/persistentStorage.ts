// IndexedDB & LocalStorage hybrid persistence engine to ensure data is never lost on refresh
const DB_NAME = 'luxor_catalog_db';
const STORE_NAME = 'luxor_store';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save data to both IndexedDB (no quota limit) and LocalStorage (synchronous fallback).
 */
export async function savePersistentData<T>(key: string, value: T): Promise<void> {
  if (typeof window === 'undefined') return;

  // 1. Always save full high-resolution data into IndexedDB first (virtually unlimited quota)
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(value, key);
  } catch (idbErr) {
    console.error(`IndexedDB put error for ${key}:`, idbErr);
  }

  // 2. Try LocalStorage for fast synchronous fallback
  try {
    const jsonString = JSON.stringify(value);
    localStorage.setItem(key, jsonString);
  } catch (lsErr) {
    console.warn(`LocalStorage setItem failed for ${key} (quota exceeded). Stored in IndexedDB safely.`, lsErr);
    try {
      if (Array.isArray(value)) {
        const lightweight = value.map((item: any) => {
          if (item && typeof item === 'object' && item.imageUrl && item.imageUrl.length > 100000) {
            return { ...item, imageUrl: undefined };
          }
          return item;
        });
        localStorage.setItem(key, JSON.stringify(lightweight));
      }
    } catch {
      // Ignore LocalStorage fallback error
    }
  }
}

/**
 * Synchronous initial load from LocalStorage.
 */
export function syncLoadPersistentData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed !== undefined && parsed !== null) {
        if (Array.isArray(parsed) && parsed.length === 0 && Array.isArray(fallback) && fallback.length > 0) {
          return fallback;
        }
        return parsed;
      }
    }
  } catch {
    // Ignore error
  }
  return fallback;
}

/**
 * Asynchronous full load from IndexedDB (preserves heavy custom images & complete data).
 */
export async function loadPersistentData<T>(key: string, fallback: T): Promise<T> {
  if (typeof window === 'undefined') return fallback;

  // 1. Try IndexedDB first
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(key);
    
    const result = await new Promise<T | undefined>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    if (result !== undefined && result !== null) {
      if (Array.isArray(result) && result.length === 0 && Array.isArray(fallback) && fallback.length > 0) {
        return fallback;
      }
      return result;
    }
  } catch (idbErr) {
    console.warn(`IndexedDB read error for ${key}:`, idbErr);
  }

  // 2. LocalStorage fallback
  return syncLoadPersistentData(key, fallback);
}
