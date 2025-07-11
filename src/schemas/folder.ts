import z from "zod";

export const createFolderDTOSchema = z.object({
  title: z.string().min(3),
  category_id: z.string().min(3),
  parent_folder_id: z.string().min(3).optional(),
  is_archived: z.boolean().optional(),
});

export const folderQuerySchema = z.object({
  sort: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().default(1),
  size: z.coerce.number().default(20),
  search: z.string().optional(),
  category_id: z.string().optional(),
  sort_type: z.enum(["created_at", "title"]).default("created_at"),
  is_archived: z.enum(["0", "1"]).optional(),
});

export const updateFolderDTOSchema = createFolderDTOSchema
  .omit({ category_id: true, parent_folder_id: true })
  .partial();

export type createFolderInputTypes = z.infer<typeof createFolderDTOSchema>;

export type folderQueryInputTypes = z.infer<typeof folderQuerySchema>;

export type updateFolderInputTypes = z.infer<typeof updateFolderDTOSchema>;
