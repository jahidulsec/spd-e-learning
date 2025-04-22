import z from "zod";

export const createResultDTOSchema = z.object({
  answer_id: z.string().min(3),
  team_member_id: z.string().min(1),
  question_id: z.string().min(1).optional(),
  score: z.coerce.number().optional(),
});

export const resultQuerySchema = z.object({
  sort: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().default(1),
  size: z.coerce.number().default(20),
  search: z.string().optional(),
  quiz_id: z.string().optional(),
});

export const updateResultDTOSchema = createResultDTOSchema
  .omit({ team_member_id: true })
  .partial();

export type createResultInputTypes = z.infer<typeof createResultDTOSchema>;

export type resultQueryInputTypes = z.infer<typeof resultQuerySchema>;

export type updateResultInputTypes = z.infer<typeof updateResultDTOSchema>;
