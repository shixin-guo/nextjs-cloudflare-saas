import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { greetings } from '../db/schema';
import { nanoid } from 'nanoid';
import { sql } from 'drizzle-orm';
export const helloRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ name: z.string()}))
    .query(async ({ input, ctx }) => {
      const db = ctx.db
      const result = await db.insert(greetings).values({
        id: nanoid(),
        name: nanoid(),
        greeting: input.name
      }).returning();

      return {
        result
      };
    }),

  // Optional: Add a query to get all greetings
  getGreetings: publicProcedure.query(async ({ ctx }) => {
    const db = ctx.db
    const result = await db.query.greetings.findMany() 
    return {
      result
    };
  }),
}); 