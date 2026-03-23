export function flattenObject(obj, prefix = "") {
    const pairs = [];
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                pairs.push(...flattenObject(value, fullKey).split(" ").filter(s => s.length > 0));
            }
            else if (Array.isArray(value)) {
                pairs.push(`${fullKey}=${JSON.stringify(value)}`);
            }
            else {
                pairs.push(`${fullKey}=${value}`);
            }
        }
    }
    return pairs.join(" ");
}
export function renameKeys(obj, oldKey, newKey) {
    if (!(oldKey in obj))
        return;
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
}
