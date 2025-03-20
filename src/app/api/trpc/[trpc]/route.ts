import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { type NextRequest } from 'next/server';
import { appRouter } from '@/server/root';
import { createContext } from '@/server/trpc';
import { db, getDB } from '@/server/db';
export const runtime = "edge";
const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext({ 
      env: {
        // these are from Cloudflare when using wrangler
        DATABASE: process.env.DATABASE,
        AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
        AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
        AUTH_SECRET:  process.env.AUTH_SECRET
      }, 
      db: getDB(process.env.DATABASE),
      req 
    }),
  });

export { handler as GET, handler as POST };