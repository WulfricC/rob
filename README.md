# ROB (Remote Object Binary)
A flexible way for allowing typed javascript data, and javascript objects and instances to be stored and/or sent over networks.

## Disclaimer
This is a personal project.  If you use any of this code it will become a huge security liability.  ROB allows for arbritary code to be run, XSS attacks etc really really easily if misued. All of these notes are for my own purposes, mainly so that I do not forget how to use my own software, not for anyone else.  I think this is an interesting project but it is not an idea which should be even considered in production use.

## Basic Encoding and Decoding Example
```javascript
// handles reading and writing to buffers etc
import { Read, Write } from "./rob/reader-writer.js";

// handles how externs (objects referenced by URIs) are handled
import { ExternHandler } from "./rob/extern-handler.js";

// the most general encoding type
import { any } from "./rob/encodings.js";


const objectToEncode = {};

// encoding the data to an arrayBuffer
const writer = new Write(new ExternHandler);
any(writer)(objectToEncode);
const buffer = writer.toBuffer();

// send or recieve data here

// decoding the data from an arrayBuffer
const reader = new Read(new ExternHandler, buffer);
const output = await any(reader)();
```