import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import { deleteTutorAvailabilitySchema, availabilitySchema } from "~/utils/zodHelpers";


export const tutorAvailabilityRouter = createTRPCRouter({ 
  getAll: publicProcedure.query(({ ctx }) => {
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
  }),
  create: privateProcedure.input(
    availabilitySchema
  ).mutation(async ({ ctx, input }) => {
    const tutor = await ctx.prisma.tutor.upsert({
      where: {
        email: input.email
      },
      update: {},
      create: {
        name: input.name,
        email: input.email
      }
    });
    
     const tutorAvailability = await ctx.prisma.tutorAvailability.upsert({
    where: {
        tutorId_startTime_endTime: {
          tutorId: tutor.id,
          startTime: input.startTime,
          endTime: input.endTime,
        }
      },
      update: {},
      create: {
        startTime: input.startTime,
        endTime: input.endTime,
        tutorId: tutor.id
      }
    })

    return tutorAvailability
  }),
  delete: privateProcedure
  .input(deleteTutorAvailabilitySchema  )
  .mutation(async ({ ctx, input }) => {
    const deletedAvailability = await ctx.prisma.tutorAvailability.deleteMany({
      where: {
        tutorId: input.tutorId,
        startTime: input.startTime,
        endTime: input.endTime,
      },
    });

    return deletedAvailability;
  }),
});
