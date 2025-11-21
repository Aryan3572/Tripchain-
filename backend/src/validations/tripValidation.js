// src/validations/tripValidation.js
import { z } from "zod";

export const tripSchema = z.object({
  from: z.string().min(2, "Origin is required"),
  to: z.string().min(2, "Destination is required"),

  mode: z
    .string()
    .transform((val) => val.toLowerCase())
    .refine(
      (val) => ["car", "bus", "train", "walk", "bike", "cab", "scooter"].includes(val),
      { message: "Invalid mode" }
    ),

  distance: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .refine((val) => val > 0, { message: "Distance must be positive" }),

  duration: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .refine((val) => val > 0, { message: "Duration must be positive" }),

  date: z.string().datetime("Invalid date format"),
});
