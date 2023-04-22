import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { type Context } from "~/server/api/trpc";


export type ProposedLesson = {
  studentName: string;
  studentEmail: string;
  tutorName: string;
  tutorEmail: string;
  startTime: string;
  endTime: string;
  lessonCount: number;
};

const getStudentsAndAvailabilities = async (ctx: Context) => {
  return await ctx.prisma.student.findMany({
    include: {
      availabilities: true,
    },
  });
}

const getTutorsAndAvailabilities = async (ctx: Context) => {
  return await ctx.prisma.tutor.findMany({
    include: {
      availabilities: true,
      lessons: true,
    },
  });
}

const timeOverlap = (tutorStartTime: string, tutorEndTime: string, studentStartTime: string, studentEndTime: string) => {
  return (
    (tutorStartTime <= studentEndTime && tutorEndTime >= studentStartTime) ||
    (tutorEndTime >= studentStartTime && tutorEndTime <= studentEndTime)
  );
}

type TutorLessonCount = Record<number, number>;



const getStudentsWithMatchingTutors = async (ctx: Context) : Promise<ProposedLesson[]> => {
const students = await getStudentsAndAvailabilities(ctx);
  const tutors = await getTutorsAndAvailabilities(ctx);

  const tutorLessonCount : TutorLessonCount = {};
  const proposedLessons : ProposedLesson[] = [];

  tutors.forEach((tutor) => {
    tutorLessonCount[tutor.id] = tutor.lessons.length;
  });

  students.forEach((student) => {
    student.availabilities.forEach((availability) => {
      const matchedTutors = tutors.filter((tutor) =>
        tutor.availabilities.some(
          (tutorAvailability) =>
            timeOverlap(
              tutorAvailability.startTime,
              tutorAvailability.endTime,
              availability.startTime,
              availability.endTime
            )
        )
      );

      if (matchedTutors.length > 0) {
        matchedTutors.sort((a, b) => {
            return tutorLessonCount[a.id] - tutorLessonCount[b.id]
        });

        const selectedTutor = matchedTutors[0];
        tutorLessonCount[selectedTutor.id] += 1;

        proposedLessons.push({
            studentName: student.name,
            studentEmail: student.email,
            tutorName: selectedTutor.name,
            tutorEmail: selectedTutor.email,
            startTime: availability.startTime,
            endTime: availability.endTime,
            lessonCount: 4
        });
      }
    });
  });  

    proposedLessons.sort((a, b) => {
    // Sort by tutorName
    if (a.tutorName < b.tutorName) { return -1; }
    if (a.tutorName > b.tutorName) { return 1; }
    // If tutorNames are equal, sort by startTime
    if (a.startTime < b.startTime) { return -1; }
    if (a.startTime > b.startTime) { return 1; }
    // If both tutorName and startTime are equal, leave the order unchanged
    return 0;
    });
  
  return proposedLessons;
};



export const lessonRouter = createTRPCRouter({ 
  getProposedLessons: privateProcedure.query(async ({ ctx }) => {
    const result = await getStudentsWithMatchingTutors(ctx);
    console.log('result :>> ', result);
    return result;
  })
});
