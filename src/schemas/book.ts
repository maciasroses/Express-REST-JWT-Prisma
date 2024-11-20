import z from "zod";
import { validateSchema } from "../utils";

const baseSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

const createSchema = baseSchema.extend({
  authorId: z.string().min(1, {
    message: "Author is required",
  }),
});

const updateSchema = baseSchema.extend({});

const schemas = {
  create: createSchema,
  update: updateSchema,
};

export function validateBookSchema(action: string, data: unknown) {
  return validateSchema(schemas, action, data);
}
