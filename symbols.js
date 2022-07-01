import { constant } from "./encodings/base-encodings.js";
import { setAlias } from "./alias.js";
import { struct } from "./encodings.js";

const moduleURL = import.meta.url;

export const UNINITIALIZED = Symbol('UNINITIALIZED');
export class _UNINITIALIZED {
    static moduleURL = moduleURL;
    static encoding = constant(UNINITIALIZED);
}
setAlias(UNINITIALIZED, _UNINITIALIZED);

export const NOT_FOUND = Symbol('NOT_FOUND');
export class _NOT_FOUND {
    static moduleURL = moduleURL;
    static encoding = constant(NOT_FOUND);
}
setAlias(NOT_FOUND, _NOT_FOUND);