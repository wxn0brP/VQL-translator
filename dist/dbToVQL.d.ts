import { ValtheraQuery } from "@wxn0brp/db-string-query/types";
import { VQL_Query, VQL_Query_Relation } from "@wxn0brp/vql-client/vql";
export declare function convertDbToVql(res: ValtheraQuery, dbName: string): VQL_Query;
export declare function convertRelationVql(res: ValtheraQuery): VQL_Query_Relation;
