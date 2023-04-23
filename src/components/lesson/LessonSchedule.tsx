import { useCallback, useEffect, useState } from "react";
import { api } from "~/utils/api";
import { type ProposedLesson } from "~/server/api/routers/lessons";

export const LessonSchedule = () => {
  const [proposedLessons, setProposedLessons] = useState<ProposedLesson[]>([]);
  useEffect(() => {
    onGenerateScheduleClick();
  });

  const proposedLessonsQuery = api.lessons.getProposedLessons.useQuery();

  const onGenerateScheduleClick = useCallback(() => {
    const { data } = proposedLessonsQuery;
    if (!data) {
      console.log("No data returning");
      return;
    }
    setProposedLessons(data);
  }, [proposedLessonsQuery]);

  return (
    <div className="py-8">
      <div className="overflow-x-auto">
        <h1 className="py-4 text-2xl text-slate-500">
          Step 5: View the proposed lesson schedule
        </h1>
        <p className="py-4 text-slate-500">
          Add or remove tutors and students above to dynamically update the
          schedule. The schedule will evenly distribute students amongst tutors.
          Tutors are matched with students who have shared availability. We
          preferentially assign to tutors who have lower lesson counts, then
          tutors with higher lesson counts.
        </p>
        <table className="w-full border-collapse  rounded-lg shadow-lg">
          <thead className="bg-purple-500 text-white">
            <tr>
              <th scope="col" className="px-4 py-2">
                Tutor Name
              </th>
              <th scope="col" className="px-4 py-2">
                Tutor Email
              </th>
              <th scope="col" className="px-4 py-2">
                Student Name
              </th>
              <th scope="col" className="px-4 py-2">
                Student Email
              </th>
              <th scope="col" className="px-4 py-2">
                Start Time
              </th>
              <th scope="col" className="px-4 py-2">
                End Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {proposedLessons?.map((proposedLesson, index) => (
              <tr key={`proposed-lesson-${index}`}>
                <td className="whitespace-nowrap px-4 py-4">
                  {proposedLesson.tutorName}
                </td>
                <td className="px-2 py-4">{proposedLesson.tutorEmail}</td>
                <td className="px-2 py-4">{proposedLesson.studentName}</td>
                <td className="px-2 py-4">{proposedLesson.studentEmail}</td>
                <td className="px-2 py-4">{proposedLesson.startTime}</td>
                <td className="px-2 py-4">{proposedLesson.endTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
