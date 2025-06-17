import z from "zod";

export const performanceMioQuerySchema = z.object({
  page: z.coerce.number().int().default(1),
  size: z.coerce.number().default(20),
});

export type performanceMioQueryInputTypes = z.infer<
  typeof performanceMioQuerySchema
>;
