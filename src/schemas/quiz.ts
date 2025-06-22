import z from "zod";

export const createQuizDTOSchema = z.object({
  title: z.string().min(3),
  quater_id: z.string().min(3),
  team_id: z.string().min(3),
  description: z.string().min(3).optional(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  status: z.enum(["active", "inactive"]).optional(),
  is_archived: z.boolean().optional(),
});

export const quizQuerySchema = z.object({
  sort: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().default(1),
  size: z.coerce.number().default(20),
  search: z.string().optional(),
  sort_type: z.enum(["created_at", "title"]).default("created_at"),
  is_archived: z.enum(["0", "1"]).optional(),
});

export const updateQuizDTOSchema = createQuizDTOSchema
  .omit({ quater_id: true })
  .partial();

export type createQuizInputTypes = z.infer<typeof createQuizDTOSchema>;

export type quizQueryInputTypes = z.infer<typeof quizQuerySchema>;

export type updateQuizInputTypes = z.infer<typeof updateQuizDTOSchema>;
