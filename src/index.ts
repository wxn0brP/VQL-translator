import SQLParser from "@wxn0brp/db-string-query/sql/index";
import { VQLUQ } from "@wxn0brp/vql-client/vql";
import { convertDbToVql, convertRelationVql } from "./dbToVQL";
import { convert_VQLR_to_VQLS } from "./VQLR_to_VQLS";
import { ValtheraQuery } from "@wxn0brp/db-string-query/types";

const sqlParser = new SQLParser();

export interface SV_Ref {
    dbData?: ValtheraQuery;
}

export function SQL_TO_VQL(sql: string, dbName: string, string = false, ref: SV_Ref = {}): VQLUQ {
    const dbData = sqlParser.parse(sql, { defaultDbKey: dbName });
    ref.dbData = dbData;

    const vqluq = dbData.method === "relation-find" ?
        convertRelationVql(dbData) :
        convertDbToVql(dbData, dbName);

    return string ? convert_VQLR_to_VQLS(vqluq) : vqluq;
}