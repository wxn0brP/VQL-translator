import SQLParser from "@wxn0brp/db-string-query/sql/index";
import { ValtheraQuery } from "@wxn0brp/db-string-query/types";
import { VQL_Query, VQLUQ } from "@wxn0brp/vql-client/vql";

const sqlParser = new SQLParser();

function convertDbToVql(res: ValtheraQuery, dbName: string): VQL_Query {
    const { args, method } = res;
    const collection = args[0];
    const baseStructure = { db: dbName, d: {} };

    const methodMap: { [key: string]: any } = {
        find: {
            options: args[2],
            searchOpts: args[3]
        },
        findOne: {
            searchOpts: args[2]
        },
        update: {
            updater: args[2]
        },
        updateOne: {
            updater: args[2]
        },
        add: {
            data: args[1]
        }
    };

    baseStructure.d = {
        [method]: methodMap[method] || {}
    };

    baseStructure.d[method].collection = collection;
    if (method !== "add") baseStructure.d[method].search = args[1];

    return baseStructure as VQL_Query;
}

function flattenObject(obj: any, prefix: string = ""): string {
    const pairs: string[] = [];

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            const fullKey = prefix ? `${prefix}.${key}` : key;

            if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                pairs.push(...flattenObject(value, fullKey).split(" ").filter(s => s.length > 0));
            } else if (Array.isArray(value)) {
                pairs.push(`${fullKey}=${JSON.stringify(value)}`);
            } else {
                pairs.push(`${fullKey}=${value}`);
            }
        }
    }

    return pairs.join(" ");
}

export function convert_VQLR_to_VQLS(res: VQL_Query) {
    let string = "";
    if (!("d" in res)) {
        throw new Error("Not implemented yet");
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

function renameKeys(obj: any, oldKey: string, newKey: string): any {
    if (!(oldKey in obj)) return;
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
}

export function s2v(sql: string, dbName: string, string = false): VQLUQ {
    const dbData = sqlParser.parse(sql);
    const vqluq = convertDbToVql(dbData, dbName);

    return string ? convert_VQLR_to_VQLS(vqluq) : vqluq;
}