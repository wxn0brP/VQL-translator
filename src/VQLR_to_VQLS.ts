import { VQL_Query } from "@wxn0brp/vql-client/vql";
import { flattenObject, renameKeys } from "./utils";

export function convert_VQLR_to_VQLS(res: VQL_Query) {
    let string = "";
    if (!("d" in res)) {
        return "Relation cannot be converted to VQLS";
    }

    const d = res.d;
    const opName = Object.keys(d)[0];
    const op = d[opName];
    let collection = op.collection;
    let baseOp = opName.replace("One", "");

    if (baseOp === "find") { }
    else if (baseOp === "update") collection = "~" + collection;
    else if (baseOp === "remove") collection = "-" + collection;
    else if (baseOp === "add") collection = "+" + collection;
    else if (opName === "updateOneOrAdd") collection = "updateOneOrAdd " + collection;

    if (opName.endsWith("One")) collection += "!";

    delete op.collection;
    renameKeys(op, "search", "s");
    renameKeys(op, "data", "d");
    renameKeys(op, "options", "o");
    renameKeys(op, "updater", "u");
    if (op.searchOpts?.select) {
        op.select = op.searchOpts.select.reduce((obj: any, key: string) => {
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