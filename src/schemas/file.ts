import z from "zod";

export const createFileDTOSchema = z.object({
  title: z.string().min(3),
  folder_id: z.string().min(3),
  file_type: z.string().min(3),
  filename: z.string().min(3),
  is_archived: z.boolean().optional(),
});

export const fileQuerySchema = z.object({
  sort: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().default(1),
  size: z.coerce.number().default(20),
  search: z.string().optional(),
  sort_type: z.enum(["created_at", "title"]).default("created_at"),
  is_archived: z.enum(["0", "1"]).optional(),
});

export const updateFileDTOSchema = createFileDTOSchema
  .omit({ folder_id: true })
  .partial();

export type createFileInputTypes = z.infer<typeof createFileDTOSchema>;

export type fileQueryInputTypes = z.infer<typeof fileQuerySchema>;

export type updateFileInputTypes = z.infer<typeof updateFileDTOSchema>;
