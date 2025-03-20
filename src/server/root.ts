import { createTRPCRouter } from './trpc';
import { helloRouter } from './routers/hello';

export const appRouter = createTRPCRouter({
  hello: helloRouter,
  // Add your routers here
  // example: exampleRouter,
});

export type AppRouter = typeof appRouter; 