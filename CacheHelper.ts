/**
 * Utilizes Web Storage API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
 * 
 * Example Usage: 
 *    import CacheHelpler from '../path/to/CacheHelper';
 *    ...
 *    let data = CacheHelper.get(CacheHelper.GLOBAL_CACHE_KEY, 'NavigationItems');
 *    if (!data) {
 *      data = await fetchData();
 *      let expiresInTicks = 1000 * 60 * 15; // 15 minutes
 *      CacheHelper.set(CacheHelper.GLOBAL_CACHE_KEY, 'NavigationItems', data, expiresInTicks, 'session');
 *    }
 *    renderMenu(data);
 */

export const GLOBAL_CACHE_KEY = "MyAppGlobalCacheKey";

/**
 * Helper function to get an item by key and subkey from local or session storage
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
 * Helper function to set an item by key and subkey into local or session storage
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

/**
 * Microsoft provides programming examples for illustration only, without warranty either expressed or implied, including, but 
 * not limited to, the implied warranties of merchantability and/or fitness for a particular purpose. We grant You a nonexclusive, 
 * royalty-free right to use and modify the Sample Code and to reproduce and distribute the object code form of the Sample Code, 
 * provided that You agree: (i) to not use Our name, logo, or trademarks to market Your software product in which the Sample Code 
 * is embedded; (ii) to include a valid copyright notice on Your software product in which the Sample Code is embedded; and (iii) 
 * to indemnify, hold harmless, and defend Us and Our suppliers from and against any claims or lawsuits, including attorneys' fees, 
 * that arise or result from the use or distribution of the Sample Code.
 */