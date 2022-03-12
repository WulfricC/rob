import { Write, Read } from "../reader-writer.js";
import { uint32, uint16 } from "./base-encodings.js";


export const string = (format) => {
    return (rw) => {
        const formatRW = format ? format(rw) : uint16(rw);
        const indexRW = uint32(rw);

        if (rw instanceof Write)
            return (value) => {
                value = value.toString();
                const length = value.length;
                indexRW(length);
                for (let i = 0; i < length; i++)
                    formatRW(value.codePointAt(i));
            };

        if (rw instanceof Read)
            return () => {
                const length = indexRW();
                const array = new Array(length);
                for (let i = 0; i < length; i++)
                    array[i] = formatRW();
                return String.fromCharCode(...array);
            };
    };
};

export const uint7 = (rw) => (value) => rw.uint8(value % 128);
export const ascii = string(uint7);
export const utf16 = string(uint16);