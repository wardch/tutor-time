import { type ZodType } from "zod";
import * as z from "zod";


export type TutorForm = {
  name: string;
  email: string;
  startTime: string;
  endTime: string;
};

// rename this to somthing more unqiue
export const schema: ZodType<TutorForm> = z.object({
    name: z.string().min(2).max(300),
    email: z.string().email(),
    startTime: z.string(),
    endTime: z.string(),
  });