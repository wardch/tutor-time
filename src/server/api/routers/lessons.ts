import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { type Context } from "~/server/api/trpc";
import { type Tutor as PrismaTutor, type Lesson, type Student as PrismaStudent, type StudentAvailability, type TutorAvailability } from "@prisma/client";


type StudentWithLessons = PrismaStudent & {
  lessons: Lesson[];
} & {
  availabilities: StudentAvailability[]
}

type TutorWithLessons = PrismaTutor & {
  lessons: Lesson[];
} & {
  availabilities: TutorAvailability[]
}



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
      lessons: true
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
    tutorStartTime === studentStartTime && tutorEndTime === studentEndTime
  );
}

type TutorLessonCount = Record<number, number>;



const getStudentsWithMatchingTutors = ({tutors, students} : {tutors: TutorWithLessons[], students: StudentWithLessons[] }) => {
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
            return (tutorLessonCount[a.id] ?? 0) - (tutorLessonCount[b.id] ?? 0)
        });

        const selectedTutor = matchedTutors[0];
        
        if(!selectedTutor) {
            console.log(`NO TUTOR FOUND FOR STUDENT: ${student.name} EMAIL: ${student.email}`)
            return;
        }
        selectedTutor.availabilities = selectedTutor.availabilities.filter((tutorAvailability) => {
            return !timeOverlap(
                tutorAvailability.startTime,
                tutorAvailability.endTime,
                availability.startTime,
                availability.endTime
            )
        })
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
    const tutors = await getTutorsAndAvailabilities(ctx);
    const students = await getStudentsAndAvailabilities(ctx);
    const result = getStudentsWithMatchingTutors({tutors, students});
    return result;
  })
});
