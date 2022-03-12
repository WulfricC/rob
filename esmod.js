import { ExternScheme } from "./scheme-handler.js";
import { objectFollowPath } from "../utils.js";


export class EsModExtern extends ExternScheme {
    getURI(item) {
        if (typeof item.name !== 'string')
            throw new Error(`Cannot find valid name for item, Name is: "${item.name}"`);
        if (!('moduleURL' in item))
            throw new Error(`Cannot find moduleURL for item with name ${item.name}`);
        return esmodUri(item.moduleURL, item.name);
    }
    async getItem(uri) {
        return importEsmod(uri);
    }
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
        url = location.origin + url.replace('file://', '').replace(cwd, '');
    }
    url = url.replace(/^\w+:/g, 'esmod:');
    if (path.length > 0)
        url = url + '#' + path.join('.');
    return url;
}
