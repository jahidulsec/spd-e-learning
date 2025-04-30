import z from "zod";

const optionSchema = z.object({
  title: z.string().min(1),
  is_correct: z.boolean().optional(),
});

export const createQuestionDTOSchema = z.object({
  title: z.string().min(1),
  quiz_id: z.string().min(1),
  options: z.array(optionSchema),
});

export const questionQuerySchema = z.object({
  sort: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().default(1),
  size: z.coerce.number().default(20),
  search: z.string().optional(),
  sort_type: z.enum(["created_at", "title"]).default("created_at"),
});

export const updateQuestionDTOSchema = createQuestionDTOSchema
  .omit({ quiz_id: true, options: true })
  .partial();

export type createQuestionInputTypes = z.infer<typeof createQuestionDTOSchema>;

export type questionQueryInputTypes = z.infer<typeof questionQuerySchema>;

export type updateQuestionInputTypes = z.infer<typeof updateQuestionDTOSchema>;
