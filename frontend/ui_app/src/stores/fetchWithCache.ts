import { StoreNames, GlobalStore } from ".";

/**
 * Generic cache-backed fetch utility for IndexedDB-backed stores.
 *
 * This function checks the specified IndexedDB store for an existing value by key.
 * If found, it returns the cached value. If not, it calls the provided fetchFn,
 * stores the result in the cache, and returns it.
 *
 * @template T - The type of the value to fetch and cache.
 * @param {Object} params
 * @param {GlobalStore} params.store - The store instance (e.g., from useStore).
 * @param {string} params.storeName - The name of the store (e.g., StoreNames.fileContentStore).
 * @param {string} params.key - The unique key for the item (e.g., contentId).
 * @param {() => Promise<T>} params.fetchFn - Async function to fetch the data if not in cache.
 * @returns {Promise<T>} The cached or freshly fetched value.
 *
 * @example
 *   const result = await fetchWithCache({
 *     store: fileContentStore,
 *     storeName: StoreNames.fileContentStore,
 *     key: contentId,
 *     fetchFn: async () => fetchRemoteData()
 *   });
 */
export async function fetchWithCache<T>({
    store, // e.g. useStore(StoreNames.fileContentStore, true)
    storeName, // e.g. StoreNames.fileContentStore
    key, // unique key for the item (e.g. contentId)
    fetchFn, // async function to fetch the data if not in cache
}: {
    store: GlobalStore;
    storeName: StoreNames[keyof StoreNames];
    key: string;
    fetchFn: () => Promise<T>;
}): Promise<T> {
    const existing = await store.db.getItem(storeName, key);
    if (existing) return existing;
    const result = await fetchFn();
    store.set(key, result);
    return result;
}
