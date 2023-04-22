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
    
    const existingAvailability = await ctx.prisma.tutorAvailability.findFirst({
    where: {
      tutorId: tutor.id,
      startTime: {
        lte: input.endTime,
      },
      endTime: {
        gte: input.startTime,
      },
    },
  });

  let tutorAvailability;
  console.log('existingAvailability :>> ', existingAvailability);

  if (existingAvailability) {
    tutorAvailability = await ctx.prisma.tutorAvailability.update({
      where: {
        id: existingAvailability.id,
      },
      data: {
        startTime: input.startTime < existingAvailability.startTime ? input.startTime : existingAvailability.startTime,
        endTime: input.endTime > existingAvailability.endTime ? input.endTime : existingAvailability.endTime,
      },
    });
  } else {
    tutorAvailability = await ctx.prisma.tutorAvailability.create({
      data: {
        tutorId: tutor.id,
        startTime: input.startTime,
        endTime: input.endTime,
      },
    });
  }

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
