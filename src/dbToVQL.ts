import { ValtheraQuery } from "@wxn0brp/db-string-query/types";
import { VQL_Query, VQL_Query_Relation } from "@wxn0brp/vql-client/vql";
import { renameKeys } from "./utils";

export function convertDbToVql(res: ValtheraQuery, dbName: string): VQL_Query {
    const { query, method } = res;

    const baseStructure = {
        db: dbName,
        d: {}
    };

    renameKeys(query, "dbFindOpts", "options");
    renameKeys(query, "findOpts", "searchOpts");

    Object.keys(query).forEach(key => {
        if (key === "search") return;
        const value = query[key];
        if (typeof value === "object" && Object.keys(value).length === 0) {
            delete query[key];
        }
    });

    baseStructure.d = {
        [method]: query
    };

    return baseStructure as VQL_Query;
}

export function convertRelationVql(res: ValtheraQuery): VQL_Query_Relation {
    const { relation } = res;
    return {
        r: {
            path: relation[0],
            search: relation[1],
            relations: relation[2],
            options: relation[3],
            select: relation[4],
            many: true
        }
    }
}
