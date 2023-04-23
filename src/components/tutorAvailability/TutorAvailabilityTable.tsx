import { api } from "~/utils/api";
import { type DeleteTutorAvailabilityProps } from "~/utils/zodHelpers";
import { LoadingTable } from "../LoadingTable";

export const TutorAvailabilityTable = () => {
  const { data: tutorAvailabilities, isLoading: tutorsLoading } =
    api.tutorAvailability.getAll.useQuery();

  const ctx = api.useContext();

  const { mutate } = api.tutorAvailability.delete.useMutation({
    onSuccess: () => {
      console.log("Delete availability");
      void ctx.tutorAvailability.getAll.invalidate();
      void ctx.lessons.getProposedLessons.invalidate();
    },
    onError: (e) => {
      console.log("ERROR", e);
    },
  });

  const handleAvailabilityDelete = (props: DeleteTutorAvailabilityProps) => {
    mutate(props);
  };

  if (tutorsLoading) return <LoadingTable />;

  return (
    <div className="overflow-x-auto">
      <h1 className="py-4 text-2xl text-slate-500">
        Step 2: View availability for all tutors
      </h1>
      <table className="w-full border-collapse rounded-lg shadow-lg">
        <thead className="bg-purple-500 text-white">
          <tr>
            <th scope="col" className="px-4 py-2">
              Name
            </th>
            <th scope="col" className="px-4 py-2">
              Email
            </th>
            <th scope="col" className="px-4 py-2">
              Start Time
            </th>
            <th scope="col" className="px-4 py-2">
              End Time
            </th>
            <th scope="col" className="px-4 py-2">
              Delete Availability
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {tutorAvailabilities?.map((tutor) =>
            tutor.availabilities.map((availability) => (
              <tr key={availability.id}>
                <td className="whitespace-nowrap px-4 py-4">{tutor.name}</td>
                <td className="px-4 py-4">{tutor.email}</td>
                <td className="px-4 py-4">{availability.startTime}</td>
                <td className="px-4 py-4">{availability.endTime}</td>
                <td className="px-4 py-4 text-center">
                  <button
                    className="rounded-lg bg-slate-500 p-2 font-medium text-white hover:bg-red-700"
                    onClick={() => {
                      handleAvailabilityDelete({
                        tutorId: tutor.id,
                        startTime: availability.startTime,
                        endTime: availability.endTime,
                      });
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
