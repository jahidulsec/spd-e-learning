import z from "zod";

export const createCategoryDTOSchema = z.object({
  title: z.string().min(3),
  team_id: z.string(),
});

export const categoryQuerySchema = z.object({
  sort: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().default(1),
  size: z.coerce.number().default(20),
  search: z.string().optional(),
  sort_type: z.enum(["created_at", "title"]).default("created_at"),
});

export const updateCategoryDTOSchema = createCategoryDTOSchema
  .omit({ team_id: true })
  .partial();

export type createCategoryInputTypes = z.infer<typeof createCategoryDTOSchema>;

export type categoryQueryInputTypes = z.infer<typeof categoryQuerySchema>;

export type updateCategoryInputTypes = z.infer<typeof updateCategoryDTOSchema>;
