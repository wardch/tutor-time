import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { availabilitySchema, type AvailabilityForm } from "~/utils/zodHelpers";

export const TutorAvailabilityForm = () => {
  const { register, handleSubmit } = useForm<AvailabilityForm>({
    resolver: zodResolver(availabilitySchema),
  });

  const ctx = api.useContext();

  const { mutate } = api.tutorAvailability.create.useMutation({
    onSuccess: () => {
      console.log("SUCCESS POSTING");
      void ctx.tutorAvailability.getAll.invalidate();
    },
    onError: (e) => {
      console.log("ERROR", e);
    },
  });

  const submit = (data: AvailabilityForm) => {
    mutate(data);
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        options.push(
          <option key={time} value={time}>
            {time}
          </option>
        );
      }
    }
    return options;
  };

  /* eslint-disable */

  return (
    <div className="flex w-full justify-center py-4">
      <div className="flex flex-col items-center justify-center gap-5">
        <p className="text-2xl font-light text-slate-500">Please enter tutor availability below</p>
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
            Start Time
          </label>
          <select
            id="startTime"
            className="bg-slate-200 p-2 text-slate-700"
            defaultValue="08:00"
            {...register("startTime")}
          >
            {generateTimeOptions()}
          </select>
          <label htmlFor="endTime" className="pt-4">
            End Time
          </label>
          <select
            id="endTime"
            className="bg-slate-200 p-2 text-slate-700"
            defaultValue="10:00"
            {...register("endTime")}
          >
            {generateTimeOptions()}
          </select>
          <div className="pt-4">
            <input
              className="w-full rounded bg-slate-500 p-2 text-white"
              type="submit"
              value="Add Availability"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
