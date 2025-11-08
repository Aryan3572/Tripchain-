// src/validations/tripValidation.js
import { z } from "zod";

export const tripSchema = z.object({
  from: z.string().min(2, "Origin is required"),
  to: z.string().min(2, "Destination is required"),
  mode: z.enum(["car", "bus", "train", "walk", "bike", "cab", "scooter"]),
  distance: z.number().positive("Distance must be positive"),
  duration: z.number().positive("Duration must be positive"),
  date: z.string().datetime("Invalid date format"),
});
