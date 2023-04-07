import NodeCache from 'node-cache';
import h from '../helper.js';

const DEFAULT_TTL_S  = 60*60*24; //24h
const MAX_INSTANCES_ALLOWED = 10;

interface ICacheDescription {
    name: string,
    ttl: number,
    maxSize: number
}

export class LocalCache {
    defaultTTL: number
    maxSize: number
    cacheName: string
    myCache: NodeCache

    constructor(name: string, ttl:number= DEFAULT_TTL_S, max:number = MAX_INSTANCES_ALLOWED) {
        this.defaultTTL = ttl;
        this.maxSize = max;
        this.cacheName = name;
        this.myCache = new NodeCache();
    }
    describe(): ICacheDescription {
        return {
            name: this.cacheName,
            ttl: this.defaultTTL,
            maxSize: this.maxSize,
        };
    }
    instance(): NodeCache {
        return this.myCache;
    }
    async find(key: string): Promise<any> {
        const val:string|undefined = this.instance().get(key);
        if(h.isJson(val)) return JSON.parse(val!);
        return val;
    }
    async save(key:string, val:any, ttl:number = this.defaultTTL): Promise<any> {
        const data = (typeof val === 'object' && h.isJson(JSON.stringify(val))) ? JSON.stringify(val) : val;
        const stats = await this.instance().getStats();
        if(stats.keys >= this.maxSize) {
            const keys = this.instance().keys();
            this.instance().del(keys[0]);
        }
        return this.instance().set(key, data, ttl);
    }
    async update(key:string, updated:any): Promise<any> {
        if(this.instance().has(key)) {
            const ttl = this.instance().getTtl(key);
            this.instance().del(key);
            return this.instance().set(key, updated, ttl!);
        }
        return undefined;
    }
    async clear(key:string): Promise<any> {
        return this.instance().take(key);
    }
    async flush(): Promise<any> {
        return this.flush();
    }
}