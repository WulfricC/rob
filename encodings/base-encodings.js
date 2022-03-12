import {Read, Write} from '../reader-writer.js';

export const bigUint64 = (rw) => (value) => rw.bigUint64(value);
export const bigInt64 = (rw) => (value) => rw.bigInt64(value);
export const float64 = (rw) => (value) => rw.float64(value);
export const float32 = (rw) => (value) => rw.float32(value);
export const uint32 = (rw) => (value) => rw.uint32(value);
export const int32 = (rw) => (value) => rw.int32(value);
export const uint16 = (rw) => (value) => rw.uint16(value);
export const int16 = (rw) => (value) => rw.int16(value);
export const uint8 = (rw) => (value) => rw.uint8(value);
export const int8 = (rw) => (value) => rw.int8(value);
export const constant = (value) => () => () => value;
export const boolean = (rw) => {
    if (rw instanceof Write) return (value) => rw.int8(value === true ? 1 : 0);
    if (rw instanceof Read) return () => !!rw.int8();
}