import z from "zod";
import { validateSchema } from "../utils";

const baseSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

const createSchema = baseSchema.extend({});

const updateSchema = baseSchema.extend({});

const schemas = {
  create: createSchema,
  update: updateSchema,
};

export function validateAuthorSchema(action: string, data: unknown) {
  return validateSchema(schemas, action, data);
}
