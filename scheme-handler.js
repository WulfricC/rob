
export class ExternScheme {
    /**should generate a uri from an item*/
    static getURI(item) {
        throw new Error(`Default SchemeHandler has no functionality, getURI needs extending.`);
    }
    /**should fetch or create an item from a uri*/
    static getItem(uri) {
        throw new Error(`Default SchemeHandler has no functionality, getItem needs extending.`);
    }
}
