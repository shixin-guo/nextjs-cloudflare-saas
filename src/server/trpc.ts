import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getDB, type DB } from './db';
interface CreateContextOptions {
  env: CloudflareEnv;
  db: DB
  req?: Request;
  res?: Response;
}

export const createContext = async (opts: CreateContextOptions) => {
  return {
    env: opts.env,
    db: getDB(opts.env.DATABASE),
    req: opts.req,
    res: opts.res,
  };
};

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure; 