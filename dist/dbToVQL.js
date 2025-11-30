export function convertDbToVql(res, dbName) {
    const { args, method } = res;
    const collection = args[0];
    const baseStructure = { db: dbName, d: {} };
    const methodMap = {
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
    if (method !== "add")
        baseStructure.d[method].search = args[1];
    return baseStructure;
}
export function convertRelationVql(res) {
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
    };
}
