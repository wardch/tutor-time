import { createTRPCRouter } from "~/server/api/trpc";
import { tutorAvailabilityRouter } from "./routers/tutorAvailability";
import { studentAvalabiltyRouter } from "./routers/studentAvailability";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tutorAvailability: tutorAvailabilityRouter,
  studentAvailability: studentAvalabiltyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
