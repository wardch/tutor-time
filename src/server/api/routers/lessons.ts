import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { type Context } from "~/server/api/trpc";


export type MatchingStudentTutor = {
  studentId: number;
  studentName: string;
  studentEmail: string;
  tutorId: number;
  tutorName: string;
  tutorEmail: string;
  startTime: string;
  endTime: string;
  lessonCount: number;
};

const getStudentsWithMatchingTutors = async (ctx: Context) : Promise<MatchingStudentTutor[]> => {
const result = await ctx.prisma.$queryRaw<MatchingStudentTutor[]>`SELECT
        s.id AS studentId,
        s.name AS studentName,
        s.email AS studentEmail,
        t.id AS tutorId,
        t.name AS tutorName,
        t.email AS tutorEmail,
        sa.startTime AS startTime,
        sa.endTime AS endTime,
        matched_tutors.lesson_count AS lessonCount
    FROM
        Student AS s
        INNER JOIN StudentAvailability AS sa ON s.id = sa.studentId
        INNER JOIN (
            SELECT
                t2.id AS tutor_id,
                ta2.startTime AS start_time,
                ta2.endTime AS end_time,
                COUNT(l.id) AS lesson_count
            FROM
                TutorAvailability AS ta2
                INNER JOIN Tutor AS t2 ON ta2.tutorId = t2.id
                LEFT JOIN Lesson AS l ON l.tutorId = t2.id
            GROUP BY
                t2.id, ta2.startTime, ta2.endTime
        ) AS matched_tutors ON sa.startTime <= matched_tutors.end_time
        AND sa.endTime >= matched_tutors.start_time
        INNER JOIN Tutor AS t ON t.id = matched_tutors.tutor_id
    WHERE
        matched_tutors.tutor_id = (
            SELECT
                t3.id
            FROM
                TutorAvailability AS ta3
                INNER JOIN Tutor AS t3 ON ta3.tutorId = t3.id
                LEFT JOIN Lesson AS l2 ON l2.tutorId = t3.id
            WHERE
                sa.startTime <= ta3.endTime
                AND sa.endTime >= ta3.startTime
            GROUP BY
                t3.id
            ORDER BY
                COUNT(l2.id), t3.id
            LIMIT 1
        );`
  return result;
};



export const lessonRouter = createTRPCRouter({ 
  getProposedLessons: privateProcedure.query(async ({ ctx }) => {
    const result = await getStudentsWithMatchingTutors(ctx);
    console.log('result :>> ', result);
    return result;
  })
});
