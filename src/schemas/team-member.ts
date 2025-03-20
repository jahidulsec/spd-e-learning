import z from "zod";

export const createTeamMemberDTOSchema = z.object({
  team_id: z.string().min(3),
  user_id: z.string().min(3),
});

export const teamMemberQuerySchema = z.object({
  sort: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().default(1),
  size: z.coerce.number().default(20),
  search: z.string().optional(),
});

export const updateTeamMemberDTOSchema = createTeamMemberDTOSchema
  .omit({})
  .partial();

export type createTeamMemberInputTypes = z.infer<typeof createTeamMemberDTOSchema>;

export type teamMemberQueryInputTypes = z.infer<typeof teamMemberQuerySchema>;

export type updateTeamMemberInputTypes = z.infer<typeof updateTeamMemberDTOSchema>;
