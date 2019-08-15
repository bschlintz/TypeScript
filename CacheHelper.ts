/**
 * Utilizes Web Storage API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
 * 
 * Example Usage: 
 * 
 *    import CacheHelpler from '../path/to/CacheHelper';
 *    ...
 *    
 *    let data = CacheHelper.get(CacheHelper.GLOBAL_CACHE_KEY, 'NavigationItems');
 *   
 *    if (!data) {
 *      data = await fetchData();
 *      let expiresInTicks = 1000 * 60 * 15; // 15 minutes
 *      CacheHelper.set(CacheHelper.GLOBAL_CACHE_KEY, 'NavigationItems', data, expiresInTicks, 'session');
 *    }
 *   
 *    renderMenu(data);
 */

export const GLOBAL_CACHE_KEY = "MyAppGlobalCacheKey";

/**
 * Helper function to get an item by key and subkey from session storage
 */
export const get = (key: string, subKey: string, location: 'session' | 'local' = 'session') => {
  try {
    const storage = location === 'session' ? sessionStorage : localStorage;
    const valueStr = storage.getItem(key);
    if (valueStr) {
      const val = JSON.parse(valueStr);
      const subVal = val[subKey];
      if (subVal) {
        return !(subVal.expiration && Date.now() > subVal.expiration) ? subVal.payload : null;
      }
    }
    return null;
  }
  catch (error) {
    console.error(`[CacheHelper] Error on get(): ${error}. Additional Details: key: ${key}; subKey: ${subKey}; location: ${location}`);
    return null;
  }
};

/**
 * Helper function to set an item by key and subkey into session storage
 */
export const set = (key: string, subKey: string, payload: any, expiresInTicks?: number, location: 'session' | 'local' = 'session') => {
  try {
    const storage = location === 'session' ? sessionStorage : localStorage;
    const nowTicks = Date.now();
    const expiration = (undefined !== expiresInTicks ? nowTicks + expiresInTicks : null);
    const valueStr = storage.getItem(key) || "{}";
    let cache = JSON.parse(valueStr);
    cache[subKey] = { payload, expiration };
    storage.setItem(key, JSON.stringify(cache));
    return get(key, subKey);
  }
  catch (error) {
    console.error(`[CacheHelper] Error on set(): ${error}. Additional Details: key: ${key}; subKey: ${subKey}; expiresInTicks: ${expiresInTicks}; location: ${location}`);
    return null;
  }
};

export default { get, set, GLOBAL_CACHE_KEY };
