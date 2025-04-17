import z from "zod";

export const createOptionDTOSchema = z.object({
  title: z.string().min(1),
  question_id: z.string().min(3),
  is_correct: z.boolean().optional(),
});

export const optionQuerySchema = z.object({
  sort: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().default(1),
  size: z.coerce.number().default(20),
  search: z.string().optional(),
});

export const updateOptionDTOSchema = createOptionDTOSchema
  .omit({ question_id: true })
  .partial();

export type createOptionInputTypes = z.infer<typeof createOptionDTOSchema>;

export type optionQueryInputTypes = z.infer<typeof optionQuerySchema>;

export type updateOptionInputTypes = z.infer<typeof updateOptionDTOSchema>;
