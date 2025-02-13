import { z } from "zod"

export const formSchema = z.object({
  title: z.string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  voteType: z.enum(["candidate", "rank", "proposal"]),
  startDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Start date must be in the future",
  }),
  endDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: "End date must be in the future",
  }),
  registrationRequired: z.boolean(),
  candidateRegistration: z.enum(["creator", "open"]).optional(),
  maxVoters: z.string()
    .optional()
    .refine((val) => !val || (Number(val) >= 2 && Number(val) <= 10000), {
      message: "Max voters must be between 2 and 10000",
    }),
})