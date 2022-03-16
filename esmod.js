import { ExternScheme } from "./scheme-handler.js";
import { objectFollowPath } from "../utils/mod.js";


export class EsModExtern extends ExternScheme {
    constructor() {
        super();
        this.cache = new Map();
    }
    getURI(item) {
        if (typeof item.name !== 'string') {
            console.log('item');
            throw new Error(`Cannot find valid name for item "${item}", Name is: "${item.name}"`);
        }
        if (!('moduleURL' in item))
            throw new Error(`Cannot find moduleURL for item with name ${item.name}`);
        return esmodUri(item.moduleURL, item.name);
    }
    async getItem(uri) {
        if(this.cache.has(uri)) return this.cache.get(uri);
        const item = importEsmod(uri);
        this.cache.set(uri, item);
        return item;
    }
}

export function checkEsmod(item) {
    return typeof item.name !== 'string' && 'moduleURL' in item;
}

export async function importEsmod(uri) {
    const url = new URL(uri);
    if (url.protocol !== 'esmod:')
        throw new Error(`invalid esmod uri: ${uri}`);
    const fileUrl = (url.host === 'localhost' && globalThis.Deno 
        ? 'file://' + ('/' + Deno.cwd().replaceAll('\\', '/')).replace('//', '/') + url.pathname
        : uri.replace(/^\w+:/g, 'http:')).replace(/#.*/, '');
    const path = uri.match(/(?<=#)[\w\.]+(?=\?|$)/)[0].split('.');
    const module = await import(fileUrl);
    const item = objectFollowPath(module, path);
    if (item === undefined)
        throw new Error(`Item at ${uri} could not be found. Does it need exporting?`);
    return item;
}

export function esmodUri(url, path) {
    if (!Array.isArray(path))
        path = [path];
    const scheme = url.match(/^\w+:/g)[0];
    if (scheme === 'file:' && globalThis.Deno) {
        const cwd = ('/' + Deno.cwd().replaceAll('\\', '/')).replace('//', '/');
        url = (location?.origin ?? 'http://localhost') + url.replace('file://', '').replace(cwd, '');
    }
    url = url.replace(/^\w+:/g, 'esmod:');
    if (path.length > 0)
        url = url + '#' + path.join('.');
    return url;
}
