import { NOT_FOUND } from "./symbols.js";
import { BiMap,unwrap } from "../utils/mod.js";
import { EsModExtern } from "./esmod.js";

export class HttpExtern {
    getURI(item) {
        if (! typeof item.url !== string) throw new Error(`Valid url cannot be determined, http wrapper objects must have a property url.`);
        return new URL(item.url, location.origin);
    }
    getItem(uri) {
        return fetch(uri);
    }
}

export const COMMUNICATION_SCHEMES =  {esmod: new EsModExtern, http: new HttpExtern};

export class ExternHandler {

    #cache;
    #schemeHandlers;

    constructor(schemeHandlers = COMMUNICATION_SCHEMES) {
        this.#cache = new BiMap();
        this.#schemeHandlers = schemeHandlers;
        this.register('cache:notfound', NOT_FOUND);
    }

    /** Add an item with uri to the cache */
    register(uri, item) {
        this.#cache.set(uri, item);
        return item;
    }

    /** Get the URI corresponding to the item when using scheme */
    getURI(scheme, item) {
        if (!(scheme in this.#schemeHandlers))
            throw new Error(unwrap`
            Scheme "${scheme}:" is not supported. 
            No scheme handler has been defined.  This
            may be to prevent a security vunerability
            caused by importing arbritary data.`);
        if (this.#cache.hasValue(item))
            return this.#cache.getKey(item);
        const uri = this.#schemeHandlers[scheme].getURI(item);
        if (!this.#cache.hasKey(uri)) 
            this.#cache.set(uri, item);
        return uri;
    }
    

    /** Fetch the item of the uri */
    getItem(uri) {
        const scheme = uri.match(/^(\w+)(:)/)[1];

        if (!(scheme in this.#schemeHandlers))
            throw new Error(unwrap`
            Scheme "${scheme}:" is not supported. 
            No scheme handler has been defined.  This
            may be to prevent the security vunerability
            caused by importing arbritary data.`);
        
            if (this.#cache.hasKey(uri)) 
            return this.#cache.getValue(uri);

        const item = this.#schemeHandlers[scheme].getItem(uri);
        
        if (item instanceof Promise)
            return item.then(v => this.#cache.set(uri, v));
        else {
            this.#cache.set(uri, item)
            return item;
        }
    }

    /** Remove an item from the cache */
    clear(uri) {
        this.#cache.deleteKey(uri);
    }

    /** Cache */
    get cache () {
        return this.#cache;
    }
}