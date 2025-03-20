import z from "zod";

export const createFileDTOSchema = z.object({
  title: z.string().min(3),
  folder_id: z.string(),
  file_type: z.string(),
  filename: z.string(),
});

export const fileQuerySchema = z.object({
  sort: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().default(1),
  size: z.coerce.number().default(20),
  search: z.string().optional(),
});

export const updateFileDTOSchema = createFileDTOSchema
  .omit({folder_id: true})
  .partial();

export type createFileInputTypes = z.infer<typeof createFileDTOSchema>;

export type fileQueryInputTypes = z.infer<typeof fileQuerySchema>;

export type updateFileInputTypes = z.infer<typeof updateFileDTOSchema>;
