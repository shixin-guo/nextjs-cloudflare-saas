import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema";
console.log('process.env.DATABASE ==> ', process.env.DATABASE);
export const getDB = (ctxDb: D1Database) => {
    return drizzle(ctxDb, { schema, logger: false });
}
export const db = drizzle(process.env.DATABASE, { schema, logger: false });
export type DB = typeof db