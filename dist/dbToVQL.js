import { normalizeFieldName, normalizeSearch, renameKeys } from "./utils.js";
export function convertDbToVql(res, dbName) {
    const { query, method } = res;
    const baseStructure = {
        db: dbName,
        d: {},
    };
    renameKeys(query, "dbFindOpts", "options");
    renameKeys(query, "findOpts", "searchOpts");
    normalizeQueryIdentifiers(query);
    Object.keys(query).forEach(key => {
        if (key === "search")
            return;
        const value = query[key];
        if (typeof value === "object" && Object.keys(value).length === 0) {
            delete query[key];
        }
    });
    baseStructure.d = {
        [method]: query,
    };
    return baseStructure;
}
function normalizeQueryIdentifiers(query) {
    const collection = query.collection;
    if (Array.isArray(query.searchOpts?.select)) {
        query.searchOpts.select = query.searchOpts.select.map((field) => normalizeFieldName(field, collection));
    }
    if (Array.isArray(query.searchOpts?.exclude)) {
        query.searchOpts.exclude = query.searchOpts.exclude.map((field) => normalizeFieldName(field, collection));
    }
    if (query.search) {
        query.search = normalizeSearch(query.search, collection);
    }
    if (typeof query.options?.sortBy === "string") {
        query.options.sortBy = normalizeFieldName(query.options.sortBy);
    }
    if (typeof query.options?.groupBy === "string") {
        query.options.groupBy = normalizeFieldName(query.options.groupBy);
    }
    else if (Array.isArray(query.options?.groupBy)) {
        query.options.groupBy = query.options.groupBy.map((field) => normalizeFieldName(field));
    }
}
export function convertRelationVql(res) {
    const { relation } = res;
    const findOpts = relation[3];
    const dbFindOpts = relation[4];
    return {
        r: {
            path: relation[0],
            search: relation[1],
            relations: relation[2],
            ...(dbFindOpts && Object.keys(dbFindOpts).length
                ? {
                    options: dbFindOpts,
                }
                : {}),
            ...(findOpts?.select
                ? {
                    select: findOpts.select,
                }
                : {}),
            many: true,
        },
    };
}
