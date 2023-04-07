import {LocalCache} from './Local.js';
const localCache = new Map();

// returns instances of the local cache identified by a key
async function getInstance(cName: string): Promise<LocalCache> {
    let cache = localCache.get(cName);
    if(!cache) {
        cache = new LocalCache(cName);
        localCache.set(cName, cache);
    }
    return cache;
}

export default {
    async set(cName: string, key: string, val: string, ttl: number) {
        const cache = await getInstance(cName);
        return cache.save(key, val, ttl);
    },
    async update(cName: string, key: string, val: string, ) {
        const cache = await getInstance(cName);
        return cache.update(key, val);
    },
    async describe(cName: string) {
        const cache = await getInstance(cName);
        return cache.describe();
    },
    async find(cName: string, key: string) {
        const cache = await getInstance(cName);
        return cache.find(key);
    },
    async clear(cName: string, key: string) {
        const cache = await getInstance(cName);
        return cache.clear(key);
    },
    async clearCache(cName: string) {
        const cache = await getInstance(cName);
        await cache.flush();
        localCache.delete(cName);
    },
    async getInstance(cName: string) {
        return getInstance(cName);
    }
};