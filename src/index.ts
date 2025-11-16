import { convert_VQLR_to_VQLS, s2v } from "./s2v";

const sql = `SELECT * FROM users WHERE id = 1`;
const db = "db1";

const vql = s2v(sql, db, false);
console.dir(vql, { depth: null });
console.log(convert_VQLR_to_VQLS(vql as any));