export class Write{
    #dataView;
    #position = 0;
    #buffer;
    #bufferSize;
    #blobs;
    constructor(externHandler, header = []) {
        this.externs = externHandler;
        this.references = new Map();
        this.#bufferSize = 1024
        this.#buffer = new ArrayBuffer(this.#bufferSize);
        this.#dataView = new DataView(this.#buffer);
        this.#blobs = [];

        this.#position = 0;
        this.i = 0;
        for (const ref of header)
            this.set(this.newId(), ref);
    }
    #grow () {
        if(this.#position < this.#bufferSize - 16) return;
        this.#bufferSize *= 2;
        this.#blobs.push([this.#dataView, this.#position]);
        this.#buffer = new ArrayBuffer(this.#bufferSize);
        this.#dataView = new DataView(this.#buffer);
        this.#position = 0;
    }
    toBuffer() {
        this.#blobs.push([this.#dataView, this.#position]);
        const totalLength = this.#blobs.reduce((s,v) => s + v[1], 0);
        const outputBuffer = new ArrayBuffer(totalLength);
        const dataView = new DataView(outputBuffer);
        let offset = 0;
        for (const [blob, length] of this.#blobs) {
            for (let i = 0; i < length; i++)
                dataView.setUint8(offset + i, blob.getUint8(i));
            offset += length;
        }
        return outputBuffer;
    }
    newId () {
        return this.i ++;
    }
    set(index, value) {
        if (this.has(value))
            return this.get(value);
        this.references.set(value, index);
        return index;
    }
    has(value) {
        return this.references.has(value);
    }
    get(value) {
        return this.references.get(value);
    }

    bigUint64(value) {
        this.#dataView.setBigUint64(this.#position, value);
        this.#position += 8;
        this.#grow();
    }
    bigInt64(value) {
        this.#dataView.setBigInt64()(this.#position, value);
        this.#position += 8;
        this.#grow();
    }
    float64(value) {
        this.#dataView.setFloat64(this.#position, value);
        this.#position += 8;
        this.#grow();
    }
    float32(value) {
        this.#dataView.setFloat32(this.#position, value);
        this.#position += 4;
        this.#grow();
    }
    uint32(value) {
        this.#dataView.setUint32(this.#position, value);
        this.#position += 4;
        this.#grow();
    }
    int32(value) {
        this.#dataView.setInt32(this.#position, value);
        this.#position += 4;
        this.#grow();
    }
    uint16(value) {
        this.#dataView.setUint16(this.#position, value);
        this.#position += 2;
        this.#grow();
    }
    int16(value) {
        this.#dataView.setInt16(this.#position, value);
        this.#position += 2;
        this.#grow();
    }
    uint8(value) {
        this.#dataView.setUint8(this.#position, value);
        this.#position += 1;
        this.#grow();
    }
    int8(value) {
        this.#dataView.setInt8(this.#position, value);
        this.#position += 1;
        this.#grow();
    }
}

/** create a reader which reads from 'buffer'.  header must be same as writer's header */
export class Read{
    #dataView;
    #position;
    #buffer;
    constructor(externHandler, buffer, header = []) {
        this.references = new Map();
        this.externs = externHandler;
        this.#buffer = buffer;
        this.#dataView = new DataView(buffer);
        this.#position = 0;
        this.i = 0;
        for (const ref of header)
            this.set(this.newId(), ref);
    }
    newId () {
        return this.i ++;
    }
    set(index, value) {
        this.references.set(index, value);
        return value;
    }
    has(index) {
        return this.references.has(index);
    }
    get(index) {
        return this.references.get(index);
    }

    bigUint64() {
        const v = this.#dataView.getBigUint64(this.#position);
        this.#position += 8;
        return v;
    }
    bigInt64() {
        const v = this.#dataView.getBigInt64(this.#position);
        this.#position += 8;
        return v;
    }
    float64() {
        const v = this.#dataView.getFloat64(this.#position);
        this.#position += 8;
        return v;
    }
    float32() {
        const v = this.#dataView.getFloat32(this.#position);
        this.#position += 4;
        return v;
    }
    uint32() {
        const v = this.#dataView.getUint32(this.#position);
        this.#position += 4;
        return v;
    }
    int32() {
        const v = this.#dataView.getInt32(this.#position);
        this.#position += 4;
        return v;
    }
    uint16() {
        const v = this.#dataView.getUint16(this.#position);
        this.#position += 2;
        return v;
    }
    int16() {
        const v = this.#dataView.getInt16(this.#position);
        this.#position += 2;
        return v;
    }
    uint8() {
        const v = this.#dataView.getUint8(this.#position);
        this.#position += 1;
        return v;
    }
    int8() {
        const v = this.#dataView.getInt8(this.#position);
        this.#position += 1;
        return v;
    }
}