import { z } from "zod";

export const SignupSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export const SigninSchema = z.object({
  email: z.string(),
  password: z.string(),
});
