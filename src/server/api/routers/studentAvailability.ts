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
    
    const existingAvailability = await ctx.prisma.studentAvailability.findFirst({
    where: {
      studentId: student.id,
      startTime: {
        lte: input.endTime,
      },
      endTime: {
        gte: input.startTime,
      },
    },
  });

  let studentAvailability;

  if (existingAvailability) {
    studentAvailability = await ctx.prisma.studentAvailability.update({
      where: {
        id: existingAvailability.id,
      },
      data: {
        startTime: input.startTime < existingAvailability.startTime ? input.startTime : existingAvailability.startTime,
        endTime: input.endTime > existingAvailability.endTime ? input.endTime : existingAvailability.endTime,
      },
    });
  } else {
    studentAvailability = await ctx.prisma.studentAvailability.create({
      data: {
        studentId: student.id,
        startTime: input.startTime,
        endTime: input.endTime,
      },
    });
  }

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
