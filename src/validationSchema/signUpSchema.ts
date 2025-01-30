import { z } from "zod";

export const userNameZodSchema = z
  .string()
  .min(2, { message: "username must be at least 2 characters long" })
  .max(20, { message: "username must be at most 20 characters long" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*_)[a-zA-Z0-9_]{2,20}$/, {
    message:
      "username must contain one small and upper case letter with one digit and underscore(_) but not contain special character except _",
  });

export const passwordZodSchema = z
  .string()
  .min(8, { message: "password must be at least 8 characters long" })
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }
  );

export const emailZodSchema = z
  .string()
  .email({ message: "email is not valid" })
  .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: "email is not valid",
  });

export const signUpSchema = z.object({
  userName: userNameZodSchema,
  password: passwordZodSchema,
  email: emailZodSchema,
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
