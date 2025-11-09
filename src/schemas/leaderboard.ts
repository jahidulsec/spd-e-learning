import z from "zod";

export const LeaderboardQuerySchema = z.object({
  sort: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().default(1),
  size: z.coerce.number().default(20),
  search: z.string().optional(),
  team_id: z.string().optional(),
  quater_id: z.string().optional(),
  sort_type: z.enum(["created_at", "title"]).default("created_at"),
});

export type LeaderboardQueryInputTypes = z.infer<typeof LeaderboardQuerySchema>;

