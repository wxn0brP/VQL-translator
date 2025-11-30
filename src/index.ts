import SQLParser from "@wxn0brp/db-string-query/sql/index";
import { VQLUQ } from "@wxn0brp/vql-client/vql";
import { convertDbToVql, convertRelationVql } from "./dbToVQL";
import { convert_VQLR_to_VQLS } from "./VQLR_to_VQLS";

const sqlParser = new SQLParser();

export function SQL_TO_VQL(sql: string, dbName: string, string = false): VQLUQ {
    const dbData = sqlParser.parse(sql, { defaultDbKey: dbName });
    const vqluq = dbData.method === "relation-find" ?
        convertRelationVql(dbData) :
        convertDbToVql(dbData, dbName);

    return string ? convert_VQLR_to_VQLS(vqluq) : vqluq;
}