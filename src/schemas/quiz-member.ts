import z from "zod";

export const createQuizMemberDTOSchema = z.object({
  quiz_id: z.string().min(1),
  team_member_id: z.string().min(1),
  end_at: z.coerce.date().optional(),
  duration_s: z.coerce.number().optional()
});

export const quizMemberQuerySchema = z.object({
  sort: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().default(1),
  size: z.coerce.number().default(20),
  search: z.string().optional(),
  quater_id: z.string().optional(),
  team_id: z.string().optional(),
  sort_type: z.enum(["created_at", "title"]).default("created_at"),
});

export const updateQuizMemberDTOSchema = createQuizMemberDTOSchema
  .omit({ quiz_id: true })
  .partial();

export type createQuizMemberInputTypes = z.infer<typeof createQuizMemberDTOSchema>;

export type quizMemberQueryInputTypes = z.infer<typeof quizMemberQuerySchema>;

export type updateQuizMemberInputTypes = z.infer<typeof updateQuizMemberDTOSchema>;
