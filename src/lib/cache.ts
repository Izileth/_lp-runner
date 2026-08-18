export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();
const pendingRequests = new Map<string, Promise<any>>();
const DEFAULT_TTL = 1000 * 60 * 5; // 5 minutos por padrão

export const smartCache = {
  async fetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = DEFAULT_TTL,
    forceRefresh: boolean = false
  ): Promise<T> {
    const now = Date.now();
    
    if (!forceRefresh) {
      const cached = memoryCache.get(key);
      if (cached && now - cached.timestamp < ttl) {
        return cached.data;
      }
      
      if (pendingRequests.has(key)) {
        return pendingRequests.get(key) as Promise<T>;
      }
    }
    
    const request = fetcher().then((data) => {
      memoryCache.set(key, { data, timestamp: Date.now() });
      pendingRequests.delete(key);
      return data;
    }).catch((error) => {
      pendingRequests.delete(key);
      throw error;
    });
    
    pendingRequests.set(key, request);
    return request;
  },
  
  invalidate(keyPrefix: string) {
    for (const key of memoryCache.keys()) {
      if (key.startsWith(keyPrefix) || key === keyPrefix) {
        memoryCache.delete(key);
      }
    }
  },
  
  clear() {
    memoryCache.clear();
  }
};
