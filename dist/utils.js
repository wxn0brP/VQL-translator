export function flattenObject(obj, prefix = "") {
    const pairs = [];
    for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
            const value = obj[key];
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (typeof value === "object" &&
                value !== null &&
                !Array.isArray(value)) {
                pairs.push(...flattenObject(value, fullKey)
                    .split(" ")
                    .filter(s => s.length > 0));
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
export function stripIdentQuotes(value) {
    return value.replace(/^[`"]|[`"]$/g, "");
}
export function normalizeFieldName(value, collection) {
    const field = value
        .trim()
        .replace(/\s+AS\s+.+$/i, "")
        .trim();
    const segments = field
        .split(".")
        .map(segment => stripIdentQuotes(segment))
        .filter(Boolean);
    if (collection && segments.length > 1 && segments[0] === collection)
        segments.shift();
    return segments.join(".");
}
const logicalKeys = new Set([
    "$and",
    "$or",
    "$nor",
]);
export function normalizeSearch(search, collection) {
    if (!search || typeof search !== "object" || Array.isArray(search))
        return search;
    const result = {};
    for (const [key, value] of Object.entries(search)) {
        if (logicalKeys.has(key) && Array.isArray(value)) {
            result[key] = value.map(entry => normalizeSearch(entry, collection));
        }
        else if (key === "$not") {
            result[key] = normalizeSearch(value, collection);
        }
        else if (key.startsWith("$")) {
            result[key] = normalizeOperatorValue(value, collection);
        }
        else {
            result[normalizeFieldName(key, collection)] = value;
        }
    }
    return result;
}
function normalizeOperatorValue(value, collection) {
    if (!value || typeof value !== "object" || Array.isArray(value))
        return value;
    const result = {};
    for (const [field, fieldValue] of Object.entries(value)) {
        result[field.startsWith("$") ? field : normalizeFieldName(field, collection)] = fieldValue;
    }
    return result;
}
