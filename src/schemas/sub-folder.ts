import z from "zod";

export const createSubFolderDTOSchema = z.object({
  title: z.string().min(3),
  folder_id: z.string().min(3),
});

export const subFolderQuerySchema = z.object({
  sort: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().default(1),
  size: z.coerce.number().default(20),
  search: z.string().optional(),
});

export const updateFolderDTOSchema = createSubFolderDTOSchema
  .omit({ folder_id: true })
  .partial();

export type createSubFolderInputTypes = z.infer<typeof createSubFolderDTOSchema>;

export type subFolderQueryInputTypes = z.infer<typeof subFolderQuerySchema>;

export type updateSubFolderInputTypes = z.infer<typeof updateFolderDTOSchema>;
