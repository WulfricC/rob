import { Write, Read } from "../reader-writer.js";
import { uint32 } from "./base-encodings.js";
import { any, referencable } from "./reference-encodings.js";
import { utf16 } from "./string-encodings.js";

/**arrays of data*/
export const array = (format) => (rw) => {
    const formatRW = format(rw);
    const index = uint32(rw);

    if (rw instanceof Write)
        return (value, id) => {
            if(id) rw.set(id, value);
            const length = value.length;
            index(length);
            for (let i = 0; i < length; i++)
                formatRW(value[i]);
        };

    if (rw instanceof Read)
        return async (id) => {
            const length = index();
            const array = new Array(length);
            //console.log('my id is', id)
            if (id) rw.set(id, array);
            
            for (let i = 0; i < length; i++) {
                const value = formatRW();
                if (value instanceof Promise)
                    array[i] = await value;
                else array[i] = value;
            }
            return array;
        };
};

/**key value pairs of an object, always referencable to allow for circular references */
export const object = (constructor, keyFormat, valueFormat) => {
    return (rw) => {
        const keysFormatRW = array(keyFormat)(rw);
        const valuesFormatRW = array(valueFormat)(rw);

        if (rw instanceof Write)
            return (value, id) => {
                if(id) rw.set(id, value);
                keysFormatRW(Object.keys(value));
                valuesFormatRW(Object.values(value));
            };

        if (rw instanceof Read)
            return async (id) => {
                const obj = Object.create(constructor.prototype);
                if (id) rw.set(id, obj);
                const keys = await keysFormatRW();
                const values = await valuesFormatRW();
                for (let i = 0; i < keys.length; i++)
                    obj[keys[i]] = values[i];
                return obj;
            };
    };
};

/**structured data in the form of struct, always referencable to allow for circular references*/
export const struct = (constructor, structure) => {
    return (rw) => {
        if (rw instanceof Write)
            return (value, id) => {
                if(id) rw.set(id, value);
                for (const k in structure)
                    structure[k](rw)(value[k]);
            };

        if (rw instanceof Read)
            return async (id) => {
                const obj = Object.create(constructor.prototype);
                if (id) rw.set(id, obj);
                for (const k in structure)
                    obj[k] = await structure[k](rw)();
                return obj;
            };
    };
};

/**structured data in the form of struct, always referencable to allow for circular references*/
export const tuple = (...formats) => {
    return (rw) => {
        if (rw instanceof Write)
            return (value, id) => {
                if(id) rw.set(id, value);
                for (let i = 0; i < formats.length; i++)
                    formats[i](rw)(value[i]);
            };

        if (rw instanceof Read)
            return async (id) => {
                const arr = new Array(formats.length);
                if(id) rw.set(id, arr);
                for (let i = 0; i < formats.length; i++)
                    arr[i] = await formats[i](rw)();
                return arr;
            };
    };
};

export const type = (constructor) => {
    return referencable(object(constructor, referencable(utf16), referencable(any)));
}