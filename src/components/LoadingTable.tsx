import { LoadingSpinner } from "./loadingSpinner";

export const LoadingTable = () => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-lg">
      <h1 className="py-4 text-2xl text-slate-500">Available Tutors</h1>
      <table className="w-full border-collapse">
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
        <tbody className="divide-y divide-gray-200">
          <tr>
            <td className="text-center">
              <LoadingSpinner />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
