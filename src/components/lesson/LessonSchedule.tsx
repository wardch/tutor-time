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
    <div>
      <div className="overflow-x-auto">
        <h1 className="py-4 text-2xl text-slate-500">Proposed Lessons</h1>
        <table className="w-full border-collapse  rounded-lg shadow-lg">
          <thead className="bg-purple-600 text-white">
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
          <tbody className="divide-y divide-gray-200">
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
        <div className="flex py-8">
          <button
            className="rounded bg-purple-500 p-4 text-white"
            onClick={() => onGenerateScheduleClick()}
          >
            Regenerate Schedule
          </button>
        </div>
    </div>
  );
};
