import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import {
  studentAvailabilitySchema,
  type StudentAvailabilityFormProps,
} from "~/utils/zodHelpers";

export const StudentAvailabilityForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentAvailabilityFormProps>({
    resolver: zodResolver(studentAvailabilitySchema),
  });

  const ctx = api.useContext();

  const { mutate } = api.studentAvailability.create.useMutation({
    onSuccess: () => {
      console.log("SUCCESS POSTING");
      void ctx.studentAvailability.getAll.invalidate();
    },
    onError: (e) => {
      console.log("ERROR", e);
    },
  });

  const submit = (data: StudentAvailabilityFormProps) => {
    const endTime = add30Minutes(data.startTime);
    mutate({ ...data, endTime });
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

  const add30Minutes = (time: string): string => {
    const [hoursStr, minutesStr] = time.split(":");
    if (!hoursStr || !minutesStr) {
      throw new Error("Invalid time format");
    }
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    if (isNaN(hours) || isNaN(minutes)) {
      throw new Error("Invalid time format");
    }
    let newHours = hours;
    let newMinutes = minutes + 30;
    if (newMinutes >= 60) {
      newHours = (newHours + 1) % 24;
      newMinutes -= 60;
    }
    return `${newHours.toString().padStart(2, "0")}:${newMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  /* eslint-disable */

  return (
    <div className="flex w-full justify-center py-4">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl">Students Availability</h1>
        <form onSubmit={handleSubmit(submit)} className="p-4">
          <input
            type="text"
            placeholder="Student's name"
            {...register("name")}
          />
          {errors.name && <span>{errors.name.message}</span>}
          <input
            type="email"
            placeholder="Student Email"
            {...register("email")}
          />
          {errors.email && <span>{errors.email.message}</span>}
          <label className="text-slate-400" htmlFor="startTime">
            Choose Start Time:
          </label>
          {errors.startTime && <span>{errors.startTime.message}</span>}
          <select
            id="startTime"
            defaultValue="08:00"
            {...register("startTime")}
          >
            {generateTimeOptions()}
          </select>
          <input type="submit" value="Add Availability" />
        </form>
      </div>
    </div>
  );
};
