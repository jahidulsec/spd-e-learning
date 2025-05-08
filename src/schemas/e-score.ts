import z from "zod";

export const createEScoreDTOSchema = z.object({
  video_id: z.string().min(1),
  score_starting: z.coerce.number(),
  score_content: z.coerce.number(),
  score_presentation: z.coerce.number(),
  score_closing: z.coerce.number(),
  comment: z.string().optional(),
  scored_by: z.string().min(1).optional(),
});

export const eScoreQuerySchema = z.object({
  sort: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().default(1),
  size: z.coerce.number().default(20),
  search: z.string().optional(),
  e_detailing_id: z.string().optional(),
  team_id: z.string().optional(),
  sort_type: z.enum(["created_at", "title"]).default("created_at"),
});

export const updateEScoreDTOSchema = createEScoreDTOSchema
  .omit({ video_id: true })
  .partial();

export type createEScoreInputTypes = z.infer<typeof createEScoreDTOSchema>;

export type eScoreQueryInputTypes = z.infer<typeof eScoreQuerySchema>;

export type updateEScoreInputTypes = z.infer<typeof updateEScoreDTOSchema>;
