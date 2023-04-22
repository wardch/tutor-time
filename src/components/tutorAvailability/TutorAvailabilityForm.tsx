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
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl">Tutors Availability</h1>
        <form onSubmit={handleSubmit(submit)} className="p-4 flex flex-col">
          <input type="text" placeholder="Tutor's name" {...register("name")} />
          <input
            type="email"
            placeholder="Tutor Email"
            {...register("email")}
          />
          <label className="text-slate-400" htmlFor="startTime">
            Choose Start Time:
          </label>
          <select
            id="startTime"
            defaultValue="08:00"
            {...register("startTime")}
          >
            {generateTimeOptions()}
          </select>
          <label htmlFor="endTime" className="text-slate-400">
            Choose End Time:
          </label>
          <select id="endTime" defaultValue="10:00" {...register("endTime")}>
            {generateTimeOptions()}
          </select>
          <input type="submit" value="Add Availability" />
        </form>
      </div>
    </div>
  );
};
