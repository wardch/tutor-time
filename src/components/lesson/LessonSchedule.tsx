import { useCallback, useState } from "react";
import { api } from "~/utils/api";
import { type ProposedLesson } from "~/server/api/routers/lessons";

export const LessonSchedule = () => {
  const [proposedLessons, setProposedLessons] = useState<ProposedLesson[]>([]);
  const proposedLessonsQuery = api.lessons.getProposedLessons.useQuery();

  const onGenerateScheduleClick = useCallback(() => {
    const { data } = proposedLessonsQuery;
    if (!data) {
      console.log("No data returning");
      return;
    }
    setProposedLessons(data);
  }, [proposedLessonsQuery]);

  if (proposedLessons.length === 0) {
    return (
      <div className="flex">
        <button
          className="rounded bg-purple-500 p-4"
          onClick={() => onGenerateScheduleClick()}
        >
          Click to Propose Schedule
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center py-4">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl">Proposed Lessons</h1>
        <table className="border-collapse border border-gray-500">
          <thead>
            <tr>
              <th className="border border-gray-400 p-2">Tutor Name</th>
              <th className="border border-gray-400 p-2">Tutor Email</th>
              <th className="border border-gray-400 p-2">Student Name</th>
              <th className="border border-gray-400 p-2">Student Email</th>
              <th className="border border-gray-400 p-2">Start Time</th>
              <th className="border border-gray-400 p-2">End Time</th>
            </tr>
          </thead>
          <tbody>
            {proposedLessons.map((proposedLesson, index) => (
              <tr key={`proposed-lesson-row-${index}`}>
                <td className="border border-gray-400 p-2">
                  {proposedLesson.tutorName}
                </td>
                <td className="border border-gray-400 p-2">
                  {proposedLesson.tutorEmail}
                </td>
                <td className="border border-gray-400 p-2">
                  {proposedLesson.studentName}
                </td>
                <td className="border border-gray-400 p-2">
                  {proposedLesson.studentEmail}
                </td>
                <td className="border border-gray-400 p-2">
                  {proposedLesson.startTime}
                </td>
                <td className="border border-gray-400 p-2">
                  {proposedLesson.endTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
