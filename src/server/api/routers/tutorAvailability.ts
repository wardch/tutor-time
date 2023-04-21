import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import { schema } from "~/utils/zodHelpers";

export const tutorAvailabilityRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tutorAvailability.findMany();
  }),
  create: privateProcedure.input(
    schema
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
    
    const tutorAvailability = await ctx.prisma.tutorAvailability.create({
      data: {
        tutorId: tutor.id,
        startTime: input.startTime,
        endTime: input.endTime,
      }
    })

    return tutorAvailability
  })
});
