import z from "zod";
import { validateSchema } from "../utils";

const baseSchema = z.object({
  email: z.string().email({
    message: "Email is invalid",
  }),
});

const loginSchema = baseSchema.extend({
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

const registerSchema = baseSchema.extend({
  password: z.string().min(8, {
    message: "Password is required and must be at least 8 characters",
  }),
  confirmPassword: z.string().min(8, {
    message:
      "The password confirmation is required and must be at least 8 characters",
  }),
  username: z.string().min(1, {
    message: "Username is required",
  }),
});

const schemas = {
  login: loginSchema,
  register: registerSchema,
};

export function validateUserSchema(action: string, data: unknown) {
  return validateSchema(schemas, action, data);
}
