import { type ZodType } from "zod";
import * as z from "zod";


export type AvailabilityForm = {
  name: string;
  email: string;
  startTime: string;
  endTime: string;
};

export const availabilitySchema: ZodType<AvailabilityForm> = z.object({
    name: z.string().min(2).max(300),
    email: z.string().email(),
    startTime: z.string(),
    endTime: z.string(),
  });

export type DeleteTutorAvailabilityProps = {
  tutorId: number;
  startTime: string;
  endTime: string;
};


export const deleteTutorAvailabilitySchema: ZodType<DeleteTutorAvailabilityProps> = z.object({
    tutorId: z.number(),
    startTime: z.string(),
    endTime: z.string(),
  });
  
export type DeleteStudentAvailabilityProps = {
  studentId: number;
  startTime: string;
  endTime: string;
};


export const deleteStudentAvailabilitySchema: ZodType<DeleteStudentAvailabilityProps> = z.object({
    studentId: z.number(),
    startTime: z.string(),
    endTime: z.string(),
  });