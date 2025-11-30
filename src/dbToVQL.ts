import { ValtheraQuery } from "@wxn0brp/db-string-query/types";
import { VQL_Query, VQL_Query_Relation } from "@wxn0brp/vql-client/vql";

export function convertDbToVql(res: ValtheraQuery, dbName: string): VQL_Query {
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

export function convertRelationVql(res: ValtheraQuery): VQL_Query_Relation {
    const { args } = res;
    return {
        r: {
            path: args[0],
            search: args[1],
            relations: args[2],
            options: args[3],
            select: args[4],
            many: true
        }
    }
}
