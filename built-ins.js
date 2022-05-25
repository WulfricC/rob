import { setAlias } from "./alias.js";
import { branch } from "./encodings/flow-encodings.js";
import { object, array, struct } from "./encodings/collection-encodings.js";
import { utf16, variableInt } from "./encodings/string-encodings.js";
import { float64, constant, boolean } from "./encodings/base-encodings.js";
import { referencable, reference, any, extern, Namespace } from "./encodings/reference-encodings.js";

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

const AsyncFunction = (async () => {}).constructor;
export class _AsyncFunction {
    static moduleURL = moduleURL;
    static encoding = referencable(extern('esmod'));
}
setAlias(AsyncFunction, _AsyncFunction);

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
            function getType(item) {
                if (typeof item === 'number')
                    if(Number.isInteger(item) && Math.abs(item) < 4294967296) return 'integer';
                else return 'number';
                return typeof item;
            }
            let type = getType(v[0]);
            for (const i of v) {
                const t = getType(i);
                if (type !== t) {
                    type = t;
                    break;
                }
            }
            return [
                'undefined',
                'boolean',
                'number',
                'string',
                'bigint',
                'symbol',
                'function',
                'object',
                'integer',
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
        array(variableInt)
    );
}
setAlias(Array, _Array);

export class _Module {
    static moduleURL = moduleURL;
    static encoding = extern('link');
}
setAlias(Namespace, _Module);

export class _Error {
    static moduleURL = moduleURL;
    static encoding = struct(Error, { message: utf16, stack: utf16 });
}
setAlias(Error, _Error);

export class _RangeError {
    static moduleURL = moduleURL;
    static encoding = struct(RangeError, { message: utf16, stack: utf16 });
}
setAlias(RangeError, _RangeError);

export class _ReferenceError {
    static moduleURL = moduleURL;
    static encoding = struct(ReferenceError, { message: utf16, stack: utf16 });
}
setAlias(ReferenceError, _ReferenceError);

export class _SyntaxError {
    static moduleURL = moduleURL;
    static encoding = struct(SyntaxError, { message: utf16, stack: utf16 });
}
setAlias(SyntaxError, _SyntaxError);

export class _TypeError {
    static moduleURL = moduleURL;
    static encoding = struct(TypeError, { message: utf16, stack: utf16 });
}
setAlias(TypeError, _TypeError);

export class _URIError {
    static moduleURL = moduleURL;
    static encoding = struct(URIError, { message: utf16, stack: utf16 });
}
setAlias(URIError, _URIError);

export class _EvalError {
    static moduleURL = moduleURL;
    static encoding = struct(EvalError, { message: utf16, stack: utf16 });
}
setAlias(EvalError, _EvalError);