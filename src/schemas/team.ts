import z from "zod";

export const createTeamDTOSchema = z.object({
  title: z.string().min(3),
});

export const teamQuerySchema = z.object({
  sort: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().default(1),
  size: z.coerce.number().default(20),
  search: z.string().optional(),
});

export const updateTeamDTOSchema = createTeamDTOSchema
  .omit({})
  .partial();

export type createTeamInputTypes = z.infer<typeof createTeamDTOSchema>;

export type teamQueryInputTypes = z.infer<typeof teamQuerySchema>;

export type updateTeamInputTypes = z.infer<typeof updateTeamDTOSchema>;
