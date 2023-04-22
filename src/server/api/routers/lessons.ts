import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const lessonRouter = createTRPCRouter({ 
  getProposedLessons: privateProcedure.query(({ ctx }) => {
     const tutors = ctx.prisma.tutor.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          availabilities: {
            select: {
              id: true,
              startTime: true,
              endTime: true,
            },
          },
        },
      });

  return tutors;
  })
});
