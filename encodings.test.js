import {assertEquals, assertThrows} from "https://deno.land/std@0.146.0/testing/asserts.ts";
import "./built-ins.js";
import { Read, Write } from "./reader-writer.js";
import { ExternHandler } from "./extern-handler.js";
import { any } from "./encodings.js";

const test = Deno.test;

test("basic object encoding example", async () => {
    const objectToEncode = {};

    // encoding the data to an arrayBuffer
    const writer = new Write(new ExternHandler);
    any(writer)(objectToEncode);
    const buffer = writer.toBuffer();

    // decoding the data from an arrayBuffer
    const reader = new Read(new ExternHandler, buffer);
    const output = await any(reader)();

    assertEquals(objectToEncode, output);
});

class TestClass {
    static moduleURL = import.meta.url;
}

test("encoder fails when an encoding is not defined for a type", () => {
    const inst = new TestClass();

    // encoding the data to an arrayBuffer
    const writer = new Write(new ExternHandler);
    const w = any(writer);
    
    assertThrows(() => {
        w(inst);
    },
    EvalError,
    `No valid encoding found for object of type: ${TestClass.name}`);
});
