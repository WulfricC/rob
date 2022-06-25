import { Write, Read } from "../reader-writer.js";
import { uint32, uint16, uint8, int16 } from "./base-encodings.js";


export const string = (format) => {
    return (rw) => {
        const formatRW = format ? format(rw) : uint16(rw);
        const indexRW = uint32(rw);

        if (rw instanceof Write)
            return (value) => {
                if (value === undefined)
                    value = 'undefined';
                else
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

export const variableInt = (rw) => {
    if (rw instanceof Write)
        return (value) => {
            let flag = false;
            for(let i = 5; i >= 0; i --) {
                const chunk = (value >>> (7*i)) & ((1 << 7) - 1);
                if (chunk !== 0 || i === 0) flag = true;
                if (flag) rw.uint8(chunk << 1 | !i);
            }
        };
    if (rw instanceof Read)
        return () => {
            let ans = 0;
            while (true) {
                const chunk = rw.uint8();
                ans = ans << 7 | (chunk >>> 1);
                if (chunk & 1) break;
            }
            return ans;
        };
};