import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import {
  studentAvailabilitySchema,
  type AvailabilityForm,
  type StudentAvailabilityFormProps,
} from "~/utils/zodHelpers";
import { add30Minutes, generateTimeOptions } from "../helpers/time";
import { LoadingSpinner } from "../loadingSpinner";

export const StudentAvailabilityForm = () => {
  const { register, handleSubmit } = useForm<AvailabilityForm>({
    resolver: zodResolver(studentAvailabilitySchema),
  });

  const ctx = api.useContext();

  const { mutate, isLoading: isAddingAvailability } =
    api.studentAvailability.create.useMutation({
      onSuccess: () => {
        console.log("SUCCESS POSTING");
        void ctx.studentAvailability.getAll.invalidate();
        void ctx.lessons.getProposedLessons.invalidate();
      },
      onError: (e) => {
        console.log("ERROR", e);
      },
    });

  const submit = (data: StudentAvailabilityFormProps) => {
    const endTime = add30Minutes(data.startTime);
    mutate({ ...data, endTime });
  };

  /* eslint-disable */

  return (
    <div className="flex w-full justify-center py-4">
      <div className="flex flex-col items-center justify-center gap-5">
        <p className="text-2xl font-light text-slate-500">
          Step 3: Enter a student's availability
        </p>
        <form
          onSubmit={handleSubmit(submit)}
          className="flex w-96 flex-col rounded bg-white p-4"
        >
          <label className="">Name</label>
          <input
            className="bg-slate-200 p-2"
            type="text"
            {...register("name")}
          />
          <label className="pt-4">Email</label>
          <input
            type="email"
            className="bg-slate-200 p-2"
            {...register("email")}
          />
          <label className="pt-4" htmlFor="startTime">
            Start Time for 30 min class
          </label>
          <select
            id="startTime"
            className="bg-slate-200 p-2 text-slate-700"
            defaultValue="08:00"
            {...register("startTime")}
          >
            {generateTimeOptions()}
          </select>
          <div className="pt-4">
            {isAddingAvailability && <LoadingSpinner />}
            {!isAddingAvailability && (
              <input
                className="w-full rounded bg-purple-500 p-2 text-white"
                type="submit"
                value="Add Availability"
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
