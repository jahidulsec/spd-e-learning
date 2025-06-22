import z from "zod";

export const createEDetailingDTOSchema = z.object({
  title: z.string().min(3),
  team_id: z.string().min(1),
  quater_id: z.string().min(1),
  description: z.string().optional(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  score_starting: z.coerce.number(),
  score_content: z.coerce.number(),
  score_presentation: z.coerce.number(),
  score_closing: z.coerce.number(),
  is_archived: z.boolean().optional(),
});

export const eDetailingQuerySchema = z.object({
  sort: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().default(1),
  size: z.coerce.number().default(20),
  search: z.string().optional(),
  sort_type: z.enum(["created_at", "title"]).default("created_at"),
  is_archived: z.enum(["0", "1"]).optional(),
});

export const updateEDetailingDTOSchema = createEDetailingDTOSchema
  .omit({ team_id: true })
  .partial();

export type createEDetailingInputTypes = z.infer<
  typeof createEDetailingDTOSchema
>;

export type eDetailingQueryInputTypes = z.infer<typeof eDetailingQuerySchema>;

export type updateEDetailingInputTypes = z.infer<
  typeof updateEDetailingDTOSchema
>;
