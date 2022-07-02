import { Read, Write } from "../reader-writer.js";
import { ascii, variableInt } from "./string-encodings.js"
import { getAlias, hasAlias } from "../alias.js";

/**format as a reference to the item, if item has not been stored, format as format*/
export const referencable = (format) => (rw) => {
    const formatRW = format(rw);
    const indexRW = variableInt(rw);

    if (rw instanceof Write)
        return (value) => {
            if (rw.has(value)) {
                indexRW(rw.get(value) << 1);
            }
            else {
                const id = rw.newId();
                indexRW(id << 1 | 1);
                formatRW(value, id);
                rw.set(id, value);
            }
        };

    if (rw instanceof Read) {
        return () => {
            const reference = indexRW();
            const id = reference >>> 1;
            if (reference & 1) {
                const item = formatRW(id);
                if (item instanceof Promise)
                    return item.then(v => rw.set(id,v))
                rw.set(id,item);
                return item;
            }
            if (rw.has(id))
                return rw.get(id);
            throw new EvalError(`item at ${id} has not yet been referenced`);
        };
    }
};

/**external object, handled via the passed in ExternHandler*/
export const extern = (scheme) => (rw) => {
    const text = ascii(rw);
        if (rw instanceof Write)
        return (value) => {
            const uri = rw.externs.getURI(scheme, value);
            text(uri);
        };

    if (rw instanceof Read)
        return () => {
            const uri = text();
            const item = rw.externs.getItem(uri);
            return item;
        };
};

/**placeholder class for namespaces */
export class Namespace {};

/**format link to external formatting with item*/
export const any = (rw) => {
    const pointerRW = referencable(extern('esmod'))(rw);
    if (rw instanceof Write) return (value) => {
        let cls;
        if (value === null || value === undefined || typeof value === 'symbol')
            cls = value;
        else if (typeof value === 'object' && !(value instanceof Object))
            cls = Namespace;
        else cls = value.constructor;
        if (hasAlias(cls)) cls = getAlias(cls);
        try{
            pointerRW(cls);
        }
        catch(err) {
            console.log(value, hasAlias(cls))
            throw err;
        }
        if (!cls.encoding) {
            throw new EvalError(`No valid encoding found for object of type: ${cls.name}`)
        }
        return cls.encoding(rw)(value);
    }
    if (rw instanceof Read) return () => {
        const cls = pointerRW();
        if (cls instanceof Promise)
            return cls.then(c => c.encoding(rw)());
        else
            return cls.encoding(rw)()
    }
}

/**format as a reference to the item*/
export const reference = referencable(any);