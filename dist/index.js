import SQLParser from "@wxn0brp/db-string-query/sql/index";
import { convertDbToVql, convertRelationVql } from "./dbToVQL.js";
import { convert_VQLR_to_VQLS } from "./VQLR_to_VQLS.js";
const sqlParser = new SQLParser();
export function SQL_TO_VQL(sql, dbName, string = false) {
    const dbData = sqlParser.parse(sql, { defaultDbKey: dbName });
    const vqluq = dbData.method === "relation-find" ?
        convertRelationVql(dbData) :
        convertDbToVql(dbData, dbName);
    return string ? convert_VQLR_to_VQLS(vqluq) : vqluq;
}
