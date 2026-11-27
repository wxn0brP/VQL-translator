import { flattenObject, renameKeys } from "./utils.js";
const opPrefixes = {
    add: "+",
    update: "~",
    remove: "-",
    updateOneOrAdd: "?",
    toggleOne: "^",
    count: "#",
    bulkAdd: "*",
};
const oneOps = new Set([
    "findOne",
    "updateOne",
    "removeOne",
]);
const collectionOps = new Set([
    "ensureCollection",
    "issetCollection",
    "removeCollection",
]);
export function convert_VQLR_to_VQLS(res) {
    let string = "";
    if (!("d" in res)) {
        return "Relation cannot be converted to VQLS";
    }
    const d = res.d;
    const opName = Object.keys(d)[0];
    const op = d[opName];
    if (opName === "getCollections")
        return `${res.db} getCollections`;
    if (collectionOps.has(opName))
        return `${res.db} ${opName} ${op.collection}`;
    let collection = op.collection;
    const baseOp = opName === "f" ? "findOne" : opName;
    if (opPrefixes[baseOp])
        collection = opPrefixes[baseOp] + collection;
    else if (oneOps.has(baseOp))
        collection += "!";
    delete op.collection;
    renameKeys(op, "search", "s");
    renameKeys(op, "data", "d");
    renameKeys(op, "options", "o");
    renameKeys(op, "updater", "u");
    if (op.searchOpts?.select) {
        op.select = op.searchOpts.select.reduce((obj, key) => {
            obj[key] = 1;
            return obj;
        }, {});
        delete op.searchOpts.select;
    }
    renameKeys(op, "select", "e");
    const args = flattenObject(op);
    string += `${res.db} ${collection} ${args}`;
    return string;
}
