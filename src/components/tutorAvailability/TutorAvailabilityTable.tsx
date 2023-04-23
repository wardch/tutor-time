import { api } from "~/utils/api";
import { type DeleteTutorAvailabilityProps } from "~/utils/zodHelpers";

export const TutorAvailabilityTable = () => {
  const { data: tutorAvailabilities } = api.tutorAvailability.getAll.useQuery();

  const ctx = api.useContext();

  const { mutate } = api.tutorAvailability.delete.useMutation({
    onSuccess: () => {
      console.log("Delete availability");
      void ctx.tutorAvailability.getAll.invalidate();
    },
    onError: (e) => {
      console.log("ERROR", e);
    },
  });

  const handleAvailabilityDelete = (props: DeleteTutorAvailabilityProps) => {
    mutate(props);
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg">
      <h1 className="text-2xl py-4 text-slate-500">Available Tutors</h1>
      <table className="w-full border-collapse">
        <thead className="bg-purple-600 text-white">
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
        <tbody className="divide-y divide-gray-200">
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
