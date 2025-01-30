import { z } from "zod";
import { emailZodSchema, passwordZodSchema } from "./signUpSchema";

const signInZodSchema = z.object({
  email: emailZodSchema,
  password: passwordZodSchema,
});

export default signInZodSchema;