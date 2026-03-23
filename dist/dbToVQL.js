import { renameKeys } from "./utils.js";
export function convertDbToVql(res, dbName) {
    const { query, method } = res;
    const baseStructure = {
        db: dbName,
        d: {}
    };
    renameKeys(query, "dbFindOpts", "options");
    renameKeys(query, "findOpts", "searchOpts");
    Object.keys(query).forEach(key => {
        if (key === "search")
            return;
        const value = query[key];
        if (typeof value === "object" && Object.keys(value).length === 0) {
            delete query[key];
        }
    });
    baseStructure.d = {
        [method]: query
    };
    return baseStructure;
}
export function convertRelationVql(res) {
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
    };
}
