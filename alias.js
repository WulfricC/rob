const aliases = new Map();
export function setAlias (item, cls) {
    aliases.set(item, cls)
}
export function hasAlias (item) {
    return aliases.has(item);
}
export function getAlias (item) {
    return aliases.get(item);
}