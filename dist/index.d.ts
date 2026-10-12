import { VQLUQ } from "@wxn0brp/vql-client/vql";
import { ValtheraQuery } from "@wxn0brp/db-string-query/types";
export interface SV_Ref {
    dbData?: ValtheraQuery;
}
export declare function SQL_TO_VQL(sql: string, dbName: string, string?: boolean, ref?: SV_Ref): VQLUQ;
