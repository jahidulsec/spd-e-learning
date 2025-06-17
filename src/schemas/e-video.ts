import z from "zod";

export const createEVdieoDTOSchema = z.object({
  title: z.string().min(3),
  filename: z.string().min(3),
  e_detailing_id: z.string().min(1),
  team_member_id: z.string().min(1).optional(),
});

export const eVdieoQuerySchema = z.object({
  sort: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().default(1),
  size: z.coerce.number().default(20),
  search: z.string().optional(),
  e_detailing_id: z.string().optional(),
  team_id: z.string().optional(),
  quater_id: z.string().optional(),
  sort_type: z.enum(["created_at", "title"]).default("created_at"),
});

export const updateEVdieoDTOSchema = createEVdieoDTOSchema
  .omit({ e_detailing_id: true, team_member_id: true })
  .partial();

export type createEVdieoInputTypes = z.infer<typeof createEVdieoDTOSchema>;

export type eVdieoQueryInputTypes = z.infer<typeof eVdieoQuerySchema>;

export type updateEVdieoInputTypes = z.infer<typeof updateEVdieoDTOSchema>;
