import { api } from "~/utils/api";
import { type DeleteStudentAvailabilityProps } from "~/utils/zodHelpers";

export const StudentAvailabilityTable = () => {
  const { data: studentAvailabilities } = api.studentAvailability.getAll.useQuery();

  const ctx = api.useContext();

  const { mutate } = api.studentAvailability.delete.useMutation({
    onSuccess: () => {
      console.log("Delete availability");
      void ctx.studentAvailability.getAll.invalidate();
    },
    onError: (e) => {
      console.log("ERROR", e);
    },
  });

  const handleAvailabilityDelete = (props: DeleteStudentAvailabilityProps) => {
    mutate(props);
  };

  return (
    <div className="relative overflow-x-auto p-4">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-500 text-xs uppercase">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Start Time
            </th>
            <th scope="col" className="px-6 py-3">
              End Time
            </th>
            <th scope="col" className="px-6 py-3">
              Delete Availability
            </th>
          </tr>
        </thead>
        <tbody>
          {studentAvailabilities?.map((student) => 
            student.availabilities.map((availability) => (
              <tr key={availability.id} className="border-b bg-slate-100">
                <th
                  scope="row"
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-900"
                >
                  {student.name}
                </th>
                <td className="px-6 py-4">{student.email}</td>
                <td className="px-6 py-4">{availability.startTime}</td>
                <td className="px-6 py-4">{availability.endTime}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      handleAvailabilityDelete({
                        studentId: student.id,
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
