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

    #schemeHandlers;

    constructor(schemeHandlers = COMMUNICATION_SCHEMES) {
        this.#schemeHandlers = schemeHandlers;
    }

    /** Get the URI corresponding to the item when using scheme */
    getURI(scheme, item) {
        if (!(scheme in this.#schemeHandlers))
            throw new Error(unwrap`
            Scheme "${scheme}:" is not supported. 
            No scheme handler has been defined.  This
            may be to prevent a security vunerability
            caused by importing arbritary data. Supported
            schemes are ${Object.keys(this.#schemeHandlers).join(', ')}`);
        const uri = this.#schemeHandlers[scheme].getURI(item);
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

        const item = this.#schemeHandlers[scheme].getItem(uri);
        return item;
    }

    /** call the clear value for certain schemes which may cache values */
    clear(uri) {
        const scheme = uri.match(/^(\w+)(:)/)[1];
        if (!(scheme in this.#schemeHandlers))
            throw new Error(unwrap`
            Scheme "${scheme}:" is not supported. 
            No scheme handler has been defined.  This
            may be to prevent the security vunerability
            caused by importing arbritary data.`);
        this.#schemeHandlers[scheme].clear(uri);
    }
}