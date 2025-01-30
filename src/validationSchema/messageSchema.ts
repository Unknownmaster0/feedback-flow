import { z } from "zod";

const messageZodSchema = z.object({
  content: z
    .string()
    .min(1, { message: "message is required" })
    .max(500, { message: "message should be less than 500 characters" }),
});

export default messageZodSchema;
