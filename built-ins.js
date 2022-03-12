import { setAlias } from "./alias.js";
import { branch } from "./encodings/flow-encodings.js";
import { object, array, struct } from "./encodings/collection-encodings.js";
import { utf16 } from "./encodings/string-encodings.js";
import { float64, constant, boolean } from "./encodings/base-encodings.js";
import { referencable, reference, any, extern } from "./encodings/reference-encodings.js";

const moduleURL = import.meta.url;

export class _Number {
    static moduleURL = moduleURL;
    static encoding = float64;
}
setAlias(Number, _Number);

export class _Boolean {
    static moduleURL = moduleURL;
    static encoding = boolean;
}
setAlias(Boolean, _Boolean);

export class _String {
    static moduleURL = moduleURL;
    static encoding = referencable(utf16);
}
setAlias(String, _String);

export class _Function {
    static moduleURL = moduleURL;
    static encoding = referencable(extern('esmod'));
}
setAlias(Function, _Function);

export class _Null {
    static moduleURL = moduleURL;
    static encoding = constant(null);
}
setAlias(null, _Null);

export class _Undefined {
    static moduleURL = moduleURL;
    static encoding = constant(undefined);
}
setAlias(undefined, _Undefined);

export class _Object {
    static moduleURL = moduleURL;
    static encoding = referencable(object(Object, _String.encoding, reference));
}
setAlias(Object, _Object);

export class _Array {
    static moduleURL = moduleURL;
    static encoding = branch(
        v => {
            const type = v.reduce((p,c) => (typeof c) === p ? p : 'object', typeof v[0]);
            return [
                'undefined',
                'boolean',
                'number',
                'string',
                'bigint',
                'symbol',
                'function',
                'object',
                ].indexOf(type);
        },
        array(constant(undefined)),
        array(_Boolean.encoding),
        array(_Number.encoding),
        array(_String.encoding),
        referencable(array(any)),
        referencable(array(any)),
        referencable(array(reference)),
        referencable(array(reference)),
    );
}
setAlias(Array, _Array);

export class _Error {
    static moduleURL = moduleURL;
    static encoding = struct(Error, { message: utf16, stack: utf16 });
}
setAlias(Error, _Error);
