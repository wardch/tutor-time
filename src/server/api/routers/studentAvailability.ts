import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import { availabilitySchema, deleteStudentAvailabilitySchema } from "~/utils/zodHelpers";

export const studentAvalabiltyRouter = createTRPCRouter({ 
  getAll: publicProcedure.query(({ ctx }) => {
     const students = ctx.prisma.student.findMany({
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

  return students;
  }),
  create: privateProcedure.input(
    availabilitySchema
  ).mutation(async ({ ctx, input }) => {
    const student = await ctx.prisma.student.upsert({
      where: {
        email: input.email
      },
      update: {},
      create: {
        name: input.name,
        email: input.email
      }
    });
    
    const studentAvailability = await ctx.prisma.studentAvailability.upsert({
    where: {
      studentId: student.id
      },
      update: {},
      create: {
        startTime: input.startTime,
        endTime: input.endTime,
        studentId: student.id
      }
    })

    return studentAvailability
  }),
  delete: privateProcedure
  .input(deleteStudentAvailabilitySchema )
  .mutation(async ({ ctx, input }) => {
    const deletedAvailability = await ctx.prisma.studentAvailability.deleteMany({
      where: {
        studentId: input.studentId,
        startTime: input.startTime,
        endTime: input.endTime,
      },
    });

    return deletedAvailability;
  }),
});
